"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export type CommentActionState = { error?: string; success?: string };

export async function submitComment(
  _previous: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  if (String(formData.get("company") || "")) return { success: "Comentario recibido." };
  const parsed = z.object({
    postId: z.uuid(),
    slug: z.string().min(1),
    locale: z.enum(["es", "en"]),
    authorName: z.string().trim().min(2).max(100),
    authorEmail: z.email().trim().toLowerCase(),
    authorWebsite: z.union([z.url(), z.literal("")]),
    content: z.string().trim().min(2).max(4000),
    parentId: z.union([z.uuid(), z.literal("")]),
  }).safeParse({
    postId: formData.get("postId"),
    slug: formData.get("slug"),
    locale: formData.get("locale"),
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    authorWebsite: String(formData.get("authorWebsite") || ""),
    content: formData.get("content"),
    parentId: String(formData.get("parentId") || ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_blog_comment", {
    p_post_id: parsed.data.postId,
    p_parent_id: parsed.data.parentId || null,
    p_locale: parsed.data.locale,
    p_author_name: parsed.data.authorName,
    p_author_email: parsed.data.authorEmail,
    p_author_website: parsed.data.authorWebsite || null,
    p_content: parsed.data.content,
  });
  if (error) {
    const rateLimited = error.message.toLowerCase().includes("rate limit");
    return { error: rateLimited ? (parsed.data.locale === "es" ? "Espera unos minutos antes de comentar de nuevo." : "Please wait a few minutes before commenting again.") : error.message };
  }
  revalidatePath(`/${parsed.data.locale}/blog/${parsed.data.slug}`);
  return { success: parsed.data.locale === "es" ? "Tu comentario quedó pendiente de moderación." : "Your comment is awaiting moderation." };
}
