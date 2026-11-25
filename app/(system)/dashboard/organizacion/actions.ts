"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/lib/auth/authorization";
import { getMemberLocale } from "@/lib/members/locale";
import { canEdit, isOnboardingStep, parseStep, STEPS } from "@/lib/members/organization";
import { organizationCopy } from "@/lib/members/organization-copy";
import { getMyOrganization } from "@/lib/members/organization-queries";
import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";

export type MemberFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  link?: string;
  emailSent?: boolean;
};

async function copy() {
  return organizationCopy(await getMemberLocale());
}

function refresh() {
  revalidatePath("/dashboard", "layout");
}

export async function createOrganization(_state: MemberFormState, formData: FormData): Promise<MemberFormState> {
  await requireUser();
  const text = await copy();
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 160) return { error: text.errors.generic, fieldErrors: { name: [text.errors.required] } };
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_organization", { p_name: name });
  if (error?.code === "23505") return { error: text.create.exists };
  if (error) return { error: text.errors.database };
  refresh();
  redirect("/dashboard/organizacion/editar/identidad");
}

export async function saveOrganizationStep(_state: MemberFormState, formData: FormData): Promise<MemberFormState> {
  await requireUser();
  const text = await copy();
  const step = formData.get("step");
  if (!isOnboardingStep(step)) return { error: text.errors.generic };
  // The organization always comes from the session, never from the form.
  const mine = await getMyOrganization();
  if (!mine.available || !mine.organization) redirect("/dashboard/organizacion");
  if (!canEdit(mine.role)) return { error: text.errors.readOnly };

  const { data, errors } = parseStep(step, formData);
  if (errors) {
    const fieldErrors = Object.fromEntries(Object.entries(errors).map(([field, code]) => [field, [text.errors[code as keyof typeof text.errors] as string ?? text.errors.generic]]));
    return { error: text.errors.generic, fieldErrors };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").update(data!).eq("id", mine.organization.id);
  if (error) return { error: error.code === "23514" ? text.errors.generic : text.errors.database };

  refresh();
  const next = STEPS[STEPS.indexOf(step) + 1];
  redirect(formData.get("intent") === "next" && next ? `/dashboard/organizacion/editar/${next}` : "/dashboard/organizacion?saved=1");
}

export async function submitOrganization(_state: MemberFormState, formData: FormData): Promise<MemberFormState> {
  await requireUser();
  const text = await copy();
  if (formData.get("consent") !== "on") return { error: text.errors.generic, fieldErrors: { consent: [text.errors.required] } };
  const mine = await getMyOrganization();
  if (!mine.available || !mine.organization) redirect("/dashboard/organizacion");
  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_organization", { p_organization_id: mine.organization.id });
  if (error?.code === "23514") return { error: text.overview.missing };
  if (error) return { error: text.errors.database };
  refresh();
  revalidatePath("/admin/miembros");
  redirect("/dashboard/organizacion?submitted=1");
}

async function sendInvitationEmail(to: string, organizationName: string, link: string, locale: "es" | "en") {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const subject = locale === "en" ? `Invitation to ${organizationName} on SIGUE Network` : `Invitación a ${organizationName} en SIGUE Network`;
  const body = locale === "en"
    ? `You have been invited to join ${organizationName} in the SIGUE Network member area.\n\nCreate your account or sign in with this email, then open:\n${link}\n\nThe link works once and expires in 14 days.`
    : `Te invitaron a unirte a ${organizationName} en el área de miembros de SIGUE Network.\n\nCrea tu cuenta o inicia sesión con este correo y abre:\n${link}\n\nEl enlace funciona una sola vez y vence en 14 días.`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ from: process.env.FORM_FROM_EMAIL || "SIGUE Network <formularios@siguenetwork.org>", to: [to], subject, text: body }),
      signal: AbortSignal.timeout(15000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function inviteMember(_state: MemberFormState, formData: FormData): Promise<MemberFormState> {
  await requireUser();
  const locale = await getMemberLocale();
  const text = organizationCopy(locale);
  const email = z.email().safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  const role = formData.get("role") === "viewer" ? "viewer" : "editor";
  if (!email.success) return { error: text.errors.generic, fieldErrors: { email: [text.errors.email] } };
  const mine = await getMyOrganization();
  if (!mine.available || !mine.organization) redirect("/dashboard/organizacion");
  if (mine.role !== "owner") return { error: text.team.onlyOwner };

  const supabase = await createClient();
  const { data: token, error } = await supabase.rpc("create_organization_invitation", {
    p_organization_id: mine.organization.id,
    p_email: email.data,
    p_role: role,
  });
  if (error || !token) return { error: text.errors.database };
  const link = `${getURL()}/dashboard/invitacion/${token}`;
  const emailSent = await sendInvitationEmail(email.data, mine.organization.name, link, locale);
  revalidatePath("/dashboard/organizacion/equipo");
  return { link, emailSent };
}

export async function revokeInvitation(formData: FormData) {
  await requireUser();
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const supabase = await createClient();
  // RLS lets only the owner (or an admin) delete invitations of their organization.
  await supabase.from("organization_invitations").delete().eq("id", id.data);
  revalidatePath("/dashboard/organizacion/equipo");
}

export async function removeMember(formData: FormData) {
  await requireUser();
  const userId = z.uuid().safeParse(formData.get("userId"));
  const mine = await getMyOrganization();
  if (!userId.success || !mine.available || !mine.organization || mine.role !== "owner") return;
  const supabase = await createClient();
  await supabase.from("organization_members").delete().eq("organization_id", mine.organization.id).eq("user_id", userId.data);
  revalidatePath("/dashboard/organizacion/equipo");
}

export async function acceptInvitation(_state: MemberFormState, formData: FormData): Promise<MemberFormState> {
  await requireUser();
  const text = await copy();
  const token = String(formData.get("token") ?? "");
  if (!/^[a-f0-9]{64}$/.test(token)) return { error: text.invitation.invalid };
  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_organization_invitation", { p_token: token });
  if (error?.code === "23505") return { error: text.invitation.alreadyMember };
  if (error) return { error: text.invitation.invalid };
  refresh();
  redirect("/dashboard/organizacion?joined=1");
}
