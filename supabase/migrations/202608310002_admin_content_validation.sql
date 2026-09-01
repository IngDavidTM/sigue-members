-- Defense-in-depth for content created from the administration panel.
-- Application validation remains the source of friendly field-level messages.

update storage.buckets
set file_size_limit = 8388608,
    allowed_mime_types = array['image/webp', 'image/avif']
where id = 'content-media';

alter policy "Public reads event venues" on public.event_venues
using (exists (
  select 1 from public.events
  where events.venue_id = event_venues.id
    and events.status in ('published', 'cancelled')
    and events.published_at <= now()
));

alter policy "Public reads published events" on public.events
using (status in ('published', 'cancelled') and published_at <= now());

alter policy "Public reads published event translations" on public.event_translations
using (exists (
  select 1 from public.events
  where events.id = event_translations.event_id
    and events.status in ('published', 'cancelled')
    and events.published_at <= now()
));

alter table public.blog_posts
  add constraint blog_featured_image_modern_format
  check (featured_image_url is null or split_part(lower(featured_image_url), '?', 1) ~ '\.(avif|webp)$') not valid;

alter table public.blog_series
  add constraint blog_series_admin_limits
  check (char_length(code) between 1 and 80 and sort_order between 0 and 9999) not valid;

alter table public.blog_series_translations
  add constraint blog_series_translation_limits
  check (
    char_length(name) between 2 and 120
    and char_length(slug) between 1 and 180
    and (description is null or char_length(description) <= 2000)
    and (seo_title is null or char_length(seo_title) <= 60)
    and (seo_description is null or char_length(seo_description) <= 160)
  ) not valid;

alter table public.blog_tags
  add constraint blog_tag_admin_limits
  check (char_length(code) between 1 and 80) not valid;

alter table public.blog_tag_translations
  add constraint blog_tag_translation_limits
  check (char_length(name) between 2 and 120 and char_length(slug) between 1 and 180) not valid;

alter table public.blog_post_translations
  add constraint blog_translation_lengths
  check (
    char_length(title) between 3 and 160
    and char_length(slug) between 1 and 180
    and (excerpt is null or char_length(excerpt) <= 500)
    and (image_alt is null or char_length(image_alt) <= 180)
    and (seo_title is null or char_length(seo_title) <= 60)
    and (seo_description is null or char_length(seo_description) <= 160)
    and (focus_keyphrase is null or char_length(focus_keyphrase) <= 100)
    and (og_title is null or char_length(og_title) <= 60)
    and (og_description is null or char_length(og_description) <= 200)
  ) not valid,
  add constraint blog_og_image_modern_format
  check (og_image_url is null or split_part(lower(og_image_url), '?', 1) ~ '\.(avif|webp)$') not valid;

alter table public.events
  drop constraint if exists event_registration_before_end,
  add constraint event_registration_before_start
  check (registration_deadline is null or registration_deadline <= starts_at) not valid,
  add constraint event_featured_image_modern_format
  check (featured_image_url is null or split_part(lower(featured_image_url), '?', 1) ~ '\.(avif|webp)$') not valid,
  add constraint event_currency_iso_shape
  check (currency ~ '^[A-Z]{3}$') not valid;

alter table public.event_translations
  add constraint event_translation_lengths
  check (
    char_length(title) between 3 and 160
    and char_length(slug) between 1 and 180
    and (excerpt is null or char_length(excerpt) <= 500)
    and (image_alt is null or char_length(image_alt) <= 180)
    and (seo_title is null or char_length(seo_title) <= 60)
    and (seo_description is null or char_length(seo_description) <= 160)
    and (focus_keyphrase is null or char_length(focus_keyphrase) <= 100)
    and (og_title is null or char_length(og_title) <= 60)
    and (og_description is null or char_length(og_description) <= 200)
  ) not valid,
  add constraint event_og_image_modern_format
  check (og_image_url is null or split_part(lower(og_image_url), '?', 1) ~ '\.(avif|webp)$') not valid;

alter table public.event_venues
  add constraint venue_coordinates_pair
  check ((latitude is null) = (longitude is null)) not valid,
  add constraint venue_latitude_range
  check (latitude is null or latitude between -90 and 90) not valid,
  add constraint venue_longitude_range
  check (longitude is null or longitude between -180 and 180) not valid;

create or replace function public.prevent_blog_series_cycle()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  cursor_id uuid;
  visited uuid[] := array[]::uuid[];
begin
  cursor_id := new.parent_id;
  while cursor_id is not null loop
    if cursor_id = new.id then
      raise exception 'A blog series hierarchy cannot contain cycles';
    end if;
    if cursor_id = any(visited) then
      raise exception 'The existing blog series hierarchy contains a cycle';
    end if;
    visited := array_append(visited, cursor_id);
    select parent_id into cursor_id
    from public.blog_series
    where id = cursor_id;
  end loop;
  return new;
end;
$$;

drop trigger if exists blog_series_prevent_cycle on public.blog_series;
create trigger blog_series_prevent_cycle
before insert or update of parent_id on public.blog_series
for each row execute function public.prevent_blog_series_cycle();
