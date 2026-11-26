-- Run only in a disposable database after all migrations:
--   psql -v ON_ERROR_STOP=1 -f tests/member-organizations.sql
-- Checks who can create, read, edit, submit, review and join organizations.
-- Rolls back at the end.
\set ON_ERROR_STOP on
begin;

insert into auth.users (id, email) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'admin@test.invalid'),
  ('11111111-1111-4111-8111-111111111111', 'owner@test.invalid'),
  ('22222222-2222-4222-8222-222222222222', 'Editor@Test.invalid'),
  ('33333333-3333-4333-8333-333333333333', 'outsider@test.invalid');
update public.profiles set role = 'admin' where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

create temporary table ctx (org uuid, token text) on commit drop;
grant all on ctx to authenticated;
insert into ctx values (null, null);

-- Visitors see nothing.
set local role anon;
do $$
begin
  begin
    perform 1 from public.organizations;
    raise exception 'Anon must not read organizations';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.create_organization('Anónima');
    raise exception 'Anon must not create organizations';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- Owner creates and fills the organization -----------------------------------
set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
do $$
declare
  v_org uuid;
begin
  v_org := public.create_organization('  Fundación Prueba  ');
  update ctx set org = v_org;
  if (select name from public.organizations where id = v_org) <> 'Fundación Prueba' then raise exception 'Name not trimmed'; end if;
  if (select role from public.organization_members where organization_id = v_org) <> 'owner' then raise exception 'Creator must be owner'; end if;

  begin
    perform public.create_organization('Otra');
    raise exception 'One organization per account';
  exception when unique_violation then null;
  end;

  begin
    insert into public.organizations (name) values ('Directa');
    raise exception 'Direct inserts must be refused';
  exception when insufficient_privilege then null;
  end;

  begin
    update public.organizations set status = 'approved' where id = v_org;
    raise exception 'Members must not change the status';
  exception when insufficient_privilege then null;
  end;

  begin
    perform public.submit_organization(v_org);
    raise exception 'Submitting without required fields must fail';
  exception when check_violation then null;
  end;

  begin
    update public.organizations set expense_programs_pct = 70, expense_admin_pct = 20, expense_fundraising_pct = 5 where id = v_org;
    raise exception 'Expense split must add up to 100';
  exception when check_violation then null;
  end;

  update public.organizations set
    entity_type = 'foundation', country = 'Colombia', mission = 'Educar a niños', causes = array['education'],
    contact_name = 'Ana', contact_email = 'ana@test.invalid', annual_budget_range = '10k_50k',
    expense_programs_pct = 75, expense_admin_pct = 15, expense_fundraising_pct = 10,
    income_mix = '{"individuals": 60, "churches": 40}'
  where id = v_org;

  perform public.submit_organization(v_org);
  if (select status from public.organizations where id = v_org) <> 'submitted' then raise exception 'Submit did not apply'; end if;
  if (select data_consent_at from public.organizations where id = v_org) is null then raise exception 'Consent time missing'; end if;

  begin
    perform public.submit_organization(v_org);
    raise exception 'Double submit must fail';
  exception when object_not_in_prerequisite_state then null;
  end;

  begin
    perform public.review_organization(v_org, 'approved', null);
    raise exception 'Owners must not approve themselves';
  exception when insufficient_privilege then null;
  end;

  begin
    perform public.create_organization_invitation(v_org, 'x@test.invalid', 'owner');
    raise exception 'Nobody is invited as owner';
  exception when invalid_parameter_value then null;
  end;

  update ctx set token = public.create_organization_invitation(v_org, 'editor@test.invalid', 'editor');
  if length((select token from ctx)) <> 64 then raise exception 'Unexpected token length'; end if;
  begin
    perform token_hash from public.organization_invitations;
    raise exception 'Token hashes must not be readable';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

do $$
begin
  if exists (select 1 from public.organization_invitations where token_hash = (select token from ctx)) then
    raise exception 'The raw token must not be stored';
  end if;
end $$;

-- Outsider cannot see it, edit it, or use someone else's invitation --------------
set local role authenticated;
select set_config('request.jwt.claim.sub', '33333333-3333-4333-8333-333333333333', true);
do $$
declare
  changed integer;
begin
  if exists (select 1 from public.organizations) then raise exception 'Outsider reads an organization'; end if;
  if (select count(*) from public.profiles) <> 1 then raise exception 'Outsider should only read their own profile'; end if;
  update public.organizations set mission = 'hack';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Outsider edited an organization'; end if;
  begin
    perform public.accept_organization_invitation((select token from ctx));
    raise exception 'Invitation for another email must be refused';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.accept_organization_invitation('not-a-token');
    raise exception 'Unknown token must be refused';
  exception when no_data_found then null;
  end;
end $$;
reset role;

-- Invited editor joins (email compared without case) -----------------------------
set local role authenticated;
select set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true);
do $$
declare
  changed integer;
begin
  if public.accept_organization_invitation((select token from ctx)) <> (select org from ctx) then
    raise exception 'Accept returned the wrong organization';
  end if;
  if (select role from public.organization_members where user_id = '22222222-2222-4222-8222-222222222222') <> 'editor' then
    raise exception 'Editor role not applied';
  end if;
  if (select count(*) from public.organizations) <> 1 then raise exception 'Editor should read the organization'; end if;
  if (select count(*) from public.profiles) <> 2 then raise exception 'Editor should read their own and the owner''s profile'; end if;
  update public.organizations set vision = 'Más niños en la escuela' where id = (select org from ctx);
  get diagnostics changed = row_count;
  if changed <> 1 then raise exception 'Editor should edit onboarding fields'; end if;
  if exists (select 1 from public.organization_invitations) then raise exception 'Only owners read invitations'; end if;
  delete from public.organization_members where user_id = '11111111-1111-4111-8111-111111111111';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Editors must not remove members'; end if;
  begin
    perform public.accept_organization_invitation((select token from ctx));
    raise exception 'A token works only once';
  exception when no_data_found then null;
  end;
  if exists (select 1 from public.organization_notes) then raise exception 'Members must not read internal notes'; end if;
end $$;
reset role;

-- Admin reviews and keeps notes ---------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true);
do $$
begin
  if (select count(*) from public.organizations) <> 1 then raise exception 'Admin should read every organization'; end if;
  begin
    perform public.review_organization((select org from ctx), 'draft', null);
    raise exception 'Review accepts only approve or request changes';
  exception when invalid_parameter_value then null;
  end;
  perform public.review_organization((select org from ctx), 'changes_requested', '  Falta el sitio web  ');
  if (select review_message from public.organizations where id = (select org from ctx)) <> 'Falta el sitio web' then
    raise exception 'Review message not stored';
  end if;
  insert into public.organization_notes (organization_id, author_id, body) values ((select org from ctx), auth.uid(), 'Llamar en enero');
  if (select count(*) from public.organization_notes) <> 1 then raise exception 'Admin note missing'; end if;
end $$;
reset role;

-- Owner resubmits after changes, removes the editor, cannot remove themself --------
set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
do $$
declare
  changed integer;
begin
  perform public.submit_organization((select org from ctx));
  delete from public.organization_members where user_id = '11111111-1111-4111-8111-111111111111';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Owner must not remove themself'; end if;
  delete from public.organization_members where user_id = '22222222-2222-4222-8222-222222222222';
  get diagnostics changed = row_count;
  if changed <> 1 then raise exception 'Owner should remove the editor'; end if;
end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true);
select public.review_organization((select org from ctx), 'approved', null);
reset role;
do $$
begin
  if (select status from public.organizations) <> 'approved' then raise exception 'Approval did not apply'; end if;
end $$;

\echo 'member-organizations: all checks passed'
rollback;
