-- Atomic saves: parent, translations, tags/private access commit together.
-- SECURITY INVOKER retains RLS; only authenticated administrators can execute.

create or replace function public.save_blog_content(
  p_id uuid, p_record jsonb, p_translations jsonb, p_expected_updated_at timestamptz,
  p_tag_ids uuid[]
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_id uuid;
  existing public.blog_posts%rowtype;
  incoming public.blog_posts%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if jsonb_typeof(p_translations) is distinct from 'array'
    or jsonb_array_length(p_translations) <> 2
    or not p_translations @> '[{"locale":"es"},{"locale":"en"}]'::jsonb then
    raise exception 'Both translations are required' using errcode = '23514';
  end if;
  if p_id is not null then
    select * into existing from public.blog_posts where id = p_id for update;
    if not found then raise exception 'Content no longer exists' using errcode = 'P0002'; end if;
    if p_expected_updated_at is null or existing.updated_at <> p_expected_updated_at then
      raise exception 'Content changed since it was opened' using errcode = '40001';
    end if;
  end if;
  incoming := jsonb_populate_record(null::public.blog_posts, p_record);
  if p_id is null then
    insert into public.blog_posts (status, series_id, featured_image_url, author_name, is_featured, allow_comments, reading_time_minutes, published_at, created_by, updated_by)
    values (incoming.status, incoming.series_id, incoming.featured_image_url, incoming.author_name, incoming.is_featured, incoming.allow_comments, incoming.reading_time_minutes, incoming.published_at, auth.uid(), auth.uid()) returning id into saved_id;
  else
    update public.blog_posts set
      status = incoming.status, series_id = incoming.series_id, featured_image_url = incoming.featured_image_url, author_name = incoming.author_name, is_featured = incoming.is_featured, allow_comments = incoming.allow_comments, reading_time_minutes = incoming.reading_time_minutes, published_at = incoming.published_at, updated_by = auth.uid()
    where id = p_id returning id into saved_id;
  end if;
  insert into public.blog_post_translations (post_id, locale, title, slug, excerpt, content_html, image_alt, seo_title, seo_description, focus_keyphrase, canonical_url, og_title, og_description, og_image_url, noindex, nofollow, schema_type)
  select saved_id, t.locale, t.title, t.slug, t.excerpt, t.content_html, t.image_alt, t.seo_title, t.seo_description, t.focus_keyphrase, t.canonical_url, t.og_title, t.og_description, t.og_image_url, t.noindex, t.nofollow, t.schema_type
  from jsonb_populate_recordset(null::public.blog_post_translations, p_translations) as t
  on conflict (post_id, locale) do update set
    title = excluded.title, slug = excluded.slug, excerpt = excluded.excerpt, content_html = excluded.content_html, image_alt = excluded.image_alt, seo_title = excluded.seo_title, seo_description = excluded.seo_description, focus_keyphrase = excluded.focus_keyphrase, canonical_url = excluded.canonical_url, og_title = excluded.og_title, og_description = excluded.og_description, og_image_url = excluded.og_image_url, noindex = excluded.noindex, nofollow = excluded.nofollow, schema_type = excluded.schema_type;
  delete from public.blog_post_tags where post_id = saved_id;
  insert into public.blog_post_tags (post_id, tag_id)
  select saved_id, tag_id from unnest(coalesce(p_tag_ids, array[]::uuid[])) as tag_id;
  return saved_id;
end;
$$;
revoke all on function public.save_blog_content(uuid, jsonb, jsonb, timestamptz, uuid[]) from public, anon;
grant execute on function public.save_blog_content(uuid, jsonb, jsonb, timestamptz, uuid[]) to authenticated;

create or replace function public.save_event_content(
  p_id uuid, p_record jsonb, p_translations jsonb, p_expected_updated_at timestamptz,
  p_access jsonb
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_id uuid;
  existing public.events%rowtype;
  incoming public.events%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if jsonb_typeof(p_translations) is distinct from 'array'
    or jsonb_array_length(p_translations) <> 2
    or not p_translations @> '[{"locale":"es"},{"locale":"en"}]'::jsonb then
    raise exception 'Both translations are required' using errcode = '23514';
  end if;
  if p_id is not null then
    select * into existing from public.events where id = p_id for update;
    if not found then raise exception 'Content no longer exists' using errcode = 'P0002'; end if;
    if p_expected_updated_at is null or existing.updated_at <> p_expected_updated_at then
      raise exception 'Content changed since it was opened' using errcode = '40001';
    end if;
  end if;
  incoming := jsonb_populate_record(null::public.events, p_record);
  incoming.published_at := coalesce(incoming.published_at, existing.published_at);
  if incoming.status in ('published', 'cancelled') then
    incoming.published_at := coalesce(incoming.published_at, now());
  end if;
  if p_id is null then
    insert into public.events (status, attendance_mode, starts_at, ends_at, timezone, all_day, venue_id, show_virtual_url, registration_url, registration_deadline, capacity, is_free, price_amount, currency, featured_image_url, is_featured, organizer_name, published_at, created_by, updated_by)
    values (incoming.status, incoming.attendance_mode, incoming.starts_at, incoming.ends_at, incoming.timezone, incoming.all_day, incoming.venue_id, incoming.show_virtual_url, incoming.registration_url, incoming.registration_deadline, incoming.capacity, incoming.is_free, incoming.price_amount, incoming.currency, incoming.featured_image_url, incoming.is_featured, incoming.organizer_name, incoming.published_at, auth.uid(), auth.uid()) returning id into saved_id;
  else
    update public.events set
      status = incoming.status, attendance_mode = incoming.attendance_mode, starts_at = incoming.starts_at, ends_at = incoming.ends_at, timezone = incoming.timezone, all_day = incoming.all_day, venue_id = incoming.venue_id, show_virtual_url = incoming.show_virtual_url, registration_url = incoming.registration_url, registration_deadline = incoming.registration_deadline, capacity = incoming.capacity, is_free = incoming.is_free, price_amount = incoming.price_amount, currency = incoming.currency, featured_image_url = incoming.featured_image_url, is_featured = incoming.is_featured, organizer_name = incoming.organizer_name, published_at = incoming.published_at, updated_by = auth.uid()
    where id = p_id returning id into saved_id;
  end if;
  insert into public.event_translations (event_id, locale, title, slug, excerpt, content_html, agenda_html, image_alt, seo_title, seo_description, focus_keyphrase, canonical_url, og_title, og_description, og_image_url, noindex, nofollow)
  select saved_id, t.locale, t.title, t.slug, t.excerpt, t.content_html, t.agenda_html, t.image_alt, t.seo_title, t.seo_description, t.focus_keyphrase, t.canonical_url, t.og_title, t.og_description, t.og_image_url, t.noindex, t.nofollow
  from jsonb_populate_recordset(null::public.event_translations, p_translations) as t
  on conflict (event_id, locale) do update set
    title = excluded.title, slug = excluded.slug, excerpt = excluded.excerpt, content_html = excluded.content_html, agenda_html = excluded.agenda_html, image_alt = excluded.image_alt, seo_title = excluded.seo_title, seo_description = excluded.seo_description, focus_keyphrase = excluded.focus_keyphrase, canonical_url = excluded.canonical_url, og_title = excluded.og_title, og_description = excluded.og_description, og_image_url = excluded.og_image_url, noindex = excluded.noindex, nofollow = excluded.nofollow;
  insert into public.event_private_access (event_id, virtual_url, organizer_email)
  values (saved_id, p_access->>'virtual_url', p_access->>'organizer_email')
  on conflict (event_id) do update set virtual_url = excluded.virtual_url, organizer_email = excluded.organizer_email;
  return saved_id;
end;
$$;
revoke all on function public.save_event_content(uuid, jsonb, jsonb, timestamptz, jsonb) from public, anon;
grant execute on function public.save_event_content(uuid, jsonb, jsonb, timestamptz, jsonb) to authenticated;
