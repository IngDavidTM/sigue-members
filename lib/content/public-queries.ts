import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  ApprovedBlogCommentRow,
  BlogPostRow,
  BlogPostTranslationRow,
  BlogSeriesTranslationRow,
  BlogTagTranslationRow,
  ContentLocale,
  EventRow,
  EventTranslationRow,
  EventVenueRow,
} from "@/types/supabase";

export type PublicBlogCard = {
  post: BlogPostRow;
  translation: BlogPostTranslationRow;
  series: BlogSeriesTranslationRow | null;
};

export type PublicEventCard = {
  event: EventRow;
  translation: EventTranslationRow;
  venue: EventVenueRow | null;
};

function reportPublicQuery(error: unknown) {
  console.error("Public content query failed:", error);
}

function hasPublicContentConnection() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function getPublicBlogListing(locale: ContentLocale) {
  if (!hasPublicContentConnection()) {
    return { cards: [] as PublicBlogCard[], series: [] as BlogSeriesTranslationRow[] };
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data: posts, error: postsError } = await supabase
      .from("blog_posts")
      .select("*")
      .in("status", ["published", "scheduled"])
      .lte("published_at", now)
      .order("published_at", { ascending: false });
    if (postsError) throw postsError;
    if (!posts.length) return { cards: [] as PublicBlogCard[], series: [] as BlogSeriesTranslationRow[] };

    const ids = posts.map((post) => post.id);
    const [translationsResult, seriesResult] = await Promise.all([
      supabase.from("blog_post_translations").select("*").eq("locale", locale).in("post_id", ids),
      supabase.from("blog_series_translations").select("*").eq("locale", locale),
    ]);
    if (translationsResult.error) throw translationsResult.error;
    if (seriesResult.error) throw seriesResult.error;
    const translations = new Map(translationsResult.data.map((item) => [item.post_id, item]));
    const series = new Map(seriesResult.data.map((item) => [item.series_id, item]));
    const cards = posts.flatMap((post) => {
      const translation = translations.get(post.id);
      if (!translation) return [];
      return [{ post, translation, series: post.series_id ? series.get(post.series_id) ?? null : null }];
    });
    const visibleSeriesIds = new Set(cards.flatMap((card) => (card.post.series_id ? [card.post.series_id] : [])));
    return {
      cards,
      series: seriesResult.data.filter((item) => visibleSeriesIds.has(item.series_id)),
    };
  } catch (error) {
    reportPublicQuery(error);
    return { cards: [] as PublicBlogCard[], series: [] as BlogSeriesTranslationRow[] };
  }
}

export async function getPublicBlogPost(locale: ContentLocale, slug: string) {
  if (!hasPublicContentConnection()) return null;

  try {
    const supabase = await createClient();
    const translationResult = await supabase
      .from("blog_post_translations")
      .select("*")
      .eq("locale", locale)
      .eq("slug", slug)
      .maybeSingle();
    if (translationResult.error) throw translationResult.error;
    let translation = translationResult.data;

    // Language switches preserve the current pathname. If translated posts use
    // different slugs, resolve the sibling translation instead of returning 404.
    if (!translation) {
      const { data: sourceTranslation, error: sourceTranslationError } = await supabase
        .from("blog_post_translations")
        .select("post_id")
        .neq("locale", locale)
        .eq("slug", slug)
        .maybeSingle();
      if (sourceTranslationError) throw sourceTranslationError;

      if (sourceTranslation) {
        const targetTranslationResult = await supabase
          .from("blog_post_translations")
          .select("*")
          .eq("post_id", sourceTranslation.post_id)
          .eq("locale", locale)
          .maybeSingle();
        if (targetTranslationResult.error) throw targetTranslationResult.error;
        translation = targetTranslationResult.data;
      }
    }

    if (!translation) return null;

    const now = new Date().toISOString();
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", translation.post_id)
      .in("status", ["published", "scheduled"])
      .lte("published_at", now)
      .maybeSingle();
    if (postError) throw postError;
    if (!post) return null;

    const [seriesResult, postTagsResult, commentsResult, alternateTranslationsResult, listing] = await Promise.all([
      post.series_id
        ? supabase
            .from("blog_series_translations")
            .select("*")
            .eq("series_id", post.series_id)
            .eq("locale", locale)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase.from("blog_post_tags").select("tag_id").eq("post_id", post.id),
      supabase
        .from("approved_blog_comments")
        .select("*")
        .eq("post_id", post.id)
        .eq("locale", locale)
        .order("created_at"),
      supabase
        .from("blog_post_translations")
        .select("locale,slug")
        .eq("post_id", post.id),
      getPublicBlogListing(locale),
    ]);
    if (seriesResult.error) throw seriesResult.error;
    if (postTagsResult.error) throw postTagsResult.error;
    if (commentsResult.error) throw commentsResult.error;
    if (alternateTranslationsResult.error) throw alternateTranslationsResult.error;

    let tags: BlogTagTranslationRow[] = [];
    const tagIds = postTagsResult.data.map((item) => item.tag_id);
    if (tagIds.length) {
      const { data, error } = await supabase
        .from("blog_tag_translations")
        .select("*")
        .eq("locale", locale)
        .in("tag_id", tagIds);
      if (error) throw error;
      tags = data;
    }

    return {
      post,
      translation,
      series: seriesResult.data,
      tags,
      comments: commentsResult.data as ApprovedBlogCommentRow[],
      alternateTranslations: alternateTranslationsResult.data,
      recent: listing.cards.filter((item) => item.post.id !== post.id).slice(0, 4),
      allSeries: listing.series,
    };
  } catch (error) {
    reportPublicQuery(error);
    return null;
  }
}

export async function getPublicEvents(locale: ContentLocale) {
  if (!hasPublicContentConnection()) return [] as PublicEventCard[];

  try {
    const supabase = await createClient();
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .order("starts_at", { ascending: true });
    if (eventsError) throw eventsError;
    if (!events.length) return [] as PublicEventCard[];

    const ids = events.map((event) => event.id);
    const venueIds = events.flatMap((event) => (event.venue_id ? [event.venue_id] : []));
    const [translationsResult, venuesResult] = await Promise.all([
      supabase.from("event_translations").select("*").eq("locale", locale).in("event_id", ids),
      venueIds.length
        ? supabase.from("event_venues").select("*").in("id", venueIds)
        : Promise.resolve({ data: [] as EventVenueRow[], error: null }),
    ]);
    if (translationsResult.error) throw translationsResult.error;
    if (venuesResult.error) throw venuesResult.error;
    const translations = new Map(translationsResult.data.map((item) => [item.event_id, item]));
    const venues = new Map(venuesResult.data.map((item) => [item.id, item]));
    return events.flatMap((event) => {
      const translation = translations.get(event.id);
      if (!translation) return [];
      return [{ event, translation, venue: event.venue_id ? venues.get(event.venue_id) ?? null : null }];
    });
  } catch (error) {
    reportPublicQuery(error);
    return [] as PublicEventCard[];
  }
}

export async function getPublicEventGroups(locale: ContentLocale) {
  const events = await getPublicEvents(locale);
  const now = Date.now();
  return {
    upcoming: events.filter((item) => new Date(item.event.ends_at).getTime() >= now),
    past: events.filter((item) => new Date(item.event.ends_at).getTime() < now).reverse(),
  };
}

export async function getPublicEvent(locale: ContentLocale, slug: string) {
  if (!hasPublicContentConnection()) return null;

  try {
    const supabase = await createClient();
    const { data: translation, error } = await supabase
      .from("event_translations")
      .select("*")
      .eq("locale", locale)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!translation) return null;
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", translation.event_id)
      .maybeSingle();
    if (eventError) throw eventError;
    if (!event) return null;
    let venue: EventVenueRow | null = null;
    if (event.venue_id) {
      const venueResult = await supabase
        .from("event_venues")
        .select("*")
        .eq("id", event.venue_id)
        .maybeSingle();
      if (venueResult.error) throw venueResult.error;
      venue = venueResult.data;
    }
    const [allEvents, accessResult, alternateTranslationsResult] = await Promise.all([
      getPublicEvents(locale),
      supabase.from("public_event_access").select("virtual_url").eq("event_id", event.id).maybeSingle(),
      supabase.from("event_translations").select("locale,slug").eq("event_id", event.id),
    ]);
    if (accessResult.error) throw accessResult.error;
    if (alternateTranslationsResult.error) throw alternateTranslationsResult.error;
    return {
      event,
      translation,
      venue,
      virtualUrl: accessResult.data?.virtual_url ?? null,
      alternateTranslations: alternateTranslationsResult.data,
      upcoming: allEvents.filter((item) => item.event.id !== event.id).slice(0, 4),
    };
  } catch (error) {
    reportPublicQuery(error);
    return null;
  }
}
