import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getFieldOptions } from "@/lib/forms/options";

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export async function deliverFormNotification(submissionId: string) {
  const supabase = createAdminClient();
  const [notification, submission] = await Promise.all([
    supabase.from("dynamic_form_notifications").select("*").eq("submission_id", submissionId).maybeSingle(),
    supabase.from("dynamic_form_submissions").select("*").eq("id", submissionId).maybeSingle(),
  ]);
  if (notification.error || submission.error || !notification.data || !submission.data || notification.data.status === "sent") return "skipped" as const;
  const [form, fields] = await Promise.all([
    supabase.from("dynamic_forms").select("*").eq("id", submission.data.form_id).maybeSingle(),
    supabase.from("dynamic_form_fields").select("*").eq("form_id", submission.data.form_id).order("sort_order"),
  ]);
  if (form.error || fields.error || !form.data) {
    await supabase.from("dynamic_form_notifications").update({ status: "failed", attempts: notification.data.attempts + 1, last_error: "No se pudo cargar la configuración del formulario", attempted_at: new Date().toISOString() }).eq("id", notification.data.id);
    return "failed" as const;
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Keep the notification queued until an email provider is configured.
    return "skipped" as const;
  }
  const answers = submission.data.answers && !Array.isArray(submission.data.answers) && typeof submission.data.answers === "object" ? submission.data.answers : {};
  const lines = fields.data.map((field) => {
    const options = new Map(getFieldOptions(field.options).map((option) => [option.value, option.label_es]));
    const raw = answers[field.field_key];
    const value = Array.isArray(raw) ? raw.map(String).map((item) => options.get(item) ?? item).join(", ") : typeof raw === "boolean" ? (raw ? "Sí" : "No") : String(raw ?? "—");
    return { label: field.label_es, value };
  });
  const replyTo = form.data.reply_to_field_key ? answers[form.data.reply_to_field_key] : null;
  const payload: Record<string, unknown> = {
    from: process.env.FORM_FROM_EMAIL || "SIGUE Network <formularios@siguenetwork.org>",
    to: notification.data.recipients,
    subject: notification.data.subject,
    text: lines.map((line) => `${line.label}:\n${line.value}`).join("\n\n"),
    html: `<h1>${escapeHtml(form.data.name)}</h1>${lines.map((line) => `<p><strong>${escapeHtml(line.label)}</strong><br>${escapeHtml(line.value).replaceAll("\n", "<br>")}</p>`).join("")}`,
  };
  if (typeof replyTo === "string" && replyTo.includes("@")) payload.reply_to = replyTo;
  const attemptedAt = new Date().toISOString();
  try {
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json", "idempotency-key": `form-submission-${submissionId}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
    const result = await response.json();
    if (!response.ok) throw new Error(typeof result?.message === "string" ? result.message : `Resend HTTP ${response.status}`);
    await supabase.from("dynamic_form_notifications").update({ status: "sent", attempts: notification.data.attempts + 1, provider_id: result.id ?? null, last_error: null, attempted_at: attemptedAt, sent_at: attemptedAt }).eq("id", notification.data.id);
    return "sent" as const;
  } catch (error) {
    await supabase.from("dynamic_form_notifications").update({ status: "failed", attempts: notification.data.attempts + 1, last_error: error instanceof Error ? error.message.slice(0, 1000) : "Error de envío", attempted_at: attemptedAt }).eq("id", notification.data.id);
    return "failed" as const;
  }
}
