import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

import { toolAxes } from "@/app/components/resources/toolsLibrary";
import { isIndexableTaxonomy } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-url";
import type { Database } from "@/types/supabase";

export const revalidate = 300;

const staticRoutes = [
  { path: "", priority: 1 },
  { path: "/conoce-sigue", priority: 0.9 },
  { path: "/sigue-tracks", priority: 0.9 },
  { path: "/sigue-consulting", priority: 0.9 },
  { path: "/sigue-hub", priority: 0.9 },
  { path: "/sigue-academy", priority: 0.9 },
  { path: "/miembros-sigue", priority: 0.9 },
  { path: "/unete", priority: 0.8 },
  { path: "/contacto", priority: 0.8 },
  { path: "/donacion", priority: 0.8 },
  { path: "/cumbre-sigue-2026", priority: 1 },
  { path: "/ecosistema", priority: 0.9 },
  { path: "/blog", priority: 0.9 },
  { path: "/eventos", priority: 0.9 },
  { path: "/recursos", priority: 0.8 },
  { path: "/herramientas", priority: 0.8 },
  ...toolAxes.map((axis) => ({ path: `/herramientas/${axis.slug}`, priority: 0.7 })),
  { path: "/politica-de-privacidad", priority: 0.3 },
] as const;

/** Adds x-default (the Spanish version, or the only one available) to an hreflang map. */
function withDefault(languages: Record<string, string>) {
  const fallback = languages.es ?? languages.en;
  return fallback ? { ...languages, "x-default": fallback } : languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = staticRoutes.flatMap(({ path, priority }) => {
    const urls = { es: absoluteUrl(`/es${path}`), en: absoluteUrl(`/en${path}`) };
    const languages = withDefault(urls);
    return (["es", "en"] as const).map((locale) => ({
      url: urls[locale],
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages },
    }));
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return routes;

  try {
    const supabase = createClient<Database>(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const [postsResult, postTranslationsResult, eventsResult, eventTranslationsResult, seriesResult, tagResult, seriesTreeResult, postTagsResult] =
      await Promise.all([
        supabase.from("blog_posts").select("id,updated_at,series_id").in("status", ["published", "scheduled"]).lte("published_at", new Date().toISOString()),
        supabase.from("blog_post_translations").select("post_id,locale,slug,noindex"),
        supabase.from("events").select("id,updated_at").in("status", ["published", "cancelled"]).lte("published_at", new Date().toISOString()),
        supabase.from("event_translations").select("event_id,locale,slug,noindex"),
        supabase.from("blog_series_translations").select("series_id,locale,slug"),
        supabase.from("blog_tag_translations").select("tag_id,locale,slug"),
        supabase.from("blog_series").select("id,parent_id"),
        supabase.from("blog_post_tags").select("post_id,tag_id"),
      ]);

    if (postsResult.error) throw postsResult.error;
    if (postTranslationsResult.error) throw postTranslationsResult.error;
    if (eventsResult.error) throw eventsResult.error;
    if (eventTranslationsResult.error) throw eventTranslationsResult.error;
    if (seriesResult.error) throw seriesResult.error;
    if (tagResult.error) throw tagResult.error;
    if (seriesTreeResult.error) throw seriesTreeResult.error;
    if (postTagsResult.error) throw postTagsResult.error;

    const postDates = new Map(postsResult.data.map((post) => [post.id, post.updated_at]));
    const postLanguages = new Map<string, Record<string, string>>();
    postTranslationsResult.data.filter((translation) => !translation.noindex && postDates.has(translation.post_id)).forEach((translation) => {
      const translations = postLanguages.get(translation.post_id) ?? {};
      translations[translation.locale] = absoluteUrl(`/${translation.locale}/blog/${translation.slug}`);
      postLanguages.set(translation.post_id, translations);
    });
    postTranslationsResult.data.filter((translation) => !translation.noindex && postDates.has(translation.post_id)).forEach((translation) => {
      const languages = withDefault(postLanguages.get(translation.post_id) ?? {});
      routes.push({
        url: absoluteUrl(`/${translation.locale}/blog/${translation.slug}`),
        lastModified: new Date(postDates.get(translation.post_id) ?? Date.now()),
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: { languages },
      });
    });

    const eventDates = new Map(eventsResult.data.map((event) => [event.id, event.updated_at]));
    const eventLanguages = new Map<string, Record<string, string>>();
    eventTranslationsResult.data.filter((translation) => !translation.noindex && eventDates.has(translation.event_id)).forEach((translation) => {
      const translations = eventLanguages.get(translation.event_id) ?? {};
      translations[translation.locale] = absoluteUrl(`/${translation.locale}/evento/${translation.slug}`);
      eventLanguages.set(translation.event_id, translations);
    });
    eventTranslationsResult.data.filter((translation) => !translation.noindex && eventDates.has(translation.event_id)).forEach((translation) => {
      const languages = withDefault(eventLanguages.get(translation.event_id) ?? {});
      routes.push({
        url: absoluteUrl(`/${translation.locale}/evento/${translation.slug}`),
        lastModified: new Date(eventDates.get(translation.event_id) ?? Date.now()),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages },
      });
    });

    // Published posts per category (a category page also lists its direct
    // children's posts) and per tag, so empty archives stay out of the sitemap.
    const parentOf = new Map(seriesTreeResult.data.map((series) => [series.id, series.parent_id]));
    const postCounts = new Map<string, number>();
    const countPost = (ownerId: string | null | undefined) => {
      if (ownerId) postCounts.set(ownerId, (postCounts.get(ownerId) ?? 0) + 1);
    };
    postsResult.data.forEach((post) => {
      countPost(post.series_id);
      countPost(post.series_id ? parentOf.get(post.series_id) : null);
    });
    postTagsResult.data.filter((item) => postDates.has(item.post_id)).forEach((item) => countPost(item.tag_id));

    const addTaxonomyRoutes = (
      allTranslations: Array<{ locale: string; slug: string; ownerId: string }>,
      segment: "category" | "tag",
    ) => {
      const translations = allTranslations.filter((item) => isIndexableTaxonomy(item.slug, postCounts.get(item.ownerId) ?? 0));
      const languageMaps = new Map<string, Record<string, string>>();
      translations.forEach((item) => {
        const languages = languageMaps.get(item.ownerId) ?? {};
        languages[item.locale] = absoluteUrl(`/${item.locale}/${segment}/${item.slug}`);
        languageMaps.set(item.ownerId, languages);
      });
      translations.forEach((item) => routes.push({
        url: absoluteUrl(`/${item.locale}/${segment}/${item.slug}`),
        changeFrequency: "weekly",
        priority: 0.65,
        alternates: { languages: withDefault(languageMaps.get(item.ownerId) ?? {}) },
      }));
    };
    addTaxonomyRoutes(seriesResult.data.map((item) => ({ ...item, ownerId: item.series_id })), "category");
    addTaxonomyRoutes(tagResult.data.map((item) => ({ ...item, ownerId: item.tag_id })), "tag");
  } catch (error) {
    console.error("Unable to include dynamic content in sitemap:", error);
  }

  return routes;
}
