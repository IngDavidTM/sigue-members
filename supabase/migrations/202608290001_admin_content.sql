-- SIGUE Network content administration foundation.
-- Run with the Supabase CLI or paste into the Supabase SQL editor once.

create extension if not exists pgcrypto;

create type public.app_role as enum ('user', 'admin');
create type public.content_status as enum ('draft', 'scheduled', 'published', 'archived');
create type public.comment_status as enum ('pending', 'approved', 'spam', 'rejected');
create type public.event_status as enum ('draft', 'published', 'cancelled', 'archived');
create type public.event_attendance_mode as enum ('in_person', 'virtual', 'hybrid');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert or update of email, raw_user_meta_data on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, email, full_name)
select
  id,
  email,
  coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name')
from auth.users
on conflict (id) do update set email = excluded.email;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.blog_series (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.blog_series(id) on delete set null,
  code text not null unique,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_series_not_own_parent check (parent_id is null or parent_id <> id)
);

create table public.blog_series_translations (
  series_id uuid not null references public.blog_series(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  name text not null,
  slug text not null,
  description text,
  seo_title text,
  seo_description text,
  primary key (series_id, locale),
  unique (locale, slug)
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references public.blog_series(id) on delete set null,
  status public.content_status not null default 'draft',
  featured_image_url text,
  author_name text not null default 'SIGUE Network',
  is_featured boolean not null default false,
  allow_comments boolean not null default true,
  reading_time_minutes integer not null default 1 check (reading_time_minutes > 0),
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_blog_has_date check (status not in ('published', 'scheduled') or published_at is not null)
);

create table public.blog_post_translations (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  title text not null,
  slug text not null,
  excerpt text,
  content_html text not null default '',
  image_alt text,
  seo_title text,
  seo_description text,
  focus_keyphrase text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  noindex boolean not null default false,
  nofollow boolean not null default false,
  schema_type text not null default 'Article' check (schema_type in ('Article', 'BlogPosting', 'NewsArticle')),
  primary key (post_id, locale),
  unique (locale, slug)
);

create table public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  created_at timestamptz not null default now()
);

create table public.blog_tag_translations (
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  name text not null,
  slug text not null,
  primary key (tag_id, locale),
  unique (locale, slug)
);

create table public.blog_post_tags (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  parent_id uuid references public.blog_comments(id) on delete cascade,
  locale text not null default 'es' check (locale in ('es', 'en')),
  author_name text not null,
  author_email text not null,
  author_website text,
  content text not null,
  status public.comment_status not null default 'pending',
  moderated_by uuid references auth.users(id) on delete set null,
  moderated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint comment_author_name_length check (char_length(author_name) between 2 and 100),
  constraint comment_content_length check (char_length(content) between 2 and 4000)
);

create view public.approved_blog_comments
with (security_barrier = true)
as
select
  id,
  post_id,
  parent_id,
  locale,
  author_name,
  author_website,
  content,
  created_at
from public.blog_comments
where status = 'approved';

create table public.event_venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address_line_1 text,
  address_line_2 text,
  city text,
  region text,
  country text,
  postal_code text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  map_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  status public.event_status not null default 'draft',
  attendance_mode public.event_attendance_mode not null default 'virtual',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'America/Bogota',
  all_day boolean not null default false,
  venue_id uuid references public.event_venues(id) on delete set null,
  show_virtual_url boolean not null default false,
  registration_url text,
  registration_deadline timestamptz,
  capacity integer check (capacity is null or capacity > 0),
  is_free boolean not null default true,
  price_amount numeric(12, 2) check (price_amount is null or price_amount >= 0),
  currency char(3) not null default 'USD',
  featured_image_url text,
  is_featured boolean not null default false,
  organizer_name text,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_ends_after_start check (ends_at > starts_at),
  constraint event_registration_before_end check (registration_deadline is null or registration_deadline <= ends_at),
  constraint paid_event_has_price check (is_free or price_amount is not null),
  constraint published_event_has_date check (status <> 'published' or published_at is not null)
);

create table public.event_private_access (
  event_id uuid primary key references public.events(id) on delete cascade,
  virtual_url text,
  organizer_email text,
  updated_at timestamptz not null default now()
);

create view public.public_event_access
with (security_barrier = true)
as
select event_private_access.event_id, event_private_access.virtual_url
from public.event_private_access
join public.events on events.id = event_private_access.event_id
where events.status = 'published'
  and events.published_at <= now()
  and events.show_virtual_url
  and event_private_access.virtual_url is not null;

create table public.event_translations (
  event_id uuid not null references public.events(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  title text not null,
  slug text not null,
  excerpt text,
  content_html text not null default '',
  agenda_html text,
  image_alt text,
  seo_title text,
  seo_description text,
  focus_keyphrase text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  noindex boolean not null default false,
  nofollow boolean not null default false,
  primary key (event_id, locale),
  unique (locale, slug)
);

create index blog_series_parent_idx on public.blog_series(parent_id);
create index blog_posts_publication_idx on public.blog_posts(status, published_at desc);
create index blog_posts_series_idx on public.blog_posts(series_id);
create index blog_comments_post_status_idx on public.blog_comments(post_id, status, created_at);
create index events_timeline_idx on public.events(status, starts_at, ends_at);
create index events_venue_idx on public.events(venue_id);

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger blog_series_set_updated_at before update on public.blog_series
for each row execute function public.set_updated_at();
create trigger blog_posts_set_updated_at before update on public.blog_posts
for each row execute function public.set_updated_at();
create trigger blog_comments_set_updated_at before update on public.blog_comments
for each row execute function public.set_updated_at();
create trigger event_venues_set_updated_at before update on public.event_venues
for each row execute function public.set_updated_at();
create trigger events_set_updated_at before update on public.events
for each row execute function public.set_updated_at();
create trigger event_private_access_set_updated_at before update on public.event_private_access
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.blog_series enable row level security;
alter table public.blog_series_translations enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_translations enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_tag_translations enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.blog_comments enable row level security;
alter table public.event_venues enable row level security;
alter table public.events enable row level security;
alter table public.event_private_access enable row level security;
alter table public.event_translations enable row level security;

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = auth.uid());
create policy "Admins manage profiles"
on public.profiles for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Public reads blog series"
on public.blog_series for select to anon, authenticated using (true);
create policy "Admins manage blog series"
on public.blog_series for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "Public reads blog series translations"
on public.blog_series_translations for select to anon, authenticated using (true);
create policy "Admins manage blog series translations"
on public.blog_series_translations for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Public reads published blog posts"
on public.blog_posts for select to anon, authenticated
using (status in ('published', 'scheduled') and published_at <= now());
create policy "Admins manage blog posts"
on public.blog_posts for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "Public reads published blog translations"
on public.blog_post_translations for select to anon, authenticated
using (exists (
  select 1 from public.blog_posts
  where blog_posts.id = blog_post_translations.post_id
    and blog_posts.status in ('published', 'scheduled')
    and blog_posts.published_at <= now()
));
create policy "Admins manage blog translations"
on public.blog_post_translations for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Public reads blog tags"
on public.blog_tags for select to anon, authenticated using (true);
create policy "Admins manage blog tags"
on public.blog_tags for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "Public reads blog tag translations"
on public.blog_tag_translations for select to anon, authenticated using (true);
create policy "Admins manage blog tag translations"
on public.blog_tag_translations for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "Public reads tags assigned to published posts"
on public.blog_post_tags for select to anon, authenticated
using (exists (
  select 1 from public.blog_posts
  where blog_posts.id = blog_post_tags.post_id
    and blog_posts.status in ('published', 'scheduled')
    and blog_posts.published_at <= now()
));
create policy "Admins manage post tags"
on public.blog_post_tags for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage comments"
on public.blog_comments for all to authenticated
using (public.is_admin()) with check (public.is_admin());

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
set search_path = public, pg_temp
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
  if p_author_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Invalid email';
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
  if (
    select count(*) from public.blog_comments
    where post_id = p_post_id
      and lower(author_email) = lower(trim(p_author_email))
      and created_at > now() - interval '10 minutes'
  ) >= 3 then
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

create policy "Public reads event venues"
on public.event_venues for select to anon, authenticated
using (exists (
  select 1 from public.events
  where events.venue_id = event_venues.id
    and events.status in ('published', 'cancelled')
    and events.published_at <= now()
));
create policy "Admins manage event venues"
on public.event_venues for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "Public reads published events"
on public.events for select to anon, authenticated
using (status in ('published', 'cancelled') and published_at <= now());
create policy "Admins manage events"
on public.events for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage private event access"
on public.event_private_access for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "Public reads published event translations"
on public.event_translations for select to anon, authenticated
using (exists (
  select 1 from public.events
  where events.id = event_translations.event_id
    and events.status in ('published', 'cancelled')
    and events.published_at <= now()
));
create policy "Admins manage event translations"
on public.event_translations for all to authenticated
using (public.is_admin()) with check (public.is_admin());

grant usage on type public.app_role, public.content_status, public.comment_status,
  public.event_status, public.event_attendance_mode to anon, authenticated;
grant select on public.blog_series, public.blog_series_translations, public.blog_posts,
  public.blog_post_translations, public.blog_tags, public.blog_tag_translations,
  public.blog_post_tags, public.event_venues, public.events,
  public.event_translations to anon, authenticated;
grant select on public.approved_blog_comments to anon, authenticated;
grant select on public.public_event_access to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.blog_series, public.blog_series_translations,
  public.blog_posts, public.blog_post_translations, public.blog_tags,
  public.blog_tag_translations, public.blog_post_tags, public.blog_comments,
  public.event_venues, public.events, public.event_private_access,
  public.event_translations to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-media',
  'content-media',
  true,
  8388608,
  array['image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public reads content media"
on storage.objects for select to public
using (bucket_id = 'content-media');
create policy "Admins upload content media"
on storage.objects for insert to authenticated
with check (bucket_id = 'content-media' and public.is_admin());
create policy "Admins update content media"
on storage.objects for update to authenticated
using (bucket_id = 'content-media' and public.is_admin())
with check (bucket_id = 'content-media' and public.is_admin());
create policy "Admins delete content media"
on storage.objects for delete to authenticated
using (bucket_id = 'content-media' and public.is_admin());
