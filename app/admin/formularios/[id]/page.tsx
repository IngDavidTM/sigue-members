import { notFound } from "next/navigation";

import { archiveDynamicForm, duplicateDynamicForm } from "@/app/admin/actions/forms";
import DynamicFormEditor from "@/app/admin/components/DynamicFormEditor";
import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import styles from "../../content.module.css";

export const metadata = { title: "Editar formulario" };
export default async function EditDynamicFormPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin(); const { id } = await params; const query = await searchParams;
  const supabase = await createClient();
  const [form, fields] = await Promise.all([
    supabase.from("dynamic_forms").select("*").eq("id", id).maybeSingle(),
    supabase.from("dynamic_form_fields").select("*").eq("form_id", id).order("sort_order").order("created_at"),
  ]);
  if (form.error || fields.error) throw new Error(form.error?.message ?? fields.error?.message);
  if (!form.data) notFound();
  return <div className={styles.page}>{query.saved ? <p className={styles.saved}>Formulario guardado correctamente.</p> : null}<header className={styles.pageHeader}><div><span className={styles.eyebrow}>Formularios</span><h1>{form.data.name}</h1><p>Edita preguntas, traducciones y publicación.</p></div></header><DynamicFormEditor form={form.data} initialFields={fields.data} /><section className={styles.card} style={{ marginTop: 20 }}><h3>Acciones</h3><p>Crea una copia en borrador para reutilizar esta configuración o archiva el formulario sin borrar sus respuestas.</p><div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}><form action={duplicateDynamicForm}><input type="hidden" name="id" value={id} /><button className={styles.smallButton} type="submit">Duplicar formulario</button></form><form action={archiveDynamicForm}><input type="hidden" name="id" value={id} /><button className={styles.dangerButton} type="submit">Archivar formulario</button></form></div></section></div>;
}
