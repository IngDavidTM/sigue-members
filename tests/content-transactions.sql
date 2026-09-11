-- Run only in a disposable database after all content migrations.
\set ON_ERROR_STOP on
begin;
insert into auth.users (id, email, raw_user_meta_data) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'admin@test.invalid', '{}'), ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'user@test.invalid', '{}');
update public.profiles set role = 'admin' where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
set local role authenticated;
select set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true);
do $$
declare
  v_post_id uuid;
  v_event_id uuid;
  version timestamptz;
  record jsonb := '{"status":"published","author_name":"Admin","is_featured":false,"allow_comments":true,"reading_time_minutes":1,"published_at":"2026-01-01T00:00:00Z"}';
  translations jsonb := '[{"locale":"es","title":"Título de prueba","slug":"prueba","content_html":"<p>Contenido</p>","schema_type":"BlogPosting","noindex":false,"nofollow":false},{"locale":"en","title":"Test title","slug":"test","content_html":"<p>Content</p>","schema_type":"BlogPosting","noindex":false,"nofollow":false}]';
  event_record jsonb := '{"status":"published","attendance_mode":"virtual","starts_at":"2026-10-27T14:00:00Z","ends_at":"2026-10-27T16:00:00Z","timezone":"America/Bogota","all_day":false,"show_virtual_url":false,"is_free":true,"currency":"USD","is_featured":false}';
begin
  v_post_id := public.save_blog_content(null, record, translations, null, array[]::uuid[]);
  select updated_at into version from public.blog_posts where id = v_post_id;
  if (select count(*) from public.blog_post_translations t where t.post_id = v_post_id) < 2 then raise exception 'Translations missing'; end if;
  -- A FK failure in the final step must roll back the parent and translation edits.
  begin
    perform public.save_blog_content(v_post_id, record || '{"author_name":"Must roll back"}', translations || '[]', version, array['cccccccc-cccc-4ccc-8ccc-cccccccccccc']::uuid[]);
    raise exception 'Expected FK failure';
  exception when foreign_key_violation then null;
  end;
  if (select author_name from public.blog_posts where id = v_post_id) <> 'Admin' then raise exception 'Partial update committed'; end if;
  begin
    perform public.save_blog_content(v_post_id, record, translations, version - interval '1 second', array[]::uuid[]);
    raise exception 'Expected concurrent edit rejection';
  exception when serialization_failure then null;
  end;
  perform public.save_blog_content(v_post_id, record || '{"author_name":"Updated"}', translations, version, array[]::uuid[]);
  if (select author_name from public.blog_posts where id = v_post_id) <> 'Updated' then raise exception 'Update failed'; end if;
  begin
    perform public.save_blog_content(null, record, translations, null, array[]::uuid[]);
    raise exception 'Expected duplicate slug failure';
  exception when unique_violation then null;
  end;
  if (select count(*) from public.blog_posts) <> 1 then raise exception 'Failed create left an orphan'; end if;
  v_event_id := public.save_event_content(null, event_record, translations, null, '{"virtual_url":"https://example.org/private","organizer_email":"organizer@test.invalid"}');
  if (select published_at from public.events where id = v_event_id) is null then raise exception 'Event publication date missing'; end if;
  if (select count(*) from public.public_event_access) <> 0 then raise exception 'Private event URL leaked'; end if;
  select updated_at into version from public.events where id = v_event_id;
  begin
    perform public.save_event_content(v_event_id, event_record || '{"organizer_name":"Must roll back"}', jsonb_set(translations, '{0,title}', '"x"'), version, '{}');
    raise exception 'Expected translation validation failure';
  exception when check_violation then null;
  end;
  if (select organizer_name from public.events where id = v_event_id) is not null then raise exception 'Partial event update'; end if;
  perform set_config('request.jwt.claim.sub', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', true);
  begin
    perform public.save_event_content(null, event_record, translations, null, '{}');
    raise exception 'Non-admin write succeeded';
  exception when insufficient_privilege then null;
  end;
end;
$$;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
do $$ begin
  if (select count(*) from public.blog_posts) <> 1 then raise exception 'Published blog not readable'; end if;
  if has_function_privilege('anon', 'public.save_blog_content(uuid,jsonb,jsonb,timestamptz,uuid[])', 'execute') then raise exception 'Anonymous RPC privilege'; end if;
end $$;
rollback;
