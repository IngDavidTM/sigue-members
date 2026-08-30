"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/authorization";
import { optionalString, slugify } from "@/lib/content/admin-utils";
import { createClient } from "@/lib/supabase/server";

import type { AdminActionState } from "./types";

export async function saveSeries(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const schema = z.object({
    id: z.union([z.uuid(), z.literal("")]),
    parentId: z.union([z.uuid(), z.literal("")]),
    code: z.string().trim().min(2).max(80),
    nameEs: z.string().trim().min(2),
    nameEn: z.string().trim().min(2),
    sortOrder: z.coerce.number().int().min(0).max(9999),
  });
  const parsed = schema.safeParse({
    id: String(formData.get("id") || ""),
    parentId: String(formData.get("parentId") || ""),
    code: formData.get("code"),
    nameEs: formData.get("nameEs"),
    nameEn: formData.get("nameEn"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  if (parsed.data.id && parsed.data.id === parsed.data.parentId) {
    return { error: "Una serie no puede ser su propia categoría padre." };
  }

  const supabase = await createClient();
  const seriesData = {
    code: slugify(parsed.data.code),
    parent_id: parsed.data.parentId || null,
    sort_order: parsed.data.sortOrder,
  };
  let id = parsed.data.id;
  if (id) {
    const { error } = await supabase.from("blog_series").update(seriesData).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("blog_series")
      .insert({ ...seriesData, created_by: admin.id })
      .select("id")
      .single();
    if (error) return { error: error.message };
    id = data.id;
  }

  const { error } = await supabase.from("blog_series_translations").upsert(
    [
      {
        series_id: id,
        locale: "es",
        name: parsed.data.nameEs,
        slug: slugify(String(formData.get("slugEs") || parsed.data.nameEs)),
        description: optionalString(formData.get("descriptionEs")),
        seo_title: optionalString(formData.get("seoTitleEs")),
        seo_description: optionalString(formData.get("seoDescriptionEs")),
      },
      {
        series_id: id,
        locale: "en",
        name: parsed.data.nameEn,
        slug: slugify(String(formData.get("slugEn") || parsed.data.nameEn)),
        description: optionalString(formData.get("descriptionEn")),
        seo_title: optionalString(formData.get("seoTitleEn")),
        seo_description: optionalString(formData.get("seoDescriptionEn")),
      },
    ],
    { onConflict: "series_id,locale" },
  );
  if (error) return { error: error.message };

  revalidatePath("/admin/series");
  revalidatePath("/es/blog");
  revalidatePath("/en/blog");
  return { success: "Serie guardada correctamente." };
}

export async function saveTag(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const schema = z.object({
    id: z.union([z.uuid(), z.literal("")]),
    code: z.string().trim().min(2).max(80),
    nameEs: z.string().trim().min(2),
    nameEn: z.string().trim().min(2),
  });
  const parsed = schema.safeParse({
    id: String(formData.get("id") || ""),
    code: formData.get("code"),
    nameEs: formData.get("nameEs"),
    nameEn: formData.get("nameEn"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  let id = parsed.data.id;
  if (id) {
    const { error } = await supabase
      .from("blog_tags")
      .update({ code: slugify(parsed.data.code) })
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("blog_tags")
      .insert({ code: slugify(parsed.data.code) })
      .select("id")
      .single();
    if (error) return { error: error.message };
    id = data.id;
  }
  const { error } = await supabase.from("blog_tag_translations").upsert(
    [
      { tag_id: id, locale: "es", name: parsed.data.nameEs, slug: slugify(String(formData.get("slugEs") || parsed.data.nameEs)) },
      { tag_id: id, locale: "en", name: parsed.data.nameEn, slug: slugify(String(formData.get("slugEn") || parsed.data.nameEn)) },
    ],
    { onConflict: "tag_id,locale" },
  );
  if (error) return { error: error.message };
  revalidatePath("/admin/tags");
  return { success: "Etiqueta guardada correctamente." };
}
