import "server-only";

import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

export async function getBlogTaxonomyOptions() {
  await requireAdmin();
  const supabase = await createClient();
  const [seriesResult, seriesTranslationsResult, tagsResult, tagTranslationsResult] =
    await Promise.all([
      supabase.from("blog_series").select("*").order("sort_order"),
      supabase.from("blog_series_translations").select("*").eq("locale", "es"),
      supabase.from("blog_tags").select("*").order("code"),
      supabase.from("blog_tag_translations").select("*").eq("locale", "es"),
    ]);

  if (seriesResult.error) throw new Error(seriesResult.error.message);
  if (seriesTranslationsResult.error) throw new Error(seriesTranslationsResult.error.message);
  if (tagsResult.error) throw new Error(tagsResult.error.message);
  if (tagTranslationsResult.error) throw new Error(tagTranslationsResult.error.message);

  const seriesTranslations = new Map(
    seriesTranslationsResult.data.map((translation) => [translation.series_id, translation]),
  );
  const tagTranslations = new Map(
    tagTranslationsResult.data.map((translation) => [translation.tag_id, translation]),
  );

  return {
    series: seriesResult.data.map((item) => ({
      ...item,
      translation: seriesTranslations.get(item.id),
    })),
    tags: tagsResult.data.map((item) => ({
      ...item,
      translation: tagTranslations.get(item.id),
    })),
  };
}

export async function getAdminBlogPost(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const [postResult, translationsResult, tagsResult] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("blog_post_translations").select("*").eq("post_id", id),
    supabase.from("blog_post_tags").select("tag_id").eq("post_id", id),
  ]);
  if (postResult.error) throw new Error(postResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);
  if (tagsResult.error) throw new Error(tagsResult.error.message);
  return {
    post: postResult.data,
    translations: translationsResult.data,
    selectedTagIds: tagsResult.data.map((tag) => tag.tag_id),
  };
}

export async function getEventOptions() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("event_venues").select("*").order("name");
  if (error) throw new Error(error.message);
  return data;
}

export async function getAdminEvent(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const [eventResult, translationsResult, accessResult] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).maybeSingle(),
    supabase.from("event_translations").select("*").eq("event_id", id),
    supabase
      .from("event_private_access")
      .select("virtual_url,organizer_email")
      .eq("event_id", id)
      .maybeSingle(),
  ]);
  if (eventResult.error) throw new Error(eventResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);
  if (accessResult.error) throw new Error(accessResult.error.message);
  return {
    event: eventResult.data,
    translations: translationsResult.data,
    virtualUrl: accessResult.data?.virtual_url ?? null,
    organizerEmail: accessResult.data?.organizer_email ?? null,
  };
}
