"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/authorization";
import { optionalString } from "@/lib/content/admin-utils";
import { createClient } from "@/lib/supabase/server";

import type { AdminActionState } from "./types";

export async function saveVenue(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = z
    .object({
      id: z.union([z.uuid(), z.literal("")]),
      name: z.string().trim().min(2),
      latitude: z.union([z.coerce.number().min(-90).max(90), z.literal("")]),
      longitude: z.union([z.coerce.number().min(-180).max(180), z.literal("")]),
    })
    .safeParse({
      id: String(formData.get("id") || ""),
      name: formData.get("name"),
      latitude: String(formData.get("latitude") || ""),
      longitude: String(formData.get("longitude") || ""),
    });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const venue = {
    name: parsed.data.name,
    address_line_1: optionalString(formData.get("addressLine1")),
    address_line_2: optionalString(formData.get("addressLine2")),
    city: optionalString(formData.get("city")),
    region: optionalString(formData.get("region")),
    country: optionalString(formData.get("country")),
    postal_code: optionalString(formData.get("postalCode")),
    latitude: parsed.data.latitude === "" ? null : parsed.data.latitude,
    longitude: parsed.data.longitude === "" ? null : parsed.data.longitude,
    map_url: optionalString(formData.get("mapUrl")),
  };
  const supabase = await createClient();
  const { error } = parsed.data.id
    ? await supabase.from("event_venues").update(venue).eq("id", parsed.data.id)
    : await supabase.from("event_venues").insert({ ...venue, created_by: admin.id });
  if (error) return { error: error.message };
  revalidatePath("/admin/sedes");
  return { success: "Sede guardada correctamente." };
}
