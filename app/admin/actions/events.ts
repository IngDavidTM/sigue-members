"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/authorization";
import {
  checked,
  optionalString,
  sanitizeRichText,
  slugify,
  zonedInputToIso,
} from "@/lib/content/admin-utils";
import { createClient } from "@/lib/supabase/server";
import type { ContentLocale } from "@/types/supabase";

import type { AdminActionState } from "./types";

const eventSchema = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  status: z.enum(["draft", "published", "cancelled", "archived"]),
  attendanceMode: z.enum(["in_person", "virtual", "hybrid"]),
  timezone: z.string().trim().min(3).max(80),
  startsAt: z.string().min(1, "Indica cuándo comienza el evento."),
  endsAt: z.string().min(1, "Indica cuándo termina el evento."),
  venueId: z.union([z.uuid(), z.literal("")]),
  featuredImageUrl: z.union([z.url(), z.literal("")]),
  titleEs: z.string().trim().min(3),
  titleEn: z.string().trim().min(3),
  slugEs: z.string().trim(),
  slugEn: z.string().trim(),
  contentEs: z.string(),
  contentEn: z.string(),
});

function translationFromForm(
  formData: FormData,
  locale: ContentLocale,
  title: string,
  slug: string,
  content: string,
) {
  const suffix = locale === "es" ? "Es" : "En";
  return {
    locale,
    title,
    slug: slugify(slug || title),
    excerpt: optionalString(formData.get(`excerpt${suffix}`)),
    content_html: sanitizeRichText(content),
    agenda_html: sanitizeRichText(String(formData.get(`agenda${suffix}`) || "")) || null,
    image_alt: optionalString(formData.get(`imageAlt${suffix}`)),
    seo_title: optionalString(formData.get(`seoTitle${suffix}`)),
    seo_description: optionalString(formData.get(`seoDescription${suffix}`)),
    focus_keyphrase: optionalString(formData.get(`focusKeyphrase${suffix}`)),
    canonical_url: optionalString(formData.get(`canonicalUrl${suffix}`)),
    og_title: optionalString(formData.get(`ogTitle${suffix}`)),
    og_description: optionalString(formData.get(`ogDescription${suffix}`)),
    og_image_url: optionalString(formData.get(`ogImageUrl${suffix}`)),
    noindex: checked(formData.get(`noindex${suffix}`)),
    nofollow: checked(formData.get(`nofollow${suffix}`)),
  };
}

export async function saveEvent(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = eventSchema.safeParse({
    id: String(formData.get("id") || ""),
    status: formData.get("status"),
    attendanceMode: formData.get("attendanceMode"),
    timezone: formData.get("timezone"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    venueId: String(formData.get("venueId") || ""),
    featuredImageUrl: String(formData.get("featuredImageUrl") || ""),
    titleEs: formData.get("titleEs"),
    titleEn: formData.get("titleEn"),
    slugEs: String(formData.get("slugEs") || ""),
    slugEn: String(formData.get("slugEn") || ""),
    contentEs: String(formData.get("contentEs") || ""),
    contentEn: String(formData.get("contentEn") || ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const values = parsed.data;

  try {
    new Intl.DateTimeFormat("en", { timeZone: values.timezone });
  } catch {
    return { error: "La zona horaria no es válida." };
  }

  const startsAt = zonedInputToIso(values.startsAt, values.timezone);
  const endsAt = zonedInputToIso(values.endsAt, values.timezone);
  if (new Date(endsAt) <= new Date(startsAt)) {
    return { error: "El evento debe terminar después de su inicio." };
  }
  if (["in_person", "hybrid"].includes(values.attendanceMode) && !values.venueId) {
    return { error: "Selecciona una sede para el evento presencial o híbrido." };
  }
  const virtualUrl = optionalString(formData.get("virtualUrl"));
  if (["virtual", "hybrid"].includes(values.attendanceMode) && !virtualUrl) {
    return { error: "Agrega el enlace del evento virtual o híbrido." };
  }
  if (!values.contentEs.trim() || !values.contentEn.trim()) {
    return { error: "Escribe la descripción completa en español y en inglés." };
  }

  const registrationDeadlineInput = optionalString(formData.get("registrationDeadline"));
  const publishedAtInput = optionalString(formData.get("publishedAt"));
  const existingPublishedAt = optionalString(formData.get("existingPublishedAt"));
  if (
    registrationDeadlineInput &&
    new Date(zonedInputToIso(registrationDeadlineInput, values.timezone)) > new Date(endsAt)
  ) {
    return { error: "El cierre de inscripción no puede ser posterior al final del evento." };
  }
  const isFree = checked(formData.get("isFree"));
  const priceValue = optionalString(formData.get("priceAmount"));
  if (!isFree && (!priceValue || Number(priceValue) < 0)) {
    return { error: "Indica un precio válido para el evento." };
  }

  const supabase = await createClient();
  const eventData = {
    status: values.status,
    attendance_mode: values.attendanceMode,
    starts_at: startsAt,
    ends_at: endsAt,
    timezone: values.timezone,
    all_day: checked(formData.get("allDay")),
    venue_id: values.venueId || null,
    show_virtual_url: checked(formData.get("showVirtualUrl")),
    registration_url: optionalString(formData.get("registrationUrl")),
    registration_deadline: registrationDeadlineInput
      ? zonedInputToIso(registrationDeadlineInput, values.timezone)
      : null,
    capacity: optionalString(formData.get("capacity"))
      ? Number(formData.get("capacity"))
      : null,
    is_free: isFree,
    price_amount: isFree ? null : Number(priceValue),
    currency: String(formData.get("currency") || "USD").toUpperCase().slice(0, 3),
    featured_image_url: values.featuredImageUrl || null,
    is_featured: checked(formData.get("isFeatured")),
    organizer_name: optionalString(formData.get("organizerName")),
    published_at:
      values.status === "published"
        ? publishedAtInput
          ? new Date(publishedAtInput).toISOString()
          : existingPublishedAt || new Date().toISOString()
        : publishedAtInput
          ? new Date(publishedAtInput).toISOString()
          : existingPublishedAt,
    updated_by: admin.id,
  };

  let eventId = values.id;
  if (eventId) {
    const { error } = await supabase.from("events").update(eventData).eq("id", eventId);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("events")
      .insert({ ...eventData, created_by: admin.id })
      .select("id")
      .single();
    if (error) return { error: error.message };
    eventId = data.id;
  }

  const translations = [
    translationFromForm(formData, "es", values.titleEs, values.slugEs, values.contentEs),
    translationFromForm(formData, "en", values.titleEn, values.slugEn, values.contentEn),
  ].map((translation) => ({ ...translation, event_id: eventId }));
  const { error: translationError } = await supabase
    .from("event_translations")
    .upsert(translations, { onConflict: "event_id,locale" });
  if (translationError) return { error: translationError.message };

  const { error: accessError } = await supabase.from("event_private_access").upsert(
    {
      event_id: eventId,
      virtual_url: virtualUrl,
      organizer_email: optionalString(formData.get("organizerEmail")),
    },
    { onConflict: "event_id" },
  );
  if (accessError) return { error: accessError.message };

  revalidatePath("/admin/eventos");
  revalidatePath("/es/eventos");
  revalidatePath("/en/eventos");
  redirect(`/admin/eventos/${eventId}?saved=1`);
}

export async function archiveEvent(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.from("events").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/eventos");
  revalidatePath("/es/eventos");
  revalidatePath("/en/eventos");
}
