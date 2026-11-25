-- Recorded webinars for members (2026-11-25).
--
-- Admins attach a recording, a summary per language and materials to an
-- event that already happened. Signed-in members read them inside
-- /dashboard/webinars. The public event page only learns that a recording
-- exists (public_event_recordings), never the video link or the summary.
--
-- Adds objects only, so it works with the previous and the new app version.

create table public.event_recordings (
  event_id uuid primary key references public.events(id) on delete cascade,
  video_url text not null check (video_url ~ '^https://[^\s]+$' and length(video_url) <= 2000),
  sigue_axis text check (sigue_axis in ('servir', 'impactar', 'guiar', 'unir', 'equipar')),
  summary_es_html text not null default '',
  summary_en_html text not null default '',
  -- [{"label": "Presentación", "url": "https://…"}]
  materials jsonb not null default '[]'::jsonb check (jsonb_typeof(materials) = 'array'),
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index event_recordings_published_idx on public.event_recordings(is_published, sigue_axis);

create trigger event_recordings_set_updated_at before update on public.event_recordings
for each row execute function public.set_updated_at();

alter table public.event_recordings enable row level security;

create policy "Members read published recordings of past events"
on public.event_recordings for select to authenticated
using (
  is_published
  and exists (
    select 1 from public.events
    where events.id = event_recordings.event_id
      and events.status in ('published', 'cancelled')
      and events.published_at <= now()
      and events.ends_at <= now()
  )
);

create policy "Admins manage event recordings"
on public.event_recordings for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Visitors never read the table, not even its columns.
revoke all on public.event_recordings from anon;
revoke all on public.event_recordings from authenticated;
grant select, insert, update, delete on public.event_recordings to authenticated;

-- What the public site may know: this event has a recording for members.
create view public.public_event_recordings
with (security_barrier = true)
as
select r.event_id, r.sigue_axis
from public.event_recordings r
join public.events e on e.id = r.event_id
where r.is_published
  and e.status in ('published', 'cancelled')
  and e.published_at <= now()
  and e.ends_at <= now();

revoke all on public.public_event_recordings from anon, authenticated;
grant select on public.public_event_recordings to anon, authenticated;
