import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export const getPublishedDynamicForm = cache(async (slug: string) => {
  const supabase = await createClient();
  const formResult = await supabase
    .from("dynamic_forms")
    .select("*")
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
