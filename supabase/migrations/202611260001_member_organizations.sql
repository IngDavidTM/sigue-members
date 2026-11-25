-- Member organizations (2026-11-26).
--
-- The member is the organization, not the person. A signed-in user creates
-- an organization (and becomes its owner), fills in the onboarding steps and
-- submits it for review. SIGUE admins approve it or ask for changes, and keep
-- internal notes the organization never sees. Owners invite other people by
-- link.
--
-- Members never write status or review columns directly: column privileges
-- leave those to SECURITY DEFINER functions that check who is calling.
--
-- Adds objects only, so it works with the previous and the new app version.

create type public.organization_status as enum ('draft', 'submitted', 'changes_requested', 'approved');
create type public.organization_role as enum ('owner', 'editor', 'viewer');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 160),

  -- Step 1: identity
  legal_name text check (legal_name is null or length(legal_name) <= 200),
  entity_type text check (entity_type in ('ngo', 'foundation', 'church', 'social_enterprise', 'informal', 'other')),
  country text check (country is null or length(country) <= 80),
  city text check (city is null or length(city) <= 120),
  founded_year integer check (founded_year is null or founded_year between 1800 and 2100),
  tax_id text check (tax_id is null or length(tax_id) <= 60),
  website text check (website is null or (website ~ '^https?://[^\s]+$' and length(website) <= 300)),
  social_url text check (social_url is null or (social_url ~ '^https?://[^\s]+$' and length(social_url) <= 300)),

  -- Step 2: mission and reach
  mission text check (mission is null or length(mission) <= 1500),
  vision text check (vision is null or length(vision) <= 1500),
  causes text[] not null default '{}' check (cardinality(causes) <= 12),
  populations text check (populations is null or length(populations) <= 500),
  regions text check (regions is null or length(regions) <= 500),
  beneficiaries_range text check (beneficiaries_range in ('lt_100', '100_500', '500_2000', '2000_10000', 'gt_10000')),

  -- Step 3: team
  paid_staff_range text check (paid_staff_range in ('none', '1_5', '6_20', '21_50', 'gt_50')),
  volunteers_range text check (volunteers_range in ('none', '1_10', '11_50', '51_200', 'gt_200')),
  has_board boolean,
  board_size integer check (board_size is null or board_size between 0 and 100),
  contact_name text check (contact_name is null or length(contact_name) <= 160),
  contact_email text check (contact_email is null or (contact_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' and length(contact_email) <= 254)),
  contact_phone text check (contact_phone is null or length(contact_phone) <= 40),

  -- Step 4: finances, in ranges and percentages (no bank or account data)
  annual_budget_range text check (annual_budget_range in ('lt_10k', '10k_50k', '50k_250k', '250k_1m', 'gt_1m')),
  budget_currency char(3) not null default 'USD' check (budget_currency ~ '^[A-Z]{3}$'),
  -- {"individuals": 40, "churches": 30, ...}: percentages by source.
  income_mix jsonb not null default '{}'::jsonb check (jsonb_typeof(income_mix) = 'object'),
  expense_programs_pct smallint check (expense_programs_pct between 0 and 100),
  expense_admin_pct smallint check (expense_admin_pct between 0 and 100),
  expense_fundraising_pct smallint check (expense_fundraising_pct between 0 and 100),
  has_financial_statements boolean,
  has_external_audit boolean,

  -- Review
  status public.organization_status not null default 'draft',
  data_consent_at timestamptz,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  review_message text check (review_message is null or length(review_message) <= 2000),

  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint expense_split_is_100 check (
    (expense_programs_pct is null and expense_admin_pct is null and expense_fundraising_pct is null)
    or coalesce(expense_programs_pct, 0) + coalesce(expense_admin_pct, 0) + coalesce(expense_fundraising_pct, 0) = 100
  )
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null default 'editor',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id),
  -- Phase 2: one organization per person keeps the member area simple.
  unique (user_id)
);

create table public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null check (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' and length(email) <= 254),
  role public.organization_role not null default 'editor' check (role <> 'owner'),
  token_hash text not null unique,
  invited_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null default now() + interval '14 days',
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.organization_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null check (length(btrim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index organizations_status_idx on public.organizations(status, updated_at desc);
create index organization_invitations_org_idx on public.organization_invitations(organization_id);
create index organization_notes_org_idx on public.organization_notes(organization_id, created_at desc);

create trigger organizations_set_updated_at before update on public.organizations
for each row execute function public.set_updated_at();

-- Membership helpers ---------------------------------------------------------
-- SECURITY DEFINER so policies on organization_members can call them without
-- recursing into their own RLS.
create or replace function public.organization_role_of(p_organization_id uuid)
returns public.organization_role
language sql
stable
security definer
set search_path = ''
as $$
  select m.role from public.organization_members m
  where m.organization_id = p_organization_id and m.user_id = auth.uid();
$$;

create or replace function public.is_organization_member(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = p_organization_id and m.user_id = auth.uid()
  );
$$;

revoke all on function public.organization_role_of(uuid) from public, anon;
revoke all on function public.is_organization_member(uuid) from public, anon;
grant execute on function public.organization_role_of(uuid) to authenticated;
grant execute on function public.is_organization_member(uuid) to authenticated;

-- Row level security -------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invitations enable row level security;
alter table public.organization_notes enable row level security;

create policy "Members read their organization"
on public.organizations for select to authenticated
using (public.is_organization_member(id) or public.is_admin());

create policy "Owners and editors update their organization"
on public.organizations for update to authenticated
using (public.organization_role_of(id) in ('owner', 'editor'))
with check (public.organization_role_of(id) in ('owner', 'editor'));

create policy "Admins delete organizations"
on public.organizations for delete to authenticated
using (public.is_admin());

create policy "Members see who belongs to their organization"
on public.organization_members for select to authenticated
using (public.is_organization_member(organization_id) or public.is_admin());

create policy "Owners and admins remove members"
on public.organization_members for delete to authenticated
using (
  (public.organization_role_of(organization_id) = 'owner' and user_id <> auth.uid())
  or public.is_admin()
);

create policy "Owners and admins read invitations"
on public.organization_invitations for select to authenticated
using (public.organization_role_of(organization_id) = 'owner' or public.is_admin());

create policy "Owners and admins revoke invitations"
on public.organization_invitations for delete to authenticated
using (public.organization_role_of(organization_id) = 'owner' or public.is_admin());

create policy "Admins manage internal notes"
on public.organization_notes for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Teammates see each other's name and email in the team list.
create or replace function public.shares_organization_with(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members mine
    join public.organization_members theirs on theirs.organization_id = mine.organization_id
    where mine.user_id = auth.uid() and theirs.user_id = p_user_id
  );
$$;
revoke all on function public.shares_organization_with(uuid) from public, anon;
grant execute on function public.shares_organization_with(uuid) to authenticated;

create policy "Members read their teammates' profiles"
on public.profiles for select to authenticated
using (public.shares_organization_with(id));

-- Privileges -----------------------------------------------------------------
revoke all on public.organizations, public.organization_members,
  public.organization_invitations, public.organization_notes from anon, authenticated;

grant select, delete on public.organizations to authenticated;
-- Members edit the onboarding fields only; status and review go through functions.
grant update (
  name, legal_name, entity_type, country, city, founded_year, tax_id, website, social_url,
  mission, vision, causes, populations, regions, beneficiaries_range,
  paid_staff_range, volunteers_range, has_board, board_size, contact_name, contact_email, contact_phone,
  annual_budget_range, budget_currency, income_mix, expense_programs_pct, expense_admin_pct,
  expense_fundraising_pct, has_financial_statements, has_external_audit
) on public.organizations to authenticated;
grant select, delete on public.organization_members to authenticated;
grant select (id, organization_id, email, role, invited_by, expires_at, accepted_at, accepted_by, created_at),
  delete on public.organization_invitations to authenticated;
grant select, insert, update, delete on public.organization_notes to authenticated;

-- Functions --------------------------------------------------------------------
create or replace function public.create_organization(p_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_id uuid;
begin
  if v_user is null then
    raise exception 'Sign in first' using errcode = '42501';
  end if;
  if exists (select 1 from public.organization_members where user_id = v_user) then
    raise exception 'This account already belongs to an organization' using errcode = '23505';
  end if;
  insert into public.organizations (name, created_by) values (btrim(p_name), v_user) returning id into v_id;
  insert into public.organization_members (organization_id, user_id, role) values (v_id, v_user, 'owner');
  return v_id;
end;
$$;

create or replace function public.submit_organization(p_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  o public.organizations;
begin
  if public.organization_role_of(p_organization_id) not in ('owner', 'editor') then
    raise exception 'Only owners and editors can submit' using errcode = '42501';
  end if;
  select * into o from public.organizations where id = p_organization_id for update;
  if o.status not in ('draft', 'changes_requested') then
    raise exception 'Already submitted' using errcode = '55000';
  end if;
  if o.entity_type is null or o.country is null or o.mission is null or cardinality(o.causes) = 0
     or o.contact_name is null or o.contact_email is null or o.annual_budget_range is null then
    raise exception 'Required onboarding fields are missing' using errcode = '23514';
  end if;
  update public.organizations
  set status = 'submitted', submitted_at = now(), data_consent_at = coalesce(data_consent_at, now())
  where id = p_organization_id;
end;
$$;

create or replace function public.review_organization(p_organization_id uuid, p_status public.organization_status, p_message text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Admins only' using errcode = '42501';
  end if;
  if p_status not in ('approved', 'changes_requested') then
    raise exception 'Review must approve or request changes' using errcode = '22023';
  end if;
  update public.organizations
  set status = p_status, reviewed_at = now(), reviewed_by = auth.uid(), review_message = nullif(btrim(p_message), '')
  where id = p_organization_id;
  if not found then
    raise exception 'Organization not found' using errcode = 'P0002';
  end if;
end;
$$;

-- Returns the invitation token once; only its SHA-256 hash is stored.
create or replace function public.create_organization_invitation(p_organization_id uuid, p_email text, p_role public.organization_role)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  -- Two random UUIDs: 244 random bits, with built-in functions only.
  v_token text := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
begin
  if public.organization_role_of(p_organization_id) is distinct from 'owner' then
    raise exception 'Only owners invite people' using errcode = '42501';
  end if;
  if p_role = 'owner' then
    raise exception 'Invite as editor or viewer' using errcode = '22023';
  end if;
  if (select count(*) from public.organization_invitations
      where organization_id = p_organization_id and accepted_at is null and expires_at > now()) >= 20 then
    raise exception 'Too many pending invitations' using errcode = '54000';
  end if;
  insert into public.organization_invitations (organization_id, email, role, token_hash, invited_by)
  values (p_organization_id, lower(btrim(p_email)), p_role, encode(sha256(convert_to(v_token, 'UTF8')), 'hex'), auth.uid());
  return v_token;
end;
$$;

create or replace function public.accept_organization_invitation(p_token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_email text;
  inv public.organization_invitations;
begin
  if v_user is null then
    raise exception 'Sign in first' using errcode = '42501';
  end if;
  select * into inv from public.organization_invitations
  where token_hash = encode(sha256(convert_to(coalesce(p_token, ''), 'UTF8')), 'hex')
  for update;
  if inv.id is null or inv.accepted_at is not null or inv.expires_at <= now() then
    raise exception 'Invitation not valid' using errcode = 'P0002';
  end if;
  select lower(email) into v_email from auth.users where id = v_user;
  if v_email is distinct from inv.email then
    raise exception 'Invitation belongs to another email' using errcode = '42501';
  end if;
  if exists (select 1 from public.organization_members where user_id = v_user) then
    raise exception 'This account already belongs to an organization' using errcode = '23505';
  end if;
  insert into public.organization_members (organization_id, user_id, role) values (inv.organization_id, v_user, inv.role);
  update public.organization_invitations set accepted_at = now(), accepted_by = v_user where id = inv.id;
  return inv.organization_id;
end;
$$;

revoke all on function public.create_organization(text) from public, anon;
revoke all on function public.submit_organization(uuid) from public, anon;
revoke all on function public.review_organization(uuid, public.organization_status, text) from public, anon;
revoke all on function public.create_organization_invitation(uuid, text, public.organization_role) from public, anon;
revoke all on function public.accept_organization_invitation(text) from public, anon;
grant execute on function public.create_organization(text) to authenticated;
grant execute on function public.submit_organization(uuid) to authenticated;
grant execute on function public.review_organization(uuid, public.organization_status, text) to authenticated;
grant execute on function public.create_organization_invitation(uuid, text, public.organization_role) to authenticated;
grant execute on function public.accept_organization_invitation(text) to authenticated;

grant usage on type public.organization_status, public.organization_role to authenticated;
