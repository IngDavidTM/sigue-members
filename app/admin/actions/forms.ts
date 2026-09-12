"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { AdminActionState } from "@/app/admin/actions/types";
import { requireAdmin } from "@/lib/auth/authorization";
import { slugify } from "@/lib/content/admin-utils";
import { createClient } from "@/lib/supabase/server";
import { deliverFormNotification } from "@/lib/forms/notifications";
import type { Json } from "@/types/supabase";

const optionSchema = z.object({ value: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), label_es: z.string().min(1).max(200), label_en: z.string().min(1).max(200) });
const fieldSchema = z.object({
  field_key: z.string().regex(/^[a-z][a-z0-9_]*$/).max(60),
  field_type: z.enum(["short_text", "long_text", "email", "phone", "number", "date", "url", "select", "multiselect", "radio", "checkbox", "consent"]),
  label_es: z.string().min(1).max(200), label_en: z.string().min(1).max(200),
  placeholder_es: z.string().max(300).nullable(), placeholder_en: z.string().max(300).nullable(),
  help_text_es: z.string().max(500).nullable(), help_text_en: z.string().max(500).nullable(),
  required: z.boolean(), options: z.array(optionSchema).max(100),
  validation: z.object({ max_length: z.number().int().min(1).max(20000).optional() }),
  conditional_logic: z.record(z.string(), z.unknown()).nullable(),
  sort_order: z.number().int(), width: z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]),
});
const formSchema = z.object({
  id: z.union([z.uuid(), z.literal("")]), expectedUpdatedAt: z.string(),
  name: z.string().trim().min(2).max(150), slug: z.string().trim().max(100),
  status: z.enum(["draft", "published", "archived"]),
  titleEs: z.string().trim().min(2).max(200), titleEn: z.string().trim().min(2).max(200),
  descriptionEs: z.string().trim().max(1000), descriptionEn: z.string().trim().max(1000),
  submitLabelEs: z.string().trim().min(1).max(100), submitLabelEn: z.string().trim().min(1).max(100),
  successMessageEs: z.string().trim().min(2).max(1000), successMessageEn: z.string().trim().min(2).max(1000),
  notificationEmails: z.string().max(2000), notificationSubject: z.string().trim().max(300), replyToFieldKey: z.string().trim().max(60),
});

function value(formData: FormData, name: string) { return String(formData.get(name) ?? ""); }

export async function saveDynamicForm(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = formSchema.safeParse(Object.fromEntries([
    "id", "expectedUpdatedAt", "name", "slug", "status", "titleEs", "titleEn", "descriptionEs", "descriptionEn",
    "submitLabelEs", "submitLabelEn", "successMessageEs", "successMessageEn", "notificationEmails", "notificationSubject", "replyToFieldKey",
  ].map((name) => [name, value(formData, name)])));
  if (!parsed.success) return { error: "No se guardó el formulario.", fieldErrors: parsed.error.flatten().fieldErrors };

  let rawFields: unknown;
  try { rawFields = JSON.parse(value(formData, "fieldsJson")); }
  catch { return { error: "La configuración de preguntas no tiene un formato válido." }; }
  const fieldsResult = z.array(fieldSchema).min(1, "Agrega al menos una pregunta.").max(100).safeParse(rawFields);
  if (!fieldsResult.success) return { error: `Revisa las preguntas: ${fieldsResult.error.issues[0]?.message ?? "configuración inválida"}` };
  const fields = fieldsResult.data;
  if (new Set(fields.map((field) => field.field_key)).size !== fields.length) return { error: "Cada pregunta debe tener una clave única." };
  if (fields.some((field) => ["select", "multiselect", "radio"].includes(field.field_type) && !field.options.length)) return { error: "Las preguntas de selección necesitan al menos una opción." };
  if (fields.some((field) => new Set(field.options.map((option) => option.value)).size !== field.options.length)) return { error: "Las opciones de una pregunta no pueden estar repetidas." };

  const slug = slugify(parsed.data.slug || parsed.data.name);
  if (!slug) return { error: "El slug debe contener letras o números.", fieldErrors: { slug: ["Escribe un slug válido."] } };
  const notificationEmails = [...new Set(parsed.data.notificationEmails.split(/[\n,;]/).map((email) => email.trim().toLowerCase()).filter(Boolean))];
  const emailResult = z.array(z.email()).max(10).safeParse(notificationEmails);
  if (!emailResult.success) return { error: "Revisa los correos de notificación.", fieldErrors: { notificationEmails: ["Usa correos válidos, separados por coma o por línea."] } };
  const replyField = parsed.data.replyToFieldKey || null;
  if (replyField && !fields.some((field) => field.field_key === replyField && field.field_type === "email")) return { error: "El campo para responder debe ser una pregunta de tipo email." };

  const expected = parsed.data.expectedUpdatedAt;
  if (parsed.data.id && !z.iso.datetime({ offset: true }).safeParse(expected).success) return { error: "Recarga la página antes de guardar; falta la versión del formulario." };
  const supabase = await createClient();
  const { data: savedId, error } = await supabase.rpc("save_dynamic_form", {
    p_id: parsed.data.id || null,
    p_record: {
      slug, name: parsed.data.name, status: parsed.data.status,
      title_es: parsed.data.titleEs, title_en: parsed.data.titleEn,
      description_es: parsed.data.descriptionEs || null, description_en: parsed.data.descriptionEn || null,
      submit_label_es: parsed.data.submitLabelEs, submit_label_en: parsed.data.submitLabelEn,
      success_message_es: parsed.data.successMessageEs, success_message_en: parsed.data.successMessageEn,
      notification_emails: emailResult.data, notification_subject: parsed.data.notificationSubject || null,
      reply_to_field_key: replyField, updated_by: admin.id,
    },
    p_fields: fields as unknown as Json,
    p_expected_updated_at: expected || null,
  });
  if (error || !savedId) {
    if (error?.code === "23505") return { error: "Ese slug o una clave de pregunta ya está en uso." };
    if (error?.code === "40001") return { error: "Otra persona modificó el formulario. Recarga antes de guardar." };
    return { error: "No se pudo guardar el formulario en la base de datos." };
  }
  revalidatePath("/admin/formularios");
  revalidatePath("/[locale]/formularios/[slug]", "page");
  revalidatePath("/[locale]/contacto", "page");
  redirect(`/admin/formularios/${savedId}?saved=1`);
}

export async function archiveDynamicForm(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const supabase = await createClient();
  const { error } = await supabase.from("dynamic_forms").update({ status: "archived" }).eq("id", id.data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/formularios");
}

export async function duplicateDynamicForm(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const supabase = await createClient();
  const [source, fields] = await Promise.all([
    supabase.from("dynamic_forms").select("*").eq("id", id.data).maybeSingle(),
    supabase.from("dynamic_form_fields").select("*").eq("form_id", id.data).order("sort_order").order("created_at"),
  ]);
  if (source.error || fields.error || !source.data) throw new Error(source.error?.message ?? fields.error?.message ?? "Formulario no encontrado.");

  const baseSlug = `${source.data.slug}-copia`.slice(0, 92).replace(/-$/, "");
  const existing = await supabase.from("dynamic_forms").select("slug").like("slug", `${baseSlug}%`);
  if (existing.error) throw new Error(existing.error.message);
  const used = new Set(existing.data.map((item) => item.slug));
  let slug = baseSlug;
  for (let suffix = 2; used.has(slug); suffix += 1) slug = `${baseSlug}-${suffix}`;

  const clonedFields = fields.data.map((field, index) => ({
    field_key: field.field_key, field_type: field.field_type, label_es: field.label_es, label_en: field.label_en,
    placeholder_es: field.placeholder_es, placeholder_en: field.placeholder_en,
    help_text_es: field.help_text_es, help_text_en: field.help_text_en,
    required: field.required, options: field.options, validation: field.validation,
    conditional_logic: field.conditional_logic, sort_order: (index + 1) * 10, width: field.width,
  }));
  const { data: savedId, error } = await supabase.rpc("save_dynamic_form", {
    p_id: null,
    p_record: {
      slug, name: `${source.data.name} (copia)`, status: "draft",
      title_es: source.data.title_es, title_en: source.data.title_en,
      description_es: source.data.description_es, description_en: source.data.description_en,
      submit_label_es: source.data.submit_label_es, submit_label_en: source.data.submit_label_en,
      success_message_es: source.data.success_message_es, success_message_en: source.data.success_message_en,
      notification_emails: source.data.notification_emails, notification_subject: source.data.notification_subject,
      reply_to_field_key: source.data.reply_to_field_key,
    },
    p_fields: clonedFields as unknown as Json,
    p_expected_updated_at: null,
  });
  if (error || !savedId) throw new Error(error?.message ?? "No se pudo duplicar el formulario.");
  revalidatePath("/admin/formularios");
  redirect(`/admin/formularios/${savedId}?saved=1`);
}

export async function updateDynamicSubmission(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = z.object({ id: z.uuid(), status: z.enum(["new", "read", "archived", "spam"]), notes: z.string().max(10000) }).safeParse({
    id: formData.get("id"), status: formData.get("status"), notes: value(formData, "notes"),
  });
  if (!parsed.success) return;
  const supabase = await createClient();
  const { error } = await supabase.from("dynamic_form_submissions").update({
    status: parsed.data.status, admin_notes: parsed.data.notes || null,
    reviewed_by: admin.id, reviewed_at: new Date().toISOString(),
  }).eq("id", parsed.data.id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/respuestas");
  revalidatePath(`/admin/respuestas/${parsed.data.id}`);
}

export async function retryDynamicFormNotification(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().safeParse(formData.get("submissionId"));
  if (!id.success) return;
  const supabase = await createClient();
  await supabase.from("dynamic_form_notifications").update({ status: "pending", last_error: null }).eq("submission_id", id.data);
  await deliverFormNotification(id.data);
  revalidatePath(`/admin/respuestas/${id.data}`);
}
