import Link from "next/link";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import styles from "../content.module.css";

export const metadata = { title: "Formularios" };

export default async function AdminFormsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const forms = await supabase.from("dynamic_forms").select("*").order("updated_at", { ascending: false });
  if (forms.error) throw new Error(forms.error.message);
  const countRows = await Promise.all(forms.data.map(async (form) => {
    const [total, unread] = await Promise.all([
      supabase.from("dynamic_form_submissions").select("id", { count: "exact", head: true }).eq("form_id", form.id),
      supabase.from("dynamic_form_submissions").select("id", { count: "exact", head: true }).eq("form_id", form.id).eq("status", "new"),
    ]);
    if (total.error || unread.error) throw new Error(total.error?.message ?? unread.error?.message);
    return [form.id, { total: total.count ?? 0, unread: unread.count ?? 0 }] as const;
  }));
  const counts = new Map(countRows);
  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Captación de información</span><h1>Formularios</h1><p>Configura preguntas y textos sin modificar código.</p></div><Link className={styles.primaryLink} href="/admin/formularios/nuevo"><Plus size={17} /> Nuevo formulario</Link></header>
    {forms.data.length ? <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Formulario</th><th>Estado</th><th>Respuestas</th><th>Actualizado</th><th></th></tr></thead><tbody>{forms.data.map((form) => <tr key={form.id}><td><strong>{form.name}</strong><small>/{form.slug}</small></td><td><span className={styles.status} data-status={form.status}>{form.status}</span></td><td>{counts.get(form.id)?.total ?? 0}<small>{counts.get(form.id)?.unread ? ` · ${counts.get(form.id)?.unread} nuevas` : ""}</small></td><td>{new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(new Date(form.updated_at))}</td><td><Link href={`/admin/formularios/${form.id}`}>Editar</Link></td></tr>)}</tbody></table></div> : <div className={styles.empty}><h2>Aún no hay formularios</h2><p>Crea el primero y publícalo cuando esté listo.</p></div>}
  </div>;
}
