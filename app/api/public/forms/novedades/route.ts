import { createClient } from "@supabase/supabase-js";

import type { Database, PublicDynamicForm } from "@/types/supabase";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return new Response(null, { status: 503 });

  const supabase = createClient<Database>(url, key, { auth: { persistSession: false } });
  const formResult = await supabase
    .from("dynamic_forms")
    .select("id,slug,title_es,title_en,description_es,description_en,submit_label_es,submit_label_en")
    .eq("slug", "novedades")
    .eq("status", "published")
    .maybeSingle();
  if (formResult.error) return new Response(null, { status: 503 });
  if (!formResult.data) return new Response(null, { status: 404 });

  const fieldsResult = await supabase
    .from("dynamic_form_fields")
    .select("*")
    .eq("form_id", formResult.data.id)
    .order("sort_order")
    .order("created_at");
  if (fieldsResult.error) return new Response(null, { status: 503 });

  const publishedForm: PublicDynamicForm = { form: formResult.data, fields: fieldsResult.data };
  return Response.json(publishedForm, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60" },
  });
}
