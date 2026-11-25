import "server-only";

import { cache } from "react";

import { isMissingRelation } from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";
import type { EventRecordingRow, SigueAxis } from "@/types/supabase";

import type { MemberLocale } from "./recordings";

export type MemberWebinar = {
  eventId: string;
  axis: SigueAxis | null;
  startsAt: string;
  timezone: string;
  imageUrl: string | null;
  imageAlt: string | null;
  title: string;
  excerpt: string | null;
  publicPath: string | null;
};

type EventInfo = { id: string; starts_at: string; ends_at: string; timezone: string; featured_image_url: string | null };
type TranslationInfo = { event_id: string; locale: string; title: string; slug: string; excerpt: string | null; image_alt: string | null };

function toWebinar(
  recording: Pick<EventRecordingRow, "event_id" | "sigue_axis">,
  event: EventInfo,
  translations: TranslationInfo[],
  locale: MemberLocale,
): MemberWebinar {
  const own = translations.find((item) => item.locale === locale);
  const fallback = own ?? translations[0];
  return {
    eventId: recording.event_id,
    axis: recording.sigue_axis,
    startsAt: event.starts_at,
    timezone: event.timezone,
    imageUrl: event.featured_image_url,
    imageAlt: fallback?.image_alt ?? null,
    title: fallback?.title ?? "SIGUE Network",
    excerpt: fallback?.excerpt ?? null,
    publicPath: fallback ? `/${fallback.locale}/evento/${fallback.slug}` : null,
  };
}

/**
 * Recordings a signed-in member can watch. RLS already limits members to
 * published recordings of past events; the explicit filters keep admins
 * (who can read everything) seeing the same list as members.
 */
export async function listMemberWebinars(locale: MemberLocale, options: { axis?: SigueAxis; limit?: number } = {}) {
  const supabase = await createClient();
  let query = supabase.from("event_recordings").select("event_id,sigue_axis").eq("is_published", true);
  if (options.axis) query = query.eq("sigue_axis", options.axis);
  const { data: recordings, error } = await query;
  if (isMissingRelation(error)) return [];
  if (error) throw new Error(error.message);
  if (!recordings.length) return [];

  const ids = recordings.map((item) => item.event_id);
  const [eventsResult, translationsResult] = await Promise.all([
    supabase.from("events").select("id,starts_at,ends_at,timezone,featured_image_url").in("id", ids).in("status", ["published", "cancelled"]).lte("ends_at", new Date().toISOString()),
    supabase.from("event_translations").select("event_id,locale,title,slug,excerpt,image_alt").in("event_id", ids),
  ]);
  if (eventsResult.error) throw new Error(eventsResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);

  const events = new Map(eventsResult.data.map((event) => [event.id, event]));
  const webinars = recordings
    .filter((recording) => events.has(recording.event_id))
    .map((recording) => toWebinar(
      recording,
      events.get(recording.event_id)!,
      translationsResult.data.filter((item) => item.event_id === recording.event_id),
      locale,
    ))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  return options.limit ? webinars.slice(0, options.limit) : webinars;
}

/** Cached per request: the page and its metadata both need it. */
export const getMemberWebinar = cache(async (eventId: string, locale: MemberLocale) => {
  const supabase = await createClient();
  const { data: recording, error } = await supabase
    .from("event_recordings")
    .select("*")
    .eq("event_id", eventId)
    .eq("is_published", true)
    .maybeSingle();
  if (isMissingRelation(error)) return null;
  if (error) throw new Error(error.message);
  if (!recording) return null;

  const [eventResult, translationsResult] = await Promise.all([
    supabase.from("events").select("id,starts_at,ends_at,timezone,featured_image_url").eq("id", eventId).in("status", ["published", "cancelled"]).lte("ends_at", new Date().toISOString()).maybeSingle(),
    supabase.from("event_translations").select("event_id,locale,title,slug,excerpt,image_alt").eq("event_id", eventId),
  ]);
  if (eventResult.error) throw new Error(eventResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);
  if (!eventResult.data) return null;

  const summary = locale === "en"
    ? recording.summary_en_html || recording.summary_es_html
    : recording.summary_es_html || recording.summary_en_html;
  return {
    ...toWebinar(recording, eventResult.data, translationsResult.data, locale),
    videoUrl: recording.video_url,
    summaryHtml: summary,
    materials: recording.materials ?? [],
  };
});

export async function countUpcomingEvents() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
    .gte("ends_at", new Date().toISOString());
  if (error) return 0;
  return count ?? 0;
}
