-- Security hardening (2026-11-21).
--
-- 1. approved_blog_comments: the view reads a single table and runs with its
--    owner's rights, so Postgres treats it as updatable and RLS on
--    blog_comments does not apply. With Supabase's default grants, anyone with
--    the anon key could UPDATE or DELETE approved comments through it.
--    Visitors only need to read it. It now also hides comments of posts that
--    are no longer published.
-- 2. Anonymous users keep SELECT only: no write privileges on any table or
--    view in public (all public writes go through SECURITY DEFINER functions).
-- 3. dynamic_forms: visitors can read only the visitor-facing columns, not the
--    staff inboxes (notification_emails), reply-to settings or admin IDs.
-- 4. Comments: besides the per-email limit, cap comments per post and in total,
--    since a bot can change the email on every request.
-- 5. Public forms: cap submissions per form across all visitors, as a backstop
--    to the per-IP limit.
-- 6. Storage: stop anyone from listing every file in content-media. Files stay
--    downloadable through their public URL (public bucket); only admins can
--    list them.

-- 1 + 2 ---------------------------------------------------------------------
revoke insert, update, delete, truncate, references, trigger
  on all tables in schema public from anon;
revoke insert, update, delete, truncate, references, trigger
  on public.approved_blog_comments, public.public_event_access from authenticated;

create or replace view public.approved_blog_comments
with (security_barrier = true)
as
select
  c.id,
  c.post_id,
  c.parent_id,
  c.locale,
  c.author_name,
  c.author_website,
  c.content,
  c.created_at
from public.blog_comments c
join public.blog_posts p on p.id = c.post_id
where c.status = 'approved'
  and p.status in ('published', 'scheduled')
  and p.published_at <= now();

-- The join makes the view non-updatable as well; keep read access explicit.
revoke all on public.approved_blog_comments from anon, authenticated;
grant select on public.approved_blog_comments to anon, authenticated;

-- New tables created later must not be writable by anon by default.
alter default privileges in schema public
  revoke insert, update, delete, truncate, references, trigger on tables from anon;

-- 3 -------------------------------------------------------------------------
revoke select on public.dynamic_forms from anon;
grant select (
  id, slug, status,
  title_es, title_en,
  description_es, description_en,
  submit_label_es, submit_label_en
) on public.dynamic_forms to anon;

-- 4 -------------------------------------------------------------------------
create or replace function public.submit_blog_comment(
  p_post_id uuid,
  p_parent_id uuid,
  p_locale text,
  p_author_name text,
  p_author_email text,
  p_author_website text,
  p_content text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_comment_id uuid;
begin
  if p_locale not in ('es', 'en') then
    raise exception 'Invalid locale';
  end if;
  if char_length(trim(p_author_name)) not between 2 and 100 then
    raise exception 'Invalid author name';
  end if;
  if char_length(p_author_email) > 254
    or p_author_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Invalid email';
  end if;
  if p_author_website is not null and trim(p_author_website) <> ''
    and (char_length(p_author_website) > 500 or p_author_website !~* '^https?://[^[:space:]]+$') then
    raise exception 'Invalid website';
  end if;
  if char_length(trim(p_content)) not between 2 and 4000 then
    raise exception 'Invalid comment length';
  end if;
  if not exists (
    select 1 from public.blog_posts
    where id = p_post_id
      and status in ('published', 'scheduled')
      and published_at <= now()
      and allow_comments
  ) then
    raise exception 'Comments are closed';
  end if;
  if p_parent_id is not null and not exists (
    select 1 from public.blog_comments
    where id = p_parent_id and post_id = p_post_id and status = 'approved'
  ) then
    raise exception 'Invalid parent comment';
  end if;

  -- Serialize submissions per post so the counts below are reliable.
  perform pg_advisory_xact_lock(hashtextextended('blog_comment:' || p_post_id::text, 0));
  if (
    select count(*) from public.blog_comments
    where post_id = p_post_id
      and lower(author_email) = lower(trim(p_author_email))
      and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'Rate limit exceeded';
  end if;
  if (
    select count(*) from public.blog_comments
    where post_id = p_post_id
      and created_at > now() - interval '10 minutes'
  ) >= 20 then
    raise exception 'Rate limit exceeded';
  end if;
  if (
    select count(*) from public.blog_comments
    where status = 'pending'
      and created_at > now() - interval '1 hour'
  ) >= 100 then
    raise exception 'Rate limit exceeded';
  end if;

  insert into public.blog_comments (
    post_id, parent_id, locale, author_name, author_email, author_website, content
  ) values (
    p_post_id,
    p_parent_id,
    p_locale,
    trim(p_author_name),
    lower(trim(p_author_email)),
    nullif(trim(p_author_website), ''),
    trim(p_content)
  ) returning id into new_comment_id;

  return new_comment_id;
end;
$$;

revoke all on function public.submit_blog_comment(uuid, uuid, text, text, text, text, text) from public;
grant execute on function public.submit_blog_comment(uuid, uuid, text, text, text, text, text)
  to anon, authenticated;

-- 5 -------------------------------------------------------------------------
create or replace function public.submit_dynamic_form(
  p_slug text,
  p_locale text,
  p_answers jsonb,
  p_source_path text,
  p_request_fingerprint text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_form_id uuid;
  recent_attempts integer;
begin
  if p_request_fingerprint !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid request fingerprint' using errcode = '22023';
  end if;
  -- Public submissions always come from a page on this site.
  if p_source_path is not null
    and (char_length(p_source_path) > 500 or p_source_path !~ '^/([^/[:space:]][^[:space:]]*)?$') then
    raise exception 'Invalid source path' using errcode = '22023';
  end if;

  select id into selected_form_id
  from public.dynamic_forms
  where slug = p_slug and status = 'published';
  if not found then
    raise exception 'Form not found' using errcode = 'P0002';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(selected_form_id::text || p_request_fingerprint, 0));
  select count(*) into recent_attempts
  from public.dynamic_form_submission_attempts
  where form_id = selected_form_id
    and request_fingerprint = p_request_fingerprint
    and created_at >= now() - interval '10 minutes';

  if recent_attempts >= 5 then
    raise exception 'Rate limit exceeded' using errcode = 'P0001';
  end if;

  -- Backstop for many addresses at once: at most 300 per form in 10 minutes.
  if (
    select count(*) from public.dynamic_form_submission_attempts
    where form_id = selected_form_id
      and created_at >= now() - interval '10 minutes'
  ) >= 300 then
    raise exception 'Rate limit exceeded' using errcode = 'P0001';
  end if;

  insert into public.dynamic_form_submission_attempts(form_id, request_fingerprint)
  values (selected_form_id, p_request_fingerprint);

  return public.submit_dynamic_form(p_slug, p_locale, p_answers, p_source_path);
end;
$$;

revoke all on function public.submit_dynamic_form(text, text, jsonb, text, text)
from public, anon, authenticated;
grant execute on function public.submit_dynamic_form(text, text, jsonb, text, text)
to service_role;

create index if not exists dynamic_form_attempt_form_recent_idx
on public.dynamic_form_submission_attempts(form_id, created_at desc);

-- 6 -------------------------------------------------------------------------
drop policy if exists "Public reads content media" on storage.objects;
drop policy if exists "Admins read content media" on storage.objects;
create policy "Admins read content media"
on storage.objects for select to authenticated
using (bucket_id = 'content-media' and public.is_admin());
