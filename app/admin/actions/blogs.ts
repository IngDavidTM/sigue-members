"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/authorization";
import {
  getReadingTimeMinutes,
  slugify,
  validateSanitizedRichText,
  zonedInputToIso,
} from "@/lib/content/admin-utils";
import {
  blogFormSchema,
  adminDatabaseError,
  formChecked,
  formString,
  zodFieldErrors,
} from "@/lib/content/admin-validation";
import { createClient } from "@/lib/supabase/server";

import type { AdminActionState } from "./types";

type BlogValues = z.infer<typeof blogFormSchema>;

function translationFromValues(values: BlogValues, locale: "es" | "en", contentHtml: string) {
  const suffix = locale === "es" ? "Es" : "En";
  const field = <K extends keyof BlogValues>(name: K) => values[name];
  const title = field(`title${suffix}` as keyof BlogValues) as string;
  return {
    locale,
    title,
    slug: slugify((field(`slug${suffix}` as keyof BlogValues) as string) || title),
    excerpt: (field(`excerpt${suffix}` as keyof BlogValues) as string | undefined) ?? null,
    content_html: contentHtml,
    image_alt: (field(`imageAlt${suffix}` as keyof BlogValues) as string | undefined) ?? null,
    seo_title: (field(`seoTitle${suffix}` as keyof BlogValues) as string | undefined) ?? null,
    seo_description: (field(`seoDescription${suffix}` as keyof BlogValues) as string | undefined) ?? null,
    focus_keyphrase: (field(`focusKeyphrase${suffix}` as keyof BlogValues) as string | undefined) ?? null,
    canonical_url: (field(`canonicalUrl${suffix}` as keyof BlogValues) as string | undefined) ?? null,
    og_title: (field(`ogTitle${suffix}` as keyof BlogValues) as string | undefined) ?? null,
    og_description: (field(`ogDescription${suffix}` as keyof BlogValues) as string | undefined) ?? null,
    og_image_url: (field(`ogImageUrl${suffix}` as keyof BlogValues) as string | undefined) ?? null,
    noindex: false,
    nofollow: false,
    schema_type: field(`schemaType${suffix}` as keyof BlogValues) as "Article" | "BlogPosting" | "NewsArticle",
  };
}

export async function saveBlogPost(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const names = [
    "id", "status", "seriesId", "featuredImageUrl", "publishedAt", "publicationTimezone",
    "authorName", "titleEs", "titleEn", "slugEs", "slugEn", "excerptEs", "excerptEn",
    "contentEs", "contentEn", "imageAltEs", "imageAltEn", "seoTitleEs", "seoTitleEn",
    "seoDescriptionEs", "seoDescriptionEn", "focusKeyphraseEs", "focusKeyphraseEn",
    "canonicalUrlEs", "canonicalUrlEn", "ogTitleEs", "ogTitleEn", "ogDescriptionEs",
    "ogDescriptionEn", "ogImageUrlEs", "ogImageUrlEn", "schemaTypeEs", "schemaTypeEn",
  ];
  const raw = Object.fromEntries(names.map((name) => [name, formString(formData, name)]));
  const parsed = blogFormSchema.safeParse({
    ...raw,
    tagIds: [...new Set(formData.getAll("tagIds").map(String).filter(Boolean))],
  });

  if (!parsed.success) {
    return { error: "No se guardó el blog.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const values = parsed.data;
  try {
    new Intl.DateTimeFormat("en", { timeZone: values.publicationTimezone });
  } catch {
    return { error: "No se guardó el blog.", fieldErrors: { publicationTimezone: ["La zona horaria de publicación no es válida."] } };
  }

  const slugEs = slugify(values.slugEs || values.titleEs);
  const slugEn = slugify(values.slugEn || values.titleEn);
  if (!slugEs || !slugEn) return { error: "No se guardó el blog.", fieldErrors: { slugEs: ["El título o slug en español debe contener letras o números."], slugEn: ["El título o slug en inglés debe contener letras o números."] } };

  const sanitizedEs = validateSanitizedRichText(values.contentEs, "El contenido en español");
  const sanitizedEn = validateSanitizedRichText(values.contentEn, "El contenido en inglés");
  if (sanitizedEs.error || sanitizedEn.error) return {
    error: "No se guardó el blog.",
    fieldErrors: {
      ...(sanitizedEs.error ? { contentEs: [sanitizedEs.error] } : {}),
      ...(sanitizedEn.error ? { contentEn: [sanitizedEn.error] } : {}),
    },
  };

  let publishedAt: string | null = null;
  try {
    publishedAt = values.publishedAt ? zonedInputToIso(values.publishedAt, values.publicationTimezone) : values.status === "published" ? new Date().toISOString() : null;
  } catch {
    return { error: "No se guardó el blog.", fieldErrors: { publishedAt: ["La fecha de publicación no tiene un formato válido."] } };
  }
  if (values.status === "scheduled" && publishedAt && new Date(publishedAt) <= new Date()) {
    return { error: "No se guardó el blog.", fieldErrors: { publishedAt: ["Una publicación programada debe tener una fecha futura."] } };
  }
  if (values.status === "published" && publishedAt && new Date(publishedAt) > new Date()) {
    return { error: "No se guardó el blog.", fieldErrors: { status: ["Usa el estado Programado cuando la fecha de publicación sea futura."] } };
  }

  const supabase = await createClient();
  if (values.seriesId) {
    const { data } = await supabase.from("blog_series").select("id").eq("id", values.seriesId).maybeSingle();
    if (!data) return { error: "No se guardó el blog.", fieldErrors: { seriesId: ["La serie seleccionada ya no existe."] } };
  }
  if (values.tagIds.length) {
    const { data } = await supabase.from("blog_tags").select("id").in("id", values.tagIds);
    if ((data?.length ?? 0) !== values.tagIds.length) return { error: "No se guardó el blog.", fieldErrors: { tagIds: ["Una o más etiquetas ya no existen."] } };
  }
  const [slugEsResult, slugEnResult] = await Promise.all([
    supabase.from("blog_post_translations").select("post_id").eq("locale", "es").eq("slug", slugEs).maybeSingle(),
    supabase.from("blog_post_translations").select("post_id").eq("locale", "en").eq("slug", slugEn).maybeSingle(),
  ]);
  if (slugEsResult.error || slugEnResult.error) return { error: "No se pudo comprobar la disponibilidad de los slugs." };
  if (slugEsResult.data && slugEsResult.data.post_id !== values.id) return { error: "No se guardó el blog.", fieldErrors: { slugEs: ["Este slug ya pertenece a otro blog en español."] } };
  if (slugEnResult.data && slugEnResult.data.post_id !== values.id) return { error: "No se guardó el blog.", fieldErrors: { slugEn: ["Este slug ya pertenece a otro blog en inglés."] } };
  const postData = {
    status: values.status,
    series_id: values.seriesId ?? null,
    featured_image_url: values.featuredImageUrl ?? null,
    author_name: values.authorName,
    is_featured: formChecked(formData, "isFeatured"),
    allow_comments: formChecked(formData, "allowComments"),
    reading_time_minutes: getReadingTimeMinutes(sanitizedEs.html),
    published_at: publishedAt,
    updated_by: admin.id,
  };

  const translations = [
    { ...translationFromValues({ ...values, slugEs }, "es", sanitizedEs.html), noindex: formChecked(formData, "noindexEs"), nofollow: formChecked(formData, "nofollowEs") },
    { ...translationFromValues({ ...values, slugEn }, "en", sanitizedEn.html), noindex: formChecked(formData, "noindexEn"), nofollow: formChecked(formData, "nofollowEn") },
  ];
  const expected = formString(formData, "expectedUpdatedAt");
  if (values.id && !z.iso.datetime({ offset: true }).safeParse(expected).success) {
    return { error: "Recarga la página antes de guardar; falta la versión del contenido." };
  }
  const { data: postId, error: saveError } = await supabase.rpc("save_blog_content", {
    p_id: values.id ?? null,
    p_record: postData,
    p_translations: translations,
    p_expected_updated_at: expected || null,
    p_tag_ids: values.tagIds,
  });
  if (saveError || !postId) return { error: adminDatabaseError(saveError ?? {}, "el blog") };

  revalidatePath("/admin/blogs");
  revalidatePath("/[locale]/blog/[slug]", "page");
  revalidatePath("/es/blog");
  revalidatePath("/en/blog");
  revalidatePath("/es/category", "layout");
  revalidatePath("/en/category", "layout");
  revalidatePath("/es/tag", "layout");
  revalidatePath("/en/tag", "layout");
  revalidatePath("/sitemap.xml");
  redirect(`/admin/blogs/${postId}?saved=1`);
}

export async function archiveBlogPost(formData: FormData) {
  await requireAdmin();
  const parsed = z.uuid().safeParse(formData.get("id"));
  if (!parsed.success) return;
  const id = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blogs");
  revalidatePath("/[locale]/blog/[slug]", "page");
  revalidatePath("/es/blog");
  revalidatePath("/en/blog");
  revalidatePath("/es/category", "layout");
  revalidatePath("/en/category", "layout");
  revalidatePath("/es/tag", "layout");
  revalidatePath("/en/tag", "layout");
  revalidatePath("/sitemap.xml");
}
