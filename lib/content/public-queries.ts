import "server-only";

import { cache } from "react";

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

export const getPublicBlogListing = cache(async function getPublicBlogListing(locale: ContentLocale) {
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
      .order("is_featured", { ascending: false })
      .order("published_at", { ascending: false });
    if (postsError) throw postsError;
    if (!posts.length) return { cards: [] as PublicBlogCard[], series: [] as BlogSeriesTranslationRow[] };

    const ids = posts.map((post) => post.id);
    const [translationsResult, seriesResult, seriesOrderResult] = await Promise.all([
      supabase.from("blog_post_translations").select("*").eq("locale", locale).in("post_id", ids),
      supabase.from("blog_series_translations").select("*").eq("locale", locale),
      supabase.from("blog_series").select("id,sort_order"),
    ]);
    if (translationsResult.error) throw translationsResult.error;
    if (seriesResult.error) throw seriesResult.error;
    if (seriesOrderResult.error) throw seriesOrderResult.error;
    const translations = new Map(translationsResult.data.map((item) => [item.post_id, item]));
    const series = new Map(seriesResult.data.map((item) => [item.series_id, item]));
    const cards = posts.flatMap((post) => {
      const translation = translations.get(post.id);
      if (!translation) return [];
      return [{ post, translation, series: post.series_id ? series.get(post.series_id) ?? null : null }];
    });
    const visibleSeriesIds = new Set(cards.flatMap((card) => (card.post.series_id ? [card.post.series_id] : [])));
    const seriesOrder = new Map(seriesOrderResult.data.map((item) => [item.id, item.sort_order]));
    return {
      cards,
      series: seriesResult.data
        .filter((item) => visibleSeriesIds.has(item.series_id))
        .sort((a, b) => (seriesOrder.get(a.series_id) ?? 0) - (seriesOrder.get(b.series_id) ?? 0)),
    };
  } catch (error) {
    reportPublicQuery(error);
    return { cards: [] as PublicBlogCard[], series: [] as BlogSeriesTranslationRow[] };
  }
});

export const getPublicBlogPost = cache(async function getPublicBlogPost(locale: ContentLocale, slug: string) {
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
});

export async function getPublicBlogSeries(locale: ContentLocale, slug: string) {
  if (!hasPublicContentConnection()) return null;
  try {
    const supabase = await createClient();
    const initialTranslation = await supabase
      .from("blog_series_translations").select("*").eq("locale", locale).eq("slug", slug).maybeSingle();
    if (initialTranslation.error) throw initialTranslation.error;
    let translation = initialTranslation.data;
    if (!translation) {
      const source = await supabase.from("blog_series_translations").select("series_id").neq("locale", locale).eq("slug", slug).maybeSingle();
      if (source.error) throw source.error;
      if (source.data) {
        const target = await supabase.from("blog_series_translations").select("*").eq("series_id", source.data.series_id).eq("locale", locale).maybeSingle();
        if (target.error) throw target.error;
        translation = target.data;
      }
    }
    if (!translation) return null;
    const [seriesResult, alternatesResult, listing] = await Promise.all([
      supabase.from("blog_series").select("*").eq("id", translation.series_id).maybeSingle(),
      supabase.from("blog_series_translations").select("locale,slug").eq("series_id", translation.series_id),
      getPublicBlogListing(locale),
    ]);
    if (seriesResult.error) throw seriesResult.error;
    if (alternatesResult.error) throw alternatesResult.error;
    if (!seriesResult.data) return null;
    const children = await supabase.from("blog_series").select("id").eq("parent_id", seriesResult.data.id).order("sort_order");
    if (children.error) throw children.error;
    const childIds = children.data.map((item) => item.id);
    const childTranslations = childIds.length
      ? await supabase.from("blog_series_translations").select("*").eq("locale", locale).in("series_id", childIds)
      : { data: [] as BlogSeriesTranslationRow[], error: null };
    if (childTranslations.error) throw childTranslations.error;
    let parent: BlogSeriesTranslationRow | null = null;
    if (seriesResult.data.parent_id) {
      const parentResult = await supabase.from("blog_series_translations").select("*").eq("locale", locale).eq("series_id", seriesResult.data.parent_id).maybeSingle();
      if (parentResult.error) throw parentResult.error;
      parent = parentResult.data;
    }
    const includedSeries = new Set([seriesResult.data.id, ...childIds]);
    return {
      series: seriesResult.data,
      translation,
      alternateTranslations: alternatesResult.data,
      parent,
      children: childTranslations.data.sort((a, b) => childIds.indexOf(a.series_id) - childIds.indexOf(b.series_id)),
      cards: listing.cards.filter((card) => card.post.series_id && includedSeries.has(card.post.series_id)),
    };
  } catch (error) {
    reportPublicQuery(error);
    return null;
  }
}

export async function getPublicBlogTag(locale: ContentLocale, slug: string) {
  if (!hasPublicContentConnection()) return null;
  try {
    const supabase = await createClient();
    const initialTranslation = await supabase
      .from("blog_tag_translations").select("*").eq("locale", locale).eq("slug", slug).maybeSingle();
    if (initialTranslation.error) throw initialTranslation.error;
    let translation = initialTranslation.data;
    if (!translation) {
      const source = await supabase.from("blog_tag_translations").select("tag_id").neq("locale", locale).eq("slug", slug).maybeSingle();
      if (source.error) throw source.error;
      if (source.data) {
        const target = await supabase.from("blog_tag_translations").select("*").eq("tag_id", source.data.tag_id).eq("locale", locale).maybeSingle();
        if (target.error) throw target.error;
        translation = target.data;
      }
    }
    if (!translation) return null;
    const [postTagsResult, alternateTranslationsResult, listing] = await Promise.all([
      supabase.from("blog_post_tags").select("post_id").eq("tag_id", translation.tag_id),
      supabase.from("blog_tag_translations").select("locale,slug").eq("tag_id", translation.tag_id),
      getPublicBlogListing(locale),
    ]);
    if (postTagsResult.error) throw postTagsResult.error;
    if (alternateTranslationsResult.error) throw alternateTranslationsResult.error;
    const postIds = new Set(postTagsResult.data.map((item) => item.post_id));
    return { translation, alternateTranslations: alternateTranslationsResult.data, cards: listing.cards.filter((card) => postIds.has(card.post.id)) };
  } catch (error) {
    reportPublicQuery(error);
    return null;
  }
}

export const getPublicEvents = cache(async function getPublicEvents(locale: ContentLocale) {
  if (!hasPublicContentConnection()) return [] as PublicEventCard[];

  try {
    const supabase = await createClient();
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .in("status", ["published", "cancelled"])
      .lte("published_at", new Date().toISOString())
      .order("is_featured", { ascending: false })
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
});

export async function getPublicEventGroups(locale: ContentLocale) {
  const events = await getPublicEvents(locale);
  const now = Date.now();
  return {
    upcoming: events.filter((item) => new Date(item.event.ends_at).getTime() >= now),
    past: events.filter((item) => new Date(item.event.ends_at).getTime() < now).reverse(),
  };
}

export const getPublicEvent = cache(async function getPublicEvent(locale: ContentLocale, slug: string) {
  if (!hasPublicContentConnection()) return null;

  try {
    const supabase = await createClient();
    const { data: initialTranslation, error } = await supabase
      .from("event_translations")
      .select("*")
      .eq("locale", locale)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    let translation = initialTranslation;
    if (!translation) {
      const source = await supabase.from("event_translations").select("event_id")
        .neq("locale", locale).eq("slug", slug).maybeSingle();
      if (source.error) throw source.error;
      if (source.data) {
        const target = await supabase.from("event_translations").select("*")
          .eq("locale", locale).eq("event_id", source.data.event_id).maybeSingle();
        if (target.error) throw target.error;
        translation = target.data;
      }
    }
    if (!translation) return null;
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .in("status", ["published", "cancelled"])
      .lte("published_at", new Date().toISOString())
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
      currentTime: Date.now(),
      alternateTranslations: alternateTranslationsResult.data,
      upcoming: allEvents.filter((item) => item.event.id !== event.id && item.event.status !== "cancelled" && new Date(item.event.ends_at).getTime() >= Date.now()).slice(0, 4),
    };
  } catch (error) {
    reportPublicQuery(error);
    return null;
  }
});
