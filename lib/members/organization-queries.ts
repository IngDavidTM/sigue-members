import "server-only";

import { cache } from "react";

import { getAuthenticatedProfile } from "@/lib/auth/authorization";
import { isMissingRelation } from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";
import type { OrganizationInvitationRow, OrganizationRole, OrganizationRow } from "@/types/supabase";

export type TeamMember = { userId: string; role: OrganizationRole; name: string | null; email: string | null; joinedAt: string; isYou: boolean };

export type MyOrganization =
  | { available: false }
  | { available: true; organization: null }
  | {
      available: true;
      organization: OrganizationRow;
      role: OrganizationRole;
      team: TeamMember[];
      invitations: OrganizationInvitationRow[];
    };

/** The signed-in person's organization, their role in it and the team. Cached per request. */
export const getMyOrganization = cache(async (): Promise<MyOrganization> => {
  const profile = await getAuthenticatedProfile();
  if (!profile) return { available: true, organization: null };
  const supabase = await createClient();

  const { data: membership, error } = await supabase
    .from("organization_members")
    .select("organization_id,role")
    .eq("user_id", profile.id)
    .maybeSingle();
  if (isMissingRelation(error)) return { available: false };
  if (error) throw new Error(error.message);
  if (!membership) return { available: true, organization: null };

  const [organizationResult, membersResult, invitationsResult] = await Promise.all([
    supabase.from("organizations").select("*").eq("id", membership.organization_id).single(),
    supabase.from("organization_members").select("user_id,role,created_at").eq("organization_id", membership.organization_id).order("created_at"),
    membership.role === "owner"
      ? supabase.from("organization_invitations")
        .select("id,organization_id,email,role,invited_by,expires_at,accepted_at,accepted_by,created_at")
        .eq("organization_id", membership.organization_id)
        .is("accepted_at", null)
        .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as OrganizationInvitationRow[], error: null }),
  ]);
  if (organizationResult.error) throw new Error(organizationResult.error.message);
  if (membersResult.error) throw new Error(membersResult.error.message);
  if (invitationsResult.error) throw new Error(invitationsResult.error.message);

  const ids = membersResult.data.map((member) => member.user_id);
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("id,full_name,email").in("id", ids);
  if (profilesError) throw new Error(profilesError.message);
  const byId = new Map(profiles.map((item) => [item.id, item]));

  return {
    available: true,
    organization: organizationResult.data,
    role: membership.role,
    team: membersResult.data.map((member) => ({
      userId: member.user_id,
      role: member.role,
      name: byId.get(member.user_id)?.full_name ?? null,
      email: byId.get(member.user_id)?.email ?? null,
      joinedAt: member.created_at,
      isYou: member.user_id === profile.id,
    })),
    invitations: invitationsResult.data ?? [],
  };
});
