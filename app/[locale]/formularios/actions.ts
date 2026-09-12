"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";

import { createAdminClient } from "@/lib/supabase/admin";
import { deliverFormNotification } from "@/lib/forms/notifications";
import type { Json } from "@/types/supabase";

export type PublicFormState = {
  success?: boolean;
  message?: string;
};

export async function submitDynamicForm(
  slug: string,
  locale: "es" | "en",
  _previous: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  if (String(formData.get("website") ?? "")) return { success: true };
  if (locale !== "es" && locale !== "en") return { message: "Invalid language." };

  const fingerprintSecret = process.env.FORM_RATE_LIMIT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!fingerprintSecret) return { message: locale === "es" ? "El formulario no está disponible temporalmente." : "The form is temporarily unavailable." };
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || requestHeaders.get("x-real-ip") || "unknown";
  const userAgent = requestHeaders.get("user-agent") || "unknown";
  const requestFingerprint = createHmac("sha256", fingerprintSecret)
    .update(`${address.slice(0, 128)}\n${userAgent.slice(0, 256)}`)
    .digest("hex");
  const supabase = createAdminClient();
  const formResult = await supabase
    .from("dynamic_forms")
    .select("id,success_message_es,success_message_en")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (formResult.error || !formResult.data) {
    return { message: locale === "es" ? "Este formulario ya no está disponible." : "This form is no longer available." };
  }
  const fieldsResult = await supabase
    .from("dynamic_form_fields")
    .select("field_key,field_type")
    .eq("form_id", formResult.data.id)
    .order("sort_order");
  if (fieldsResult.error) return { message: locale === "es" ? "No se pudo enviar. Intenta nuevamente." : "Could not submit. Please try again." };

  const answers: Record<string, Json> = {};
  for (const field of fieldsResult.data) {
    const name = `answer:${field.field_key}`;
    if (field.field_type === "multiselect") {
      answers[field.field_key] = formData.getAll(name).map(String).filter(Boolean);
    } else if (field.field_type === "checkbox" || field.field_type === "consent") {
      answers[field.field_key] = formData.get(name) === "true";
    } else if (field.field_type === "number") {
      const value = String(formData.get(name) ?? "").trim();
      if (value) {
        const number = Number(value);
        answers[field.field_key] = Number.isFinite(number) ? number : value;
      }
    } else {
      answers[field.field_key] = String(formData.get(name) ?? "").trim();
    }
  }

  const { data: submissionId, error } = await supabase.rpc("submit_dynamic_form", {
    p_slug: slug,
    p_locale: locale,
    p_answers: answers,
    p_source_path: String(formData.get("sourcePath") ?? "").slice(0, 500) || null,
    p_request_fingerprint: requestFingerprint,
  });
  if (error) {
    console.error("Dynamic form submission failed:", error.code, error.message);
    if (error.message.includes("Rate limit exceeded")) {
      return { message: locale === "es" ? "Recibimos varios envíos. Espera unos minutos antes de intentar nuevamente." : "We received several submissions. Wait a few minutes before trying again." };
    }
    return { message: locale === "es" ? "Revisa los campos e intenta nuevamente." : "Check the fields and try again." };
  }
  if (submissionId) {
    try { await deliverFormNotification(submissionId); }
    catch (notificationError) { console.error("Form notification could not be attempted:", notificationError); }
  }

  return {
    success: true,
    message: locale === "es" ? formResult.data.success_message_es : formResult.data.success_message_en,
  };
}
