-- Validate the constraints introduced with NOT VALID after legacy content has
-- been checked. New rows were already protected; this certifies existing rows
-- and lets PostgreSQL use the complete constraint information.

alter table public.blog_series
  validate constraint blog_series_admin_limits;
alter table public.blog_series_translations
  validate constraint blog_series_translation_limits;
alter table public.blog_posts
  validate constraint blog_featured_image_modern_format;
alter table public.blog_post_translations
  validate constraint blog_og_image_modern_format,
  validate constraint blog_translation_lengths;
alter table public.blog_tags
  validate constraint blog_tag_admin_limits;
alter table public.blog_tag_translations
  validate constraint blog_tag_translation_limits;

alter table public.event_venues
  validate constraint venue_coordinates_pair,
  validate constraint venue_latitude_range,
  validate constraint venue_longitude_range;
alter table public.events
  validate constraint event_currency_iso_shape,
  validate constraint event_featured_image_modern_format,
  validate constraint event_registration_before_start;
alter table public.event_translations
  validate constraint event_og_image_modern_format,
  validate constraint event_translation_lengths;
