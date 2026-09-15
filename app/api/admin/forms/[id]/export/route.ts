import { NextResponse } from "next/server";

import { getAuthenticatedProfile } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import type { DynamicFormSubmissionRow } from "@/types/supabase";

function csv(value: unknown) {
  const raw = String(value ?? "");
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replaceAll('"', '""')}"`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getAuthenticatedProfile();
  if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params; const supabase = await createClient();
  const [form, fields] = await Promise.all([
    supabase.from("dynamic_forms").select("name,slug").eq("id", id).maybeSingle(),
    supabase.from("dynamic_form_fields").select("field_key,label_es").eq("form_id", id).order("sort_order"),
  ]);
  if (form.error || fields.error) return NextResponse.json({ error: "Unable to export" }, { status: 500 });
  if (!form.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const submissions: DynamicFormSubmissionRow[] = [];
  for (let from = 0; ; from += 1000) {
    const batch = await supabase.from("dynamic_form_submissions").select("*").eq("form_id", id).order("created_at", { ascending: false }).range(from, from + 999);
    if (batch.error) return NextResponse.json({ error: "Unable to export" }, { status: 500 });
    submissions.push(...batch.data);
    if (batch.data.length < 1000) break;
  }
  const header = ["id", "fecha", "estado", "idioma", "origen", ...fields.data.map((field) => field.label_es), "notas"];
  const rows = submissions.map((item) => { const answers = item.answers && !Array.isArray(item.answers) && typeof item.answers === "object" ? item.answers : {}; return [item.id, item.created_at, item.status, item.locale, item.source_path ?? "", ...fields.data.map((field) => { const answer = answers[field.field_key]; return Array.isArray(answer) ? answer.join(" | ") : answer ?? ""; }), item.admin_notes ?? ""]; });
  const body = [header, ...rows].map((row) => row.map(csv).join(",")).join("\r\n");
  return new NextResponse(`\uFEFF${body}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${form.data.slug}-respuestas.csv"`, "cache-control": "private, no-store" } });
}
