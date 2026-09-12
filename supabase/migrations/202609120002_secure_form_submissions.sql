-- Keep public form writes behind the application server and rate-limit them.

create table public.dynamic_form_submission_attempts (
  id bigint generated always as identity primary key,
  form_id uuid not null references public.dynamic_forms(id) on delete cascade,
  request_fingerprint text not null,
  created_at timestamptz not null default now(),
  constraint dynamic_form_attempt_fingerprint_shape
    check (request_fingerprint ~ '^[a-f0-9]{64}$')
);

create index dynamic_form_attempt_window_idx
on public.dynamic_form_submission_attempts(form_id, request_fingerprint, created_at desc);

alter table public.dynamic_form_submission_attempts enable row level security;
revoke all on public.dynamic_form_submission_attempts from public, anon, authenticated;

revoke execute on function public.submit_dynamic_form(text, text, jsonb, text)
from anon, authenticated;

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

  insert into public.dynamic_form_submission_attempts(form_id, request_fingerprint)
  values (selected_form_id, p_request_fingerprint);

  return public.submit_dynamic_form(p_slug, p_locale, p_answers, p_source_path);
end;
$$;

revoke all on function public.submit_dynamic_form(text, text, jsonb, text, text)
from public, anon, authenticated;
grant execute on function public.submit_dynamic_form(text, text, jsonb, text, text)
to service_role;
