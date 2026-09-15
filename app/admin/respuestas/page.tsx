import Link from "next/link";

import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import styles from "../content.module.css";

export const metadata = { title: "Respuestas" };
const PAGE_SIZE = 100;

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: Promise<{ form?: string; status?: string; page?: string }> }) {
  await requireAdmin(); const filters = await searchParams; const supabase = await createClient();
  const forms = await supabase.from("dynamic_forms").select("id,name,slug").order("name");
  if (forms.error) throw new Error(forms.error.message);
  const currentPage = Math.max(1, Number.parseInt(filters.page ?? "1", 10) || 1);
  let query = supabase.from("dynamic_form_submissions").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (filters.form) query = query.eq("form_id", filters.form);
  const selectedStatus = (["new", "read", "archived", "spam"] as const).find((status) => status === filters.status);
  if (selectedStatus) query = query.eq("status", selectedStatus);
  const submissions = await query.range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);
  if (submissions.error) throw new Error(submissions.error.message);
  const pageCount = Math.max(1, Math.ceil((submissions.count ?? 0) / PAGE_SIZE));
  const pageHref = (page: number) => {
    const query = new URLSearchParams();
    if (filters.form) query.set("form", filters.form);
    if (selectedStatus) query.set("status", selectedStatus);
    query.set("page", String(page));
    return `/admin/respuestas?${query}`;
  };
  const names = new Map(forms.data.map((form) => [form.id, form.name]));
  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Bandeja</span><h1>Respuestas</h1><p>Consulta y organiza la información recibida.</p></div>{filters.form ? <a className={styles.secondaryLink} href={`/api/admin/forms/${filters.form}/export`}>Exportar CSV</a> : null}</header>
    <form className={styles.card} style={{ marginBottom: 18 }}><div className={styles.fields2}><label className={styles.field}><span>Formulario</span><select name="form" defaultValue={filters.form ?? ""}><option value="">Todos</option>{forms.data.map((form) => <option value={form.id} key={form.id}>{form.name}</option>)}</select></label><label className={styles.field}><span>Estado</span><select name="status" defaultValue={filters.status ?? ""}><option value="">Todos</option><option value="new">Nuevas</option><option value="read">Leídas</option><option value="archived">Archivadas</option><option value="spam">Spam</option></select></label></div><button className={styles.smallButton} type="submit" style={{ marginTop: 12, padding: "7px 14px" }}>Filtrar</button></form>
    {submissions.data.length ? <><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Formulario</th><th>Resumen</th><th>Estado</th><th>Fecha</th><th></th></tr></thead><tbody>{submissions.data.map((submission) => { const answers = submission.answers && !Array.isArray(submission.answers) && typeof submission.answers === "object" ? submission.answers : {}; const summary = Object.values(answers).filter((item) => typeof item === "string" && item).slice(0, 2).join(" · "); return <tr key={submission.id}><td><strong>{names.get(submission.form_id) ?? "Formulario"}</strong><small>{submission.locale.toUpperCase()}</small></td><td>{summary.slice(0, 160) || "Respuesta recibida"}</td><td><span className={styles.status} data-status={submission.status}>{submission.status}</span></td><td>{new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short" }).format(new Date(submission.created_at))}</td><td><Link href={`/admin/respuestas/${submission.id}`}>Abrir</Link></td></tr>; })}</tbody></table></div>{pageCount > 1 ? <nav aria-label="Páginas de respuestas" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 18 }}>{currentPage > 1 ? <Link className={styles.secondaryLink} href={pageHref(currentPage - 1)}>Anterior</Link> : null}<span>Página {currentPage} de {pageCount}</span>{currentPage < pageCount ? <Link className={styles.secondaryLink} href={pageHref(currentPage + 1)}>Siguiente</Link> : null}</nav> : null}</> : <div className={styles.empty}><h2>No hay respuestas</h2><p>Los envíos aparecerán aquí.</p></div>}
  </div>;
}
