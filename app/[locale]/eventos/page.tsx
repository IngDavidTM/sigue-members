/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/app/components/content/ContentPages.module.css";
import type { PublicEventCard } from "@/lib/content/public-queries";
import { getPublicEventGroups } from "@/lib/content/public-queries";
import { absoluteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = requested === "en" ? "en" : "es";
  const es = locale === "es";
  const title = es ? "Eventos | SIGUE Network" : "Events | SIGUE Network";
  const description = es
    ? "Encuentros, talleres y espacios de conexión para líderes y organizaciones de impacto."
    : "Gatherings, workshops, and connection spaces for impact leaders and organizations.";
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/${locale}/eventos`), languages: { es: absoluteUrl("/es/eventos"), en: absoluteUrl("/en/eventos") } },
    openGraph: { title, description, type: "website", url: absoluteUrl(`/${locale}/eventos`) },
  };
}

function EventCard({ item, locale }: { item: PublicEventCard; locale: "es" | "en" }) {
  const { event, translation, venue } = item;
  const date = new Date(event.starts_at);
  const mode = event.attendance_mode === "virtual" ? (locale === "es" ? "Virtual" : "Online") : event.attendance_mode === "hybrid" ? (locale === "es" ? "Híbrido" : "Hybrid") : (locale === "es" ? "Presencial" : "In person");
  return <article className={styles.eventCard}>
    <div className={styles.dateBadge}><span><strong>{new Intl.DateTimeFormat(locale, { day: "2-digit", timeZone: event.timezone }).format(date)}</strong>{new Intl.DateTimeFormat(locale, { month: "short", timeZone: event.timezone }).format(date)}</span></div>
    <Link className={styles.cardImage} href={`/${locale}/evento/${translation.slug}`}>{event.featured_image_url ? <img src={event.featured_image_url} alt={translation.image_alt || translation.title} /> : <span className={styles.imagePlaceholder}>SIGUE</span>}</Link>
    <div className={styles.eventBody}><span className={styles.eyebrow}>{event.status === "cancelled" ? (locale === "es" ? "Cancelado" : "Cancelled") : mode}</span><h3><Link href={`/${locale}/evento/${translation.slug}`}>{translation.title}</Link></h3><p>{new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: event.all_day ? undefined : "short", timeZone: event.timezone }).format(date)}</p><p>{venue ? `${venue.name}${venue.city ? ` · ${venue.city}` : ""}` : mode}</p></div>
  </article>;
}

export default async function EventsPage({ params }: Props) {
  const { locale: requested } = await params;
  const locale = requested === "en" ? "en" : "es";
  const es = locale === "es";
  const { upcoming, past } = await getPublicEventGroups(locale);
  const heroStyle = { "--hero-image": "url(/images/events.png)" } as CSSProperties;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: es ? "Eventos SIGUE Network" : "SIGUE Network Events",
    url: absoluteUrl(`/${locale}/eventos`),
    inLanguage: locale,
  };
  return <div className={styles.root}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <section className={styles.hero} style={heroStyle}><div><span>{es ? "Conectar · aprender · servir" : "Connect · learn · serve"}</span><h1>{es ? "Eventos" : "Events"}</h1><p>{es ? "Espacios de formación y conexión que convierten ideas en acciones de impacto." : "Learning and connection spaces that turn ideas into impact."}</p></div></section>
    <div className={styles.container}>
      <section className={styles.eventSection}><h2 className={styles.sectionHeading}>{es ? "Próximos eventos" : "Upcoming events"}</h2>{upcoming.length ? <div className={styles.eventGrid}>{upcoming.map((item) => <EventCard key={item.event.id} item={item} locale={locale} />)}</div> : <div className={styles.empty}><h2>{es ? "Nuevas fechas próximamente" : "New dates coming soon"}</h2><p>{es ? "Vuelve pronto para conocer nuestra agenda." : "Check back soon for our schedule."}</p></div>}</section>
      {past.length ? <section className={styles.eventSection}><h2 className={styles.sectionHeading}>{es ? "Eventos pasados" : "Past events"}</h2><div className={styles.eventGrid}>{past.map((item) => <EventCard key={item.event.id} item={item} locale={locale} />)}</div></section> : null}
    </div>
  </div>;
}
