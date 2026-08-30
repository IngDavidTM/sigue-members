import Link from "next/link";

import { EventForm } from "@/app/admin/components/EventForm";
import { getEventOptions } from "@/lib/content/admin-queries";

import styles from "../../content.module.css";

export const metadata = { title: "Nuevo evento" };

export default async function NewEventPage() {
  const venues = await getEventOptions();
  return <div className={styles.page}><header className={styles.pageHeader}><div><span className={styles.eyebrow}>Nuevo contenido</span><h1>Crear evento</h1><p>La duración es libre: desde minutos hasta varios días.</p></div><Link className={styles.secondaryLink} href="/admin/eventos">Volver</Link></header><EventForm venues={venues} /></div>;
}
