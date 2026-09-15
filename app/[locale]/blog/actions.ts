"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export type CommentActionState = { error?: string; success?: string };

export async function submitComment(
  _previous: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const locale = formData.get("locale") === "en" ? "en" : "es";
  const es = locale === "es";
  if (String(formData.get("company") || "")) return { success: es ? "Comentario recibido." : "Comment received." };
  const parsed = z.object({
    postId: z.uuid(es ? "La publicación no es válida." : "The post is invalid."),
    slug: z.string().min(1, es ? "La publicación no es válida." : "The post is invalid."),
    locale: z.enum(["es", "en"], es ? "El idioma no es válido." : "The language is invalid."),
    authorName: z.string().trim().min(2, es ? "Escribe tu nombre." : "Enter your name.").max(100, es ? "El nombre es demasiado largo." : "The name is too long."),
    authorEmail: z.email(es ? "Escribe un correo válido." : "Enter a valid email address.").trim().toLowerCase(),
    authorWebsite: z.union([z.url(es ? "Escribe una URL válida." : "Enter a valid URL."), z.literal("")]),
    content: z.string().trim().min(2, es ? "Escribe tu comentario." : "Enter your comment.").max(4000, es ? "El comentario es demasiado largo." : "The comment is too long."),
    parentId: z.union([z.uuid(es ? "La respuesta no es válida." : "The reply is invalid."), z.literal("")]),
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
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? (es ? "Revisa los datos." : "Check the information.") };

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
    return { error: rateLimited ? (es ? "Espera unos minutos antes de comentar de nuevo." : "Please wait a few minutes before commenting again.") : (es ? "No se pudo enviar el comentario. Intenta nuevamente." : "The comment could not be submitted. Please try again.") };
  }
  revalidatePath(`/${parsed.data.locale}/blog/${parsed.data.slug}`);
  return { success: es ? "Tu comentario quedó pendiente de moderación." : "Your comment is awaiting moderation." };
}
