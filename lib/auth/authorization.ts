import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/supabase";

export type AuthenticatedProfile = Pick<
  ProfileRow,
  "id" | "email" | "full_name" | "role"
>;

/**
 * Centralized, request-scoped session/profile lookup.
 *
 * UI guards are intentionally not trusted as authorization. Every data access
 * function and Server Action that mutates managed content calls requireAdmin().
 */
export const getAuthenticatedProfile = cache(
  async (): Promise<AuthenticatedProfile | null> => {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id,email,full_name,role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Unable to load the authenticated profile:", profileError.message);
      return null;
    }

    return profile;
  },
);

export async function requireUser(): Promise<AuthenticatedProfile> {
  const profile = await getAuthenticatedProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireAdmin(): Promise<AuthenticatedProfile> {
  const profile = await requireUser();
  if (profile.role !== "admin") redirect("/dashboard?error=admin-required");
  return profile;
}

export async function getPostLoginDestination() {
  const profile = await getAuthenticatedProfile();
  return profile?.role === "admin" ? "/admin" : "/dashboard";
}
