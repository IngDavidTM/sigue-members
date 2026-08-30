import Link from "next/link";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";

import styles from "../content.module.css";

export const metadata = { title: "Eventos" };

export default async function AdminEventsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [eventsResult, translationsResult] = await Promise.all([
    supabase.from("events").select("*").order("starts_at", { ascending: false }),
    supabase.from("event_translations").select("event_id,title,slug,locale").eq("locale", "es"),
  ]);
  if (eventsResult.error) throw new Error(eventsResult.error.message);
  if (translationsResult.error) throw new Error(translationsResult.error.message);
  const translations = new Map(translationsResult.data.map((item) => [item.event_id, item]));
  return <div className={styles.page}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Agenda SIGUE</span><h1>Eventos</h1><p>Gestiona próximos eventos, históricos, modalidad, duración y registro.</p></div><Link className={styles.primaryLink} href="/admin/eventos/nuevo"><Plus size={17} /> Nuevo evento</Link></header>
    {eventsResult.data.length ? <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Evento</th><th>Estado</th><th>Modalidad</th><th>Inicio</th><th></th></tr></thead><tbody>{eventsResult.data.map((event) => {
      const translation = translations.get(event.id);
      return <tr key={event.id}><td><strong>{translation?.title ?? "Sin traducción en español"}</strong><small>/{translation?.slug ?? "—"}</small></td><td><span className={styles.status} data-status={event.status}>{event.status}</span></td><td>{event.attendance_mode.replace("_", " ")}</td><td>{new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short", timeZone: event.timezone }).format(new Date(event.starts_at))}</td><td><Link href={`/admin/eventos/${event.id}`}>Editar</Link></td></tr>;
    })}</tbody></table></div> : <div className={styles.empty}><h2>Aún no hay eventos</h2><p>Crea el primer evento y elige cuándo publicarlo.</p><Link className={styles.primaryLink} href="/admin/eventos/nuevo">Crear evento</Link></div>}
  </div>;
}
