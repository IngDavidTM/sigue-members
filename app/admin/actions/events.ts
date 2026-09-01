"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/authorization";
import {
  slugify,
  validateSanitizedRichText,
  zonedInputToIso,
} from "@/lib/content/admin-utils";
import {
  eventFormSchema,
  adminDatabaseError,
  formChecked,
  formString,
  zodFieldErrors,
} from "@/lib/content/admin-validation";
import { createClient } from "@/lib/supabase/server";

import type { AdminActionState } from "./types";

type EventValues = z.infer<typeof eventFormSchema>;

function translationFromValues(values: EventValues, locale: "es" | "en", contentHtml: string, agendaHtml: string | null) {
  const suffix = locale === "es" ? "Es" : "En";
  const field = <K extends keyof EventValues>(name: K) => values[name];
  const title = field(`title${suffix}` as keyof EventValues) as string;
  return {
    locale,
    title,
    slug: slugify((field(`slug${suffix}` as keyof EventValues) as string) || title),
    excerpt: (field(`excerpt${suffix}` as keyof EventValues) as string | undefined) ?? null,
    content_html: contentHtml,
    agenda_html: agendaHtml,
    image_alt: (field(`imageAlt${suffix}` as keyof EventValues) as string | undefined) ?? null,
    seo_title: (field(`seoTitle${suffix}` as keyof EventValues) as string | undefined) ?? null,
    seo_description: (field(`seoDescription${suffix}` as keyof EventValues) as string | undefined) ?? null,
    focus_keyphrase: (field(`focusKeyphrase${suffix}` as keyof EventValues) as string | undefined) ?? null,
    canonical_url: (field(`canonicalUrl${suffix}` as keyof EventValues) as string | undefined) ?? null,
    og_title: (field(`ogTitle${suffix}` as keyof EventValues) as string | undefined) ?? null,
    og_description: (field(`ogDescription${suffix}` as keyof EventValues) as string | undefined) ?? null,
    og_image_url: (field(`ogImageUrl${suffix}` as keyof EventValues) as string | undefined) ?? null,
    noindex: false,
    nofollow: false,
  };
}

export async function saveEvent(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const names = [
    "id", "status", "attendanceMode", "timezone", "startsAt", "endsAt", "registrationDeadline",
    "publishedAt", "existingPublishedAt", "venueId", "virtualUrl", "registrationUrl", "capacity",
    "priceAmount", "currency", "organizerName", "organizerEmail", "featuredImageUrl", "titleEs",
    "titleEn", "slugEs", "slugEn", "excerptEs", "excerptEn", "contentEs", "contentEn", "agendaEs",
    "agendaEn", "imageAltEs", "imageAltEn", "seoTitleEs", "seoTitleEn", "seoDescriptionEs",
    "seoDescriptionEn", "focusKeyphraseEs", "focusKeyphraseEn", "canonicalUrlEs", "canonicalUrlEn",
    "ogTitleEs", "ogTitleEn", "ogDescriptionEs", "ogDescriptionEn", "ogImageUrlEs", "ogImageUrlEn",
  ];
  const parsed = eventFormSchema.safeParse({
    ...Object.fromEntries(names.map((name) => [name, formString(formData, name)])),
    isFree: formChecked(formData, "isFree"),
    showVirtualUrl: formChecked(formData, "showVirtualUrl"),
  });
  if (!parsed.success) return { error: "No se guardó el evento.", fieldErrors: zodFieldErrors(parsed.error) };
  const values = parsed.data;

  try {
    new Intl.DateTimeFormat("en", { timeZone: values.timezone });
  } catch {
    return { error: "No se guardó el evento.", fieldErrors: { timezone: ["La zona horaria no es válida."] } };
  }

  let startsAt: string;
  let endsAt: string;
  let registrationDeadline: string | null;
  let requestedPublishedAt: string | null;
  try {
    startsAt = zonedInputToIso(values.startsAt, values.timezone);
    endsAt = zonedInputToIso(values.endsAt, values.timezone);
    registrationDeadline = values.registrationDeadline ? zonedInputToIso(values.registrationDeadline, values.timezone) : null;
    requestedPublishedAt = values.publishedAt ? zonedInputToIso(values.publishedAt, values.timezone) : null;
  } catch {
    return { error: "No se guardó el evento.", fieldErrors: { startsAt: ["Revisa el formato de las fechas y horas."] } };
  }
  if (new Date(endsAt) <= new Date(startsAt)) {
    return { error: "No se guardó el evento.", fieldErrors: { endsAt: ["El evento debe terminar después de su inicio."] } };
  }

  if (registrationDeadline && new Date(registrationDeadline) > new Date(startsAt)) {
    return { error: "No se guardó el evento.", fieldErrors: { registrationDeadline: ["El cierre de inscripción no puede ser posterior al inicio del evento."] } };
  }

  const slugEs = slugify(values.slugEs || values.titleEs);
  const slugEn = slugify(values.slugEn || values.titleEn);
  if (!slugEs || !slugEn) return { error: "No se guardó el evento.", fieldErrors: { slugEs: ["El título o slug en español debe contener letras o números."], slugEn: ["El título o slug en inglés debe contener letras o números."] } };

  const contentEs = validateSanitizedRichText(values.contentEs, "La descripción en español");
  const contentEn = validateSanitizedRichText(values.contentEn, "La descripción en inglés");
  const agendaEs = values.agendaEs ? validateSanitizedRichText(values.agendaEs, "La agenda en español") : { html: "" };
  const agendaEn = values.agendaEn ? validateSanitizedRichText(values.agendaEn, "La agenda en inglés") : { html: "" };
  const richErrors = {
    ...(contentEs.error ? { contentEs: [contentEs.error] } : {}),
    ...(contentEn.error ? { contentEn: [contentEn.error] } : {}),
    ...(agendaEs.error ? { agendaEs: [agendaEs.error] } : {}),
    ...(agendaEn.error ? { agendaEn: [agendaEn.error] } : {}),
  };
  if (Object.keys(richErrors).length) {
    return { error: "No se guardó el evento.", fieldErrors: richErrors };
  }

  const supabase = await createClient();
  if (values.venueId) {
    const { data } = await supabase.from("event_venues").select("id").eq("id", values.venueId).maybeSingle();
    if (!data) return { error: "No se guardó el evento.", fieldErrors: { venueId: ["La sede seleccionada ya no existe."] } };
  }
  const [slugEsResult, slugEnResult] = await Promise.all([
    supabase.from("event_translations").select("event_id").eq("locale", "es").eq("slug", slugEs).maybeSingle(),
    supabase.from("event_translations").select("event_id").eq("locale", "en").eq("slug", slugEn).maybeSingle(),
  ]);
  if (slugEsResult.error || slugEnResult.error) return { error: "No se pudo comprobar la disponibilidad de los slugs." };
  if (slugEsResult.data && slugEsResult.data.event_id !== values.id) return { error: "No se guardó el evento.", fieldErrors: { slugEs: ["Este slug ya pertenece a otro evento en español."] } };
  if (slugEnResult.data && slugEnResult.data.event_id !== values.id) return { error: "No se guardó el evento.", fieldErrors: { slugEn: ["Este slug ya pertenece a otro evento en inglés."] } };
  const existingPublishedAt = values.existingPublishedAt || null;
  const eventData = {
    status: values.status,
    attendance_mode: values.attendanceMode,
    starts_at: startsAt,
    ends_at: endsAt,
    timezone: values.timezone,
    all_day: formChecked(formData, "allDay"),
    venue_id: values.venueId ?? null,
    show_virtual_url: values.showVirtualUrl,
    registration_url: values.registrationUrl ?? null,
    registration_deadline: registrationDeadline,
    capacity: values.capacity ?? null,
    is_free: values.isFree,
    price_amount: values.isFree ? null : values.priceAmount ?? null,
    currency: values.currency,
    featured_image_url: values.featuredImageUrl ?? null,
    is_featured: formChecked(formData, "isFeatured"),
    organizer_name: values.organizerName ?? null,
    published_at:
      ["published", "cancelled"].includes(values.status)
        ? requestedPublishedAt
          ? requestedPublishedAt
          : existingPublishedAt || new Date().toISOString()
        : requestedPublishedAt
          ? requestedPublishedAt
          : existingPublishedAt,
    updated_by: admin.id,
  };

  let eventId = values.id ?? "";
  let created = false;
  if (eventId) {
    const { error } = await supabase.from("events").update(eventData).eq("id", eventId);
    if (error) return { error: adminDatabaseError(error, "el evento") };
  } else {
    const { data, error } = await supabase
      .from("events")
      .insert({ ...eventData, created_by: admin.id })
      .select("id")
      .single();
    if (error) return { error: adminDatabaseError(error, "el evento") };
    eventId = data.id;
    created = true;
  }

  const translations = [
    { ...translationFromValues({ ...values, slugEs }, "es", contentEs.html, agendaEs.html || null), noindex: formChecked(formData, "noindexEs"), nofollow: formChecked(formData, "nofollowEs") },
    { ...translationFromValues({ ...values, slugEn }, "en", contentEn.html, agendaEn.html || null), noindex: formChecked(formData, "noindexEn"), nofollow: formChecked(formData, "nofollowEn") },
  ].map((translation) => ({ ...translation, event_id: eventId }));
  const { error: translationError } = await supabase
    .from("event_translations")
    .upsert(translations, { onConflict: "event_id,locale" });
  if (translationError) {
    if (created) await supabase.from("events").delete().eq("id", eventId);
    return { error: adminDatabaseError(translationError, "la traducción del evento") };
  }

  const { error: accessError } = await supabase.from("event_private_access").upsert(
    {
      event_id: eventId,
      virtual_url: values.virtualUrl ?? null,
      organizer_email: values.organizerEmail ?? null,
    },
    { onConflict: "event_id" },
  );
  if (accessError) {
    if (created) await supabase.from("events").delete().eq("id", eventId);
    return { error: adminDatabaseError(accessError, "los datos privados del evento") };
  }

  revalidatePath("/admin/eventos");
  revalidatePath("/es/eventos");
  revalidatePath("/en/eventos");
  revalidatePath("/sitemap.xml");
  redirect(`/admin/eventos/${eventId}?saved=1`);
}

export async function archiveEvent(formData: FormData) {
  await requireAdmin();
  const parsed = z.uuid().safeParse(formData.get("id"));
  if (!parsed.success) return;
  const id = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("events").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/eventos");
  revalidatePath("/es/eventos");
  revalidatePath("/en/eventos");
  revalidatePath("/sitemap.xml");
}
