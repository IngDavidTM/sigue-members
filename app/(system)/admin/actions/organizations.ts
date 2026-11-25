"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import type { AdminActionState } from "./types";

function refresh(id: string) {
  revalidatePath("/admin/miembros");
  revalidatePath(`/admin/miembros/${id}`);
  revalidatePath("/dashboard", "layout");
}

export async function reviewOrganization(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  const decision = formData.get("decision");
  const message = String(formData.get("message") ?? "").trim();
  if (!id.success) return { error: "Falta la organización. Recarga la página." };
  if (decision !== "approved" && decision !== "changes_requested") return { error: "Elige aprobar o pedir cambios." };
  if (decision === "changes_requested" && !message) {
    return { error: "No se guardó la revisión.", fieldErrors: { message: ["Explica qué debe ajustar la organización; lo verá en su panel."] } };
  }
  if (message.length > 2000) return { error: "No se guardó la revisión.", fieldErrors: { message: ["Máximo 2.000 caracteres."] } };
  const supabase = await createClient();
  const { error } = await supabase.rpc("review_organization", { p_organization_id: id.data, p_status: decision, p_message: message || null });
  if (error) return { error: "No se pudo guardar la revisión. Inténtalo de nuevo." };
  refresh(id.data);
  redirect(`/admin/miembros/${id.data}?reviewed=${decision}`);
}

export async function addOrganizationNote(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  const body = String(formData.get("body") ?? "").trim();
  if (!id.success) return { error: "Falta la organización. Recarga la página." };
  if (!body || body.length > 4000) return { error: "No se guardó la nota.", fieldErrors: { body: ["Escribe una nota de hasta 4.000 caracteres."] } };
  const supabase = await createClient();
  const { error } = await supabase.from("organization_notes").insert({ organization_id: id.data, author_id: admin.id, body });
  if (error) return { error: "No se pudo guardar la nota." };
  refresh(id.data);
  redirect(`/admin/miembros/${id.data}#notas`);
}

export async function deleteOrganizationNote(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  const organizationId = z.uuid().safeParse(formData.get("organizationId"));
  if (!id.success || !organizationId.success) return;
  const supabase = await createClient();
  const { error } = await supabase.from("organization_notes").delete().eq("id", id.data);
  if (error) throw new Error(error.message);
  refresh(organizationId.data);
}
