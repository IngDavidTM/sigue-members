"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/authorization";
import { slugify } from "@/lib/content/admin-utils";
import { adminDatabaseError, formString, seriesFormSchema, tagFormSchema, zodFieldErrors } from "@/lib/content/admin-validation";
import { createClient } from "@/lib/supabase/server";

import type { AdminActionState } from "./types";

export async function saveSeries(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const names = ["id", "parentId", "code", "nameEs", "nameEn", "slugEs", "slugEn", "descriptionEs", "descriptionEn", "seoTitleEs", "seoTitleEn", "seoDescriptionEs", "seoDescriptionEn", "sortOrder"];
  const parsed = seriesFormSchema.safeParse(Object.fromEntries(names.map((name) => [name, formString(formData, name)])));
  if (!parsed.success) return { error: "No se guardó la serie.", fieldErrors: zodFieldErrors(parsed.error) };
  if (parsed.data.id && parsed.data.id === parsed.data.parentId) {
    return { error: "No se guardó la serie.", fieldErrors: { parentId: ["Una serie no puede ser su propia categoría padre."] } };
  }

  const supabase = await createClient();
  const code = slugify(parsed.data.code);
  const slugEs = slugify(parsed.data.slugEs || parsed.data.nameEs);
  const slugEn = slugify(parsed.data.slugEn || parsed.data.nameEn);
  if (!code || !slugEs || !slugEn) return { error: "No se guardó la serie.", fieldErrors: { code: ["El código, los nombres y los slugs deben contener letras o números."] } };
  if (parsed.data.parentId) {
    const { data: allSeries, error: hierarchyError } = await supabase.from("blog_series").select("id,parent_id");
    if (hierarchyError) return { error: "No se pudo comprobar la jerarquía de series." };
    const byId = new Map((allSeries ?? []).map((item) => [item.id, item.parent_id]));
    if (!byId.has(parsed.data.parentId)) return { error: "No se guardó la serie.", fieldErrors: { parentId: ["La serie padre ya no existe."] } };
    let cursor: string | null = parsed.data.parentId;
    const visited = new Set<string>();
    while (cursor) {
      if (cursor === parsed.data.id || visited.has(cursor)) return { error: "No se guardó la serie.", fieldErrors: { parentId: ["Esta relación crearía un ciclo en la jerarquía."] } };
      visited.add(cursor);
      cursor = byId.get(cursor) ?? null;
    }
  }
  const [codeResult, slugEsResult, slugEnResult] = await Promise.all([
    supabase.from("blog_series").select("id").eq("code", code).maybeSingle(),
    supabase.from("blog_series_translations").select("series_id").eq("locale", "es").eq("slug", slugEs).maybeSingle(),
    supabase.from("blog_series_translations").select("series_id").eq("locale", "en").eq("slug", slugEn).maybeSingle(),
  ]);
  if (codeResult.error || slugEsResult.error || slugEnResult.error) return { error: "No se pudo comprobar la disponibilidad del código y los slugs." };
  if (codeResult.data && codeResult.data.id !== parsed.data.id) return { error: "No se guardó la serie.", fieldErrors: { code: ["Este código ya pertenece a otra serie."] } };
  if (slugEsResult.data && slugEsResult.data.series_id !== parsed.data.id) return { error: "No se guardó la serie.", fieldErrors: { slugEs: ["Este slug ya pertenece a otra serie en español."] } };
  if (slugEnResult.data && slugEnResult.data.series_id !== parsed.data.id) return { error: "No se guardó la serie.", fieldErrors: { slugEn: ["Este slug ya pertenece a otra serie en inglés."] } };
  const seriesData = {
    code,
    parent_id: parsed.data.parentId ?? null,
    sort_order: parsed.data.sortOrder,
  };
  let id = parsed.data.id ?? "";
  let created = false;
  if (id) {
    const { error } = await supabase.from("blog_series").update(seriesData).eq("id", id);
    if (error) return { error: adminDatabaseError(error, "la serie") };
  } else {
    const { data, error } = await supabase
      .from("blog_series")
      .insert({ ...seriesData, created_by: admin.id })
      .select("id")
      .single();
    if (error) return { error: adminDatabaseError(error, "la serie") };
    id = data.id;
    created = true;
  }

  const { error } = await supabase.from("blog_series_translations").upsert(
    [
      {
        series_id: id,
        locale: "es",
        name: parsed.data.nameEs,
        slug: slugEs,
        description: parsed.data.descriptionEs ?? null,
        seo_title: parsed.data.seoTitleEs ?? null,
        seo_description: parsed.data.seoDescriptionEs ?? null,
      },
      {
        series_id: id,
        locale: "en",
        name: parsed.data.nameEn,
        slug: slugEn,
        description: parsed.data.descriptionEn ?? null,
        seo_title: parsed.data.seoTitleEn ?? null,
        seo_description: parsed.data.seoDescriptionEn ?? null,
      },
    ],
    { onConflict: "series_id,locale" },
  );
  if (error) {
    if (created) await supabase.from("blog_series").delete().eq("id", id);
    return { error: adminDatabaseError(error, "la traducción de la serie") };
  }

  revalidatePath("/admin/series");
  revalidatePath("/es/blog");
  revalidatePath("/en/blog");
  revalidatePath("/es/category", "layout");
  revalidatePath("/en/category", "layout");
  revalidatePath("/sitemap.xml");
  return { success: "Serie guardada correctamente." };
}

export async function saveTag(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const names = ["id", "code", "nameEs", "nameEn", "slugEs", "slugEn"];
  const parsed = tagFormSchema.safeParse(Object.fromEntries(names.map((name) => [name, formString(formData, name)])));
  if (!parsed.success) return { error: "No se guardó la etiqueta.", fieldErrors: zodFieldErrors(parsed.error) };

  const supabase = await createClient();
  const code = slugify(parsed.data.code);
  const slugEs = slugify(parsed.data.slugEs || parsed.data.nameEs);
  const slugEn = slugify(parsed.data.slugEn || parsed.data.nameEn);
  if (!code || !slugEs || !slugEn) return { error: "No se guardó la etiqueta.", fieldErrors: { code: ["El código, los nombres y los slugs deben contener letras o números."] } };
  const [codeResult, slugEsResult, slugEnResult] = await Promise.all([
    supabase.from("blog_tags").select("id").eq("code", code).maybeSingle(),
    supabase.from("blog_tag_translations").select("tag_id").eq("locale", "es").eq("slug", slugEs).maybeSingle(),
    supabase.from("blog_tag_translations").select("tag_id").eq("locale", "en").eq("slug", slugEn).maybeSingle(),
  ]);
  if (codeResult.error || slugEsResult.error || slugEnResult.error) return { error: "No se pudo comprobar la disponibilidad del código y los slugs." };
  if (codeResult.data && codeResult.data.id !== parsed.data.id) return { error: "No se guardó la etiqueta.", fieldErrors: { code: ["Este código ya pertenece a otra etiqueta."] } };
  if (slugEsResult.data && slugEsResult.data.tag_id !== parsed.data.id) return { error: "No se guardó la etiqueta.", fieldErrors: { slugEs: ["Este slug ya pertenece a otra etiqueta en español."] } };
  if (slugEnResult.data && slugEnResult.data.tag_id !== parsed.data.id) return { error: "No se guardó la etiqueta.", fieldErrors: { slugEn: ["Este slug ya pertenece a otra etiqueta en inglés."] } };
  let id = parsed.data.id ?? "";
  let created = false;
  if (id) {
    const { error } = await supabase
      .from("blog_tags")
      .update({ code })
      .eq("id", id);
    if (error) return { error: adminDatabaseError(error, "la etiqueta") };
  } else {
    const { data, error } = await supabase
      .from("blog_tags")
      .insert({ code })
      .select("id")
      .single();
    if (error) return { error: adminDatabaseError(error, "la etiqueta") };
    id = data.id;
    created = true;
  }
  const { error } = await supabase.from("blog_tag_translations").upsert(
    [
      { tag_id: id, locale: "es", name: parsed.data.nameEs, slug: slugEs },
      { tag_id: id, locale: "en", name: parsed.data.nameEn, slug: slugEn },
    ],
    { onConflict: "tag_id,locale" },
  );
  if (error) {
    if (created) await supabase.from("blog_tags").delete().eq("id", id);
    return { error: adminDatabaseError(error, "la traducción de la etiqueta") };
  }
  revalidatePath("/admin/tags");
  revalidatePath("/es/tag", "layout");
  revalidatePath("/en/tag", "layout");
  revalidatePath("/sitemap.xml");
  return { success: "Etiqueta guardada correctamente." };
}
