"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/authorization";
import { adminDatabaseError, formString, venueFormSchema, zodFieldErrors } from "@/lib/content/admin-validation";
import { createClient } from "@/lib/supabase/server";

import type { AdminActionState } from "./types";

export async function saveVenue(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const names = ["id", "name", "country", "addressLine1", "addressLine2", "city", "region", "postalCode", "mapUrl", "latitude", "longitude"];
  const parsed = venueFormSchema.safeParse(Object.fromEntries(names.map((name) => [name, formString(formData, name)])));
  if (!parsed.success) return { error: "No se guardó la sede.", fieldErrors: zodFieldErrors(parsed.error) };

  const venue = {
    name: parsed.data.name,
    address_line_1: parsed.data.addressLine1 ?? null,
    address_line_2: parsed.data.addressLine2 ?? null,
    city: parsed.data.city ?? null,
    region: parsed.data.region ?? null,
    country: parsed.data.country ?? null,
    postal_code: parsed.data.postalCode ?? null,
    latitude: parsed.data.latitude ?? null,
    longitude: parsed.data.longitude ?? null,
    map_url: parsed.data.mapUrl ?? null,
  };
  const supabase = await createClient();
  const { error } = parsed.data.id
    ? await supabase.from("event_venues").update(venue).eq("id", parsed.data.id)
    : await supabase.from("event_venues").insert({ ...venue, created_by: admin.id });
  if (error) return { error: adminDatabaseError(error, "la sede") };
  revalidatePath("/admin/sedes");
  return { success: "Sede guardada correctamente." };
}
