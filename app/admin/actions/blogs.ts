"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/authorization";
import {
  checked,
  getReadingTimeMinutes,
  optionalString,
  sanitizeRichText,
  slugify,
  zonedInputToIso,
} from "@/lib/content/admin-utils";
import { createClient } from "@/lib/supabase/server";
import type { ContentLocale } from "@/types/supabase";

import type { AdminActionState } from "./types";

const postSchema = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  status: z.enum(["draft", "scheduled", "published", "archived"]),
  seriesId: z.union([z.uuid(), z.literal("")]),
  featuredImageUrl: z.union([z.url(), z.literal("")]),
  publishedAt: z.string(),
  titleEs: z.string().trim().min(3, "El título en español es obligatorio."),
  titleEn: z.string().trim().min(3, "El título en inglés es obligatorio."),
  slugEs: z.string().trim(),
  slugEn: z.string().trim(),
  contentEs: z.string(),
  contentEn: z.string(),
});

function translationFromForm(
  formData: FormData,
  locale: ContentLocale,
  title: string,
  slug: string,
  content: string,
) {
  const suffix = locale === "es" ? "Es" : "En";
  return {
    locale,
    title,
    slug: slugify(slug || title),
    excerpt: optionalString(formData.get(`excerpt${suffix}`)),
    content_html: sanitizeRichText(content),
    image_alt: optionalString(formData.get(`imageAlt${suffix}`)),
    seo_title: optionalString(formData.get(`seoTitle${suffix}`)),
    seo_description: optionalString(formData.get(`seoDescription${suffix}`)),
    focus_keyphrase: optionalString(formData.get(`focusKeyphrase${suffix}`)),
    canonical_url: optionalString(formData.get(`canonicalUrl${suffix}`)),
    og_title: optionalString(formData.get(`ogTitle${suffix}`)),
    og_description: optionalString(formData.get(`ogDescription${suffix}`)),
    og_image_url: optionalString(formData.get(`ogImageUrl${suffix}`)),
    noindex: checked(formData.get(`noindex${suffix}`)),
    nofollow: checked(formData.get(`nofollow${suffix}`)),
    schema_type: String(formData.get(`schemaType${suffix}`) || "BlogPosting") as
      | "Article"
      | "BlogPosting"
      | "NewsArticle",
  };
}

export async function saveBlogPost(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = postSchema.safeParse({
    id: String(formData.get("id") || ""),
    status: formData.get("status"),
    seriesId: String(formData.get("seriesId") || ""),
    featuredImageUrl: String(formData.get("featuredImageUrl") || ""),
    publishedAt: String(formData.get("publishedAt") || ""),
    titleEs: formData.get("titleEs"),
    titleEn: formData.get("titleEn"),
    slugEs: String(formData.get("slugEs") || ""),
    slugEn: String(formData.get("slugEn") || ""),
    contentEs: String(formData.get("contentEs") || ""),
    contentEn: String(formData.get("contentEn") || ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los campos del blog." };
  }

  const values = parsed.data;
  if (["published", "scheduled"].includes(values.status) && !values.publishedAt) {
    return { error: "Una publicación publicada o programada necesita fecha y hora." };
  }
  if (!values.contentEs.trim() || !values.contentEn.trim()) {
    return { error: "Escribe el contenido en español y en inglés." };
  }

  const publicationTimezone = String(
    formData.get("publicationTimezone") || "America/Bogota",
  );
  try {
    new Intl.DateTimeFormat("en", { timeZone: publicationTimezone });
  } catch {
    return { error: "La zona horaria de publicación no es válida." };
  }

  const supabase = await createClient();
  const postData = {
    status: values.status,
    series_id: values.seriesId || null,
    featured_image_url: values.featuredImageUrl || null,
    author_name: optionalString(formData.get("authorName")) || "SIGUE Network",
    is_featured: checked(formData.get("isFeatured")),
    allow_comments: checked(formData.get("allowComments")),
    reading_time_minutes: getReadingTimeMinutes(values.contentEs),
    published_at: values.publishedAt
      ? zonedInputToIso(
          values.publishedAt,
          publicationTimezone,
        )
      : null,
    updated_by: admin.id,
  };

  let postId = values.id;
  if (postId) {
    const { error } = await supabase.from("blog_posts").update(postData).eq("id", postId);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({ ...postData, created_by: admin.id })
      .select("id")
      .single();
    if (error) return { error: error.message };
    postId = data.id;
  }

  const translations = [
    translationFromForm(formData, "es", values.titleEs, values.slugEs, values.contentEs),
    translationFromForm(formData, "en", values.titleEn, values.slugEn, values.contentEn),
  ].map((translation) => ({ ...translation, post_id: postId }));
  const { error: translationsError } = await supabase
    .from("blog_post_translations")
    .upsert(translations, { onConflict: "post_id,locale" });
  if (translationsError) return { error: translationsError.message };

  const tagIds = formData.getAll("tagIds").map(String).filter(Boolean);
  const { error: clearTagsError } = await supabase
    .from("blog_post_tags")
    .delete()
    .eq("post_id", postId);
  if (clearTagsError) return { error: clearTagsError.message };
  if (tagIds.length) {
    const { error: tagsError } = await supabase
      .from("blog_post_tags")
      .insert(tagIds.map((tagId) => ({ post_id: postId, tag_id: tagId })));
    if (tagsError) return { error: tagsError.message };
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/es/blog");
  revalidatePath("/en/blog");
  redirect(`/admin/blogs/${postId}?saved=1`);
}

export async function archiveBlogPost(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blogs");
  revalidatePath("/es/blog");
  revalidatePath("/en/blog");
}
