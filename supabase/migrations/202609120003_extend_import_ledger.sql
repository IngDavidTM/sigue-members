-- Track imported WordPress taxonomies and approved comments too.

alter table public.legacy_content_sources
  drop constraint legacy_content_sources_source_kind_check,
  add constraint legacy_content_sources_source_kind_check
    check (source_kind in ('blog', 'event', 'media', 'tag', 'comment')),
  drop constraint legacy_content_sources_target_table_check,
  add constraint legacy_content_sources_target_table_check
    check (target_table in ('blog_posts', 'events', 'storage.objects', 'blog_tags', 'blog_comments'));
