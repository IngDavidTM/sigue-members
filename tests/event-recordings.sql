-- Run only in a disposable database after all migrations:
--   psql -v ON_ERROR_STOP=1 -f tests/event-recordings.sql
-- Checks who can read and write webinar recordings. Rolls back at the end.
\set ON_ERROR_STOP on
begin;

insert into auth.users (id, email) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'admin@test.invalid'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'member@test.invalid');
update public.profiles set role = 'admin' where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

-- past = finished and published, future = not finished yet, draft = finished but unpublished event.
insert into public.events (id, status, starts_at, ends_at, published_at) values
  ('11111111-1111-4111-8111-111111111111', 'published', now() - interval '10 days', now() - interval '10 days' + interval '1 hour', now() - interval '20 days'),
  ('22222222-2222-4222-8222-222222222222', 'published', now() + interval '10 days', now() + interval '10 days' + interval '1 hour', now() - interval '1 day'),
  ('33333333-3333-4333-8333-333333333333', 'draft', now() - interval '5 days', now() - interval '5 days' + interval '1 hour', null),
  ('44444444-4444-4444-8444-444444444444', 'published', now() - interval '3 days', now() - interval '3 days' + interval '1 hour', now() - interval '4 days');

insert into public.event_recordings (event_id, video_url, sigue_axis, summary_es_html, is_published) values
  ('11111111-1111-4111-8111-111111111111', 'https://youtu.be/dQw4w9WgXcQ', 'servir', '<p>Resumen</p>', true),
  ('22222222-2222-4222-8222-222222222222', 'https://youtu.be/dQw4w9WgXcQ', null, '<p>Futuro</p>', true),
  ('33333333-3333-4333-8333-333333333333', 'https://youtu.be/dQw4w9WgXcQ', null, '<p>Borrador</p>', true),
  ('44444444-4444-4444-8444-444444444444', 'https://youtu.be/dQw4w9WgXcQ', null, '<p>Oculta</p>', false);

do $$
begin
  begin
    insert into public.event_recordings (event_id, video_url) values ('11111111-1111-4111-8111-111111111111', 'http://inseguro.org');
    raise exception 'Expected a non-https video URL to be rejected';
  exception when check_violation then null;
  end;
end $$;

-- Visitors ------------------------------------------------------------
set local role anon;
do $$
begin
  begin
    perform 1 from public.event_recordings;
    raise exception 'Anon must not read event_recordings';
  exception when insufficient_privilege then null;
  end;
  if (select count(*) from public.public_event_recordings) <> 1 then
    raise exception 'Anon should only learn about the published recording of the finished event';
  end if;
  if (select event_id from public.public_event_recordings) <> '11111111-1111-4111-8111-111111111111' then
    raise exception 'Wrong event in public_event_recordings';
  end if;
  begin
    update public.public_event_recordings set sigue_axis = 'guiar';
    raise exception 'Anon must not write through the view';
  exception when insufficient_privilege or object_not_in_prerequisite_state or feature_not_supported then null;
  end;
end $$;
reset role;

-- Signed-in member ------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claim.sub', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', true);
do $$
declare
  changed integer;
begin
  if (select count(*) from public.event_recordings) <> 1 then
    raise exception 'A member should read exactly one recording, got %', (select count(*) from public.event_recordings);
  end if;
  if (select video_url from public.event_recordings) <> 'https://youtu.be/dQw4w9WgXcQ' then
    raise exception 'A member should read the video link of a published recording';
  end if;
  update public.event_recordings set summary_es_html = 'hack';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'A member must not update recordings'; end if;
  delete from public.event_recordings;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'A member must not delete recordings'; end if;
  begin
    insert into public.event_recordings (event_id, video_url) values ('22222222-2222-4222-8222-222222222222', 'https://youtu.be/x');
    raise exception 'A member must not insert recordings';
  exception when insufficient_privilege or unique_violation then null;
  end;
end $$;
reset role;

-- Admin -------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true);
do $$
begin
  if (select count(*) from public.event_recordings) <> 4 then
    raise exception 'An admin should read every recording';
  end if;
  update public.event_recordings set is_published = true, materials = '[{"label":"Deck","url":"https://example.org/d.pdf"}]'
  where event_id = '44444444-4444-4444-8444-444444444444';
  if not (select is_published from public.event_recordings where event_id = '44444444-4444-4444-8444-444444444444') then
    raise exception 'Admin update did not apply';
  end if;
  begin
    update public.event_recordings set materials = '{"not":"an array"}' where event_id = '44444444-4444-4444-8444-444444444444';
    raise exception 'Materials must be a JSON array';
  exception when check_violation then null;
  end;
end $$;
reset role;

-- Deleting the event removes its recording.
delete from public.events where id = '11111111-1111-4111-8111-111111111111';
do $$
begin
  if exists (select 1 from public.event_recordings where event_id = '11111111-1111-4111-8111-111111111111') then
    raise exception 'Recording should be deleted with its event';
  end if;
end $$;

\echo 'event-recordings: all checks passed'
rollback;
