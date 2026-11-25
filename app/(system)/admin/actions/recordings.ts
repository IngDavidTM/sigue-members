"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/authorization";
import { validateSanitizedRichText } from "@/lib/content/admin-utils";
import { adminDatabaseError, formChecked, formString } from "@/lib/content/admin-validation";
import { isSigueAxis, parseMaterials, videoEmbed } from "@/lib/members/recordings";
import { createClient } from "@/lib/supabase/server";

import type { AdminActionState } from "./types";

const failed = "No se guardó la grabación.";

function revalidateRecording(eventId: string) {
  revalidatePath(`/admin/eventos/${eventId}`);
  revalidatePath("/admin/eventos");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/[locale]/evento/[slug]", "page");
}

export async function saveEventRecording(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const eventId = z.uuid().safeParse(formString(formData, "eventId"));
  if (!eventId.success) return { error: "Falta el evento. Recarga la página." };

  const videoUrl = formString(formData, "videoUrl").trim();
  const axis = formString(formData, "sigueAxis");
  const fieldErrors: Record<string, string[]> = {};

  if (!videoUrl) fieldErrors.videoUrl = ["Pega el enlace de la grabación."];
  else if (videoUrl.length > 2000 || !videoEmbed(videoUrl)) fieldErrors.videoUrl = ["Usa un enlace https:// válido (YouTube, Vimeo o Zoom)."];
  if (axis && !isSigueAxis(axis)) fieldErrors.sigueAxis = ["Elige un eje de la lista."];

  const summaryEs = validateSanitizedRichText(formString(formData, "summaryEs"), "El resumen en español", true);
  const summaryEn = validateSanitizedRichText(formString(formData, "summaryEn"), "El resumen en inglés", true);
  if (summaryEs.error) fieldErrors.summaryEs = [summaryEs.error];
  if (summaryEn.error) fieldErrors.summaryEn = [summaryEn.error];

  const { materials, invalidLines } = parseMaterials(formString(formData, "materials"));
  if (invalidLines.length) {
    fieldErrors.materials = [`Revisa la línea ${invalidLines.join(", ")}: usa «Nombre | https://…».`];
  } else if (materials.length > 20) {
    fieldErrors.materials = ["Máximo 20 materiales."];
  }

  const isPublished = formChecked(formData, "isPublished");
  if (isPublished && !summaryEs.html && !summaryEn.html) {
    fieldErrors.summaryEs = ["Escribe al menos un resumen antes de publicarla para los miembros."];
  }
  if (Object.keys(fieldErrors).length) return { error: failed, fieldErrors };

  const supabase = await createClient();
  const { data: event, error: eventError } = await supabase.from("events").select("id").eq("id", eventId.data).maybeSingle();
  if (eventError) return { error: adminDatabaseError(eventError, "la grabación") };
  if (!event) return { error: "El evento ya no existe." };

  const { error } = await supabase.from("event_recordings").upsert({
    event_id: eventId.data,
    video_url: videoUrl,
    sigue_axis: isSigueAxis(axis) ? axis : null,
    summary_es_html: summaryEs.html,
    summary_en_html: summaryEn.html,
    materials,
    is_published: isPublished,
    updated_by: admin.id,
  }, { onConflict: "event_id" });
  if (error) return { error: adminDatabaseError(error, "la grabación") };

  revalidateRecording(eventId.data);
  redirect(`/admin/eventos/${eventId.data}?recording=saved#grabacion`);
}

export async function deleteEventRecording(formData: FormData) {
  await requireAdmin();
  const eventId = z.uuid().safeParse(formData.get("eventId"));
  if (!eventId.success) return;
  const supabase = await createClient();
  const { error } = await supabase.from("event_recordings").delete().eq("event_id", eventId.data);
  if (error) throw new Error(error.message);
  revalidateRecording(eventId.data);
  redirect(`/admin/eventos/${eventId.data}?recording=deleted#grabacion`);
}
