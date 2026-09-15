import { notFound } from "next/navigation";

import { retryDynamicFormNotification, updateDynamicSubmission } from "@/app/admin/actions/forms";
import { getFieldOptions } from "@/lib/forms/options";
import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import styles from "../../content.module.css";

export const metadata = { title: "Detalle de respuesta" };
export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const { id } = await params; const supabase = await createClient();
  const submission = await supabase.from("dynamic_form_submissions").select("*").eq("id", id).maybeSingle();
  if (submission.error) throw new Error(submission.error.message); if (!submission.data) notFound();
  const [form, fields, notification] = await Promise.all([supabase.from("dynamic_forms").select("*").eq("id", submission.data.form_id).maybeSingle(), supabase.from("dynamic_form_fields").select("*").eq("form_id", submission.data.form_id).order("sort_order"), supabase.from("dynamic_form_notifications").select("*").eq("submission_id", id).maybeSingle()]);
  if (form.error || fields.error || notification.error) throw new Error(form.error?.message ?? fields.error?.message ?? notification.error?.message); if (!form.data) notFound();
  const answers = submission.data.answers && !Array.isArray(submission.data.answers) && typeof submission.data.answers === "object" ? submission.data.answers : {};
  const showValue = (field: typeof fields.data[number]) => { const raw = answers[field.field_key]; const options = new Map(getFieldOptions(field.options).map((item) => [item.value, item.label_es])); if (Array.isArray(raw)) return raw.map(String).map((item) => options.get(item) ?? item).join(", "); if (typeof raw === "boolean") return raw ? "Sí" : "No"; return String(raw ?? "—"); };
  return <div className={styles.page}><header className={styles.pageHeader}><div><span className={styles.eyebrow}>Respuesta</span><h1>{form.data.name}</h1><p>{new Intl.DateTimeFormat("es-EC", { dateStyle: "long", timeStyle: "short" }).format(new Date(submission.data.created_at))}</p></div></header><div className={styles.form}><div className={styles.mainColumn}><section className={styles.card}><h2>Información enviada</h2><dl style={{ display: "grid", gap: 18 }}>{fields.data.map((field) => <div key={field.id}><dt style={{ color: "#806392", fontSize: ".78rem", fontWeight: 800 }}>{field.label_es}</dt><dd style={{ margin: "4px 0 0", color: "#3e1955", whiteSpace: "pre-wrap" }}>{showValue(field)}</dd></div>)}</dl></section></div><aside className={styles.sideColumn}><form action={updateDynamicSubmission} className={styles.card}><input type="hidden" name="id" value={id} /><h3>Gestión</h3><label className={styles.field}><span>Estado</span><select name="status" defaultValue={submission.data.status}><option value="new">Nueva</option><option value="read">Leída</option><option value="archived">Archivada</option><option value="spam">Spam</option></select></label><label className={styles.field}><span>Notas internas</span><textarea name="notes" defaultValue={submission.data.admin_notes ?? ""} /></label><button className={styles.smallButton} type="submit" style={{ marginTop: 12, padding: "7px 14px" }}>Guardar gestión</button></form>{notification.data ? <section className={styles.card}><h3>Aviso por correo</h3><p><span className={styles.status} data-status={notification.data.status}>{notification.data.status}</span></p><small>{notification.data.recipients.join(", ")}</small>{notification.data.last_error ? <p>{notification.data.last_error}</p> : null}{notification.data.status !== "sent" ? <form action={retryDynamicFormNotification}><input type="hidden" name="submissionId" value={id} /><button className={styles.smallButton} type="submit" style={{ marginTop: 12, padding: "7px 14px" }}>Reintentar aviso</button></form> : null}</section> : null}</aside></div></div>;
}
