import Link from "next/link";
import { notFound } from "next/navigation";

import { archiveEvent } from "@/app/admin/actions/events";
import { EventForm } from "@/app/admin/components/EventForm";
import { getAdminEvent, getEventOptions } from "@/lib/content/admin-queries";

import styles from "../../content.module.css";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditEventPage({ params, searchParams }: Props) {
  const { id } = await params;
  const [{ event, translations, virtualUrl, organizerEmail }, venues, query] = await Promise.all([getAdminEvent(id), getEventOptions(), searchParams]);
  if (!event) notFound();
  const title = translations.find((item) => item.locale === "es")?.title ?? "Editar evento";
  return <div className={styles.page}><header className={styles.pageHeader}><div><span className={styles.eyebrow}>Editar evento</span><h1>{title}</h1><p>Actualiza fechas, modalidad, lugar, registro y versiones de idioma.</p></div><Link className={styles.secondaryLink} href="/admin/eventos">Volver</Link></header>{query.saved ? <p className={styles.saved}>Cambios guardados correctamente.</p> : null}<EventForm event={event} translations={translations} venues={venues} virtualUrl={virtualUrl} organizerEmail={organizerEmail} /><section className={styles.card} style={{ marginTop: 20 }}><h3>Archivar evento</h3><p>Se retirará de las páginas públicas sin perder la información.</p><form action={archiveEvent}><input type="hidden" name="id" value={event.id} /><button className={styles.dangerButton} type="submit">Archivar evento</button></form></section></div>;
}
