import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

import type { PublicDynamicForm } from "@/types/supabase";

// Only the columns a visitor needs. The form row also holds staff inboxes
// (notification_emails), reply-to settings and admin user IDs, which must not
// reach public pages.
const PUBLIC_FORM_COLUMNS = "id,slug,title_es,title_en,description_es,description_en,submit_label_es,submit_label_en";

export const getPublishedDynamicForm = cache(async (slug: string): Promise<PublicDynamicForm | null> => {
  const supabase = await createClient();
  const formResult = await supabase
    .from("dynamic_forms")
    .select(PUBLIC_FORM_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (formResult.error) throw new Error(formResult.error.message);
  if (!formResult.data) return null;

  const fieldsResult = await supabase
    .from("dynamic_form_fields")
    .select("*")
    .eq("form_id", formResult.data.id)
    .order("sort_order")
    .order("created_at");
  if (fieldsResult.error) throw new Error(fieldsResult.error.message);
  return { form: formResult.data, fields: fieldsResult.data };
});
