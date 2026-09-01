import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

import { absoluteUrl } from "@/lib/site-url";
import type { Database } from "@/types/supabase";

const staticRoutes = [
  { path: "", priority: 1 },
  { path: "/cumbre-sigue-2026", priority: 1 },
  { path: "/ecosistema", priority: 0.9 },
  { path: "/blog", priority: 0.9 },
  { path: "/eventos", priority: 0.9 },
  { path: "/recursos", priority: 0.8 },
  { path: "/herramientas-y-guias", priority: 0.8 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = staticRoutes.flatMap(({ path, priority }) => {
    const languages = { es: absoluteUrl(`/es${path}`), en: absoluteUrl(`/en${path}`) };
    return (["es", "en"] as const).map((locale) => ({
      url: languages[locale],
      lastModified: new Date("2026-08-29"),
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
    const [postsResult, postTranslationsResult, eventsResult, eventTranslationsResult, seriesResult, tagResult] =
      await Promise.all([
        supabase.from("blog_posts").select("id,updated_at"),
        supabase.from("blog_post_translations").select("post_id,locale,slug,noindex"),
        supabase.from("events").select("id,updated_at"),
        supabase.from("event_translations").select("event_id,locale,slug,noindex"),
        supabase.from("blog_series_translations").select("series_id,locale,slug"),
        supabase.from("blog_tag_translations").select("tag_id,locale,slug"),
      ]);

    if (postsResult.error) throw postsResult.error;
    if (postTranslationsResult.error) throw postTranslationsResult.error;
    if (eventsResult.error) throw eventsResult.error;
    if (eventTranslationsResult.error) throw eventTranslationsResult.error;
    if (seriesResult.error) throw seriesResult.error;
    if (tagResult.error) throw tagResult.error;

    const postDates = new Map(postsResult.data.map((post) => [post.id, post.updated_at]));
    const postLanguages = new Map<string, Record<string, string>>();
    postTranslationsResult.data.filter((translation) => !translation.noindex).forEach((translation) => {
      const translations = postLanguages.get(translation.post_id) ?? {};
      translations[translation.locale] = absoluteUrl(`/${translation.locale}/blog/${translation.slug}`);
      postLanguages.set(translation.post_id, translations);
    });
    postTranslationsResult.data.filter((translation) => !translation.noindex).forEach((translation) => {
      const languages = postLanguages.get(translation.post_id) ?? {};
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
    eventTranslationsResult.data.filter((translation) => !translation.noindex).forEach((translation) => {
      const translations = eventLanguages.get(translation.event_id) ?? {};
      translations[translation.locale] = absoluteUrl(`/${translation.locale}/evento/${translation.slug}`);
      eventLanguages.set(translation.event_id, translations);
    });
    eventTranslationsResult.data.filter((translation) => !translation.noindex).forEach((translation) => {
      const languages = eventLanguages.get(translation.event_id) ?? {};
      routes.push({
        url: absoluteUrl(`/${translation.locale}/evento/${translation.slug}`),
        lastModified: new Date(eventDates.get(translation.event_id) ?? Date.now()),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages },
      });
    });

    const addTaxonomyRoutes = (
      translations: Array<{ locale: string; slug: string; ownerId: string }>,
      segment: "category" | "tag",
    ) => {
      const languageMaps = new Map<string, Record<string, string>>();
      translations.forEach((item) => {
        const languages = languageMaps.get(item.ownerId) ?? {};
        languages[item.locale] = absoluteUrl(`/${item.locale}/${segment}/${item.slug}`);
        languageMaps.set(item.ownerId, languages);
      });
      translations.forEach((item) => routes.push({
        url: absoluteUrl(`/${item.locale}/${segment}/${item.slug}`),
        lastModified: new Date("2026-08-31"),
        changeFrequency: "weekly",
        priority: 0.65,
        alternates: { languages: languageMaps.get(item.ownerId) ?? {} },
      }));
    };
    addTaxonomyRoutes(seriesResult.data.map((item) => ({ ...item, ownerId: item.series_id })), "category");
    addTaxonomyRoutes(tagResult.data.map((item) => ({ ...item, ownerId: item.tag_id })), "tag");
  } catch (error) {
    console.error("Unable to include dynamic content in sitemap:", error);
  }

  return routes;
}
