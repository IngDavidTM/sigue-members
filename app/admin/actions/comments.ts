"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

export async function moderateComment(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = z
    .object({
      id: z.uuid(),
      status: z.enum(["pending", "approved", "spam", "rejected"]),
    })
    .safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_comments")
    .update({
      status: parsed.data.status,
      moderated_by: admin.id,
      moderated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/comentarios");
  revalidatePath("/es/blog", "layout");
  revalidatePath("/en/blog", "layout");
}
