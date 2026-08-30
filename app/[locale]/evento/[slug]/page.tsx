/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "@/app/components/content/ContentPages.module.css";
import { getPublicEvent } from "@/lib/content/public-queries";
import { absoluteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  const locale = requested === "en" ? "en" : "es";
  const data = await getPublicEvent(locale, slug);
  if (!data) return {};
  const { event, translation, alternateTranslations } = data;
  const title = translation.seo_title || translation.title;
  const description = translation.seo_description || translation.excerpt || "SIGUE Network";
  const image = translation.og_image_url || event.featured_image_url;
  return {
    title,
    description,
    alternates: {
      canonical: translation.canonical_url || absoluteUrl(`/${locale}/evento/${translation.slug}`),
      languages: Object.fromEntries(
        alternateTranslations.map((item) => [item.locale, absoluteUrl(`/${item.locale}/evento/${item.slug}`)]),
      ),
    },
    robots: { index: !translation.noindex, follow: !translation.nofollow },
    openGraph: { type: "website", title: translation.og_title || title, description: translation.og_description || description, url: absoluteUrl(`/${locale}/evento/${translation.slug}`), images: image ? [{ url: image }] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function EventPage({ params }: Props) {
  const { locale: requested, slug } = await params;
  const locale = requested === "en" ? "en" : "es";
  const es = locale === "es";
  const data = await getPublicEvent(locale, slug);
  if (!data) notFound();
  const { event, translation, venue, virtualUrl, upcoming } = data;
  const eventUrl = absoluteUrl(`/${locale}/evento/${translation.slug}`);
  const location = event.attendance_mode === "virtual"
    ? { "@type": "VirtualLocation", url: virtualUrl || eventUrl }
    : { "@type": "Place", name: venue?.name, address: venue ? { "@type": "PostalAddress", streetAddress: [venue.address_line_1, venue.address_line_2].filter(Boolean).join(", "), addressLocality: venue.city, addressRegion: venue.region, addressCountry: venue.country, postalCode: venue.postal_code } : undefined };
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: translation.title,
    description: translation.seo_description || translation.excerpt,
    image: translation.og_image_url || event.featured_image_url,
    startDate: event.starts_at,
    endDate: event.ends_at,
    eventStatus: event.status === "cancelled" ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
    eventAttendanceMode: event.attendance_mode === "virtual" ? "https://schema.org/OnlineEventAttendanceMode" : event.attendance_mode === "hybrid" ? "https://schema.org/MixedEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    location,
    organizer: { "@type": "Organization", name: event.organizer_name || "SIGUE Network", url: absoluteUrl(`/${locale}`) },
    offers: event.registration_url ? { "@type": "Offer", url: event.registration_url, price: event.is_free ? 0 : event.price_amount, priceCurrency: event.currency, availability: "https://schema.org/InStock" } : undefined,
    inLanguage: locale,
    url: eventUrl,
  };
  const start = new Date(event.starts_at);
  const end = new Date(event.ends_at);
  const modeLabel = event.attendance_mode === "virtual" ? (es ? "Virtual" : "Online") : event.attendance_mode === "hybrid" ? (es ? "Híbrido" : "Hybrid") : (es ? "Presencial" : "In person");
  return <article className={styles.root}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <header className={styles.articleHeader}><div className={styles.breadcrumbs}><Link href={`/${locale}`}>{es ? "Inicio" : "Home"}</Link> · <Link href={`/${locale}/eventos`}>{es ? "Eventos" : "Events"}</Link></div><h1>{translation.title}</h1>{translation.excerpt ? <p>{translation.excerpt}</p> : null}</header>
    <div className={styles.articleLayout}>
      <main>
        {event.featured_image_url ? <img className={styles.featured} src={event.featured_image_url} alt={translation.image_alt || translation.title} /> : null}
        <div className={styles.richText} dangerouslySetInnerHTML={{ __html: translation.content_html }} />
        {translation.agenda_html ? <><h2 className={styles.sectionHeading}>{es ? "Agenda" : "Schedule"}</h2><div className={styles.richText} dangerouslySetInnerHTML={{ __html: translation.agenda_html }} /></> : null}
        <div className={styles.share}><strong>{es ? "Compartir:" : "Share:"}</strong><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`} target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:?subject=${encodeURIComponent(translation.title)}&body=${encodeURIComponent(eventUrl)}`}>Email</a></div>
      </main>
      <aside className={styles.sidebar}>
        <section className={styles.eventFacts}>
          <div><span>{es ? "Comienza" : "Starts"}</span><strong>{new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: event.all_day ? undefined : "short", timeZone: event.timezone }).format(start)}</strong></div>
          <div><span>{es ? "Termina" : "Ends"}</span><strong>{new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: event.all_day ? undefined : "short", timeZone: event.timezone }).format(end)}</strong></div>
          <div><span>{es ? "Modalidad" : "Format"}</span><strong>{modeLabel}</strong></div>
          {venue ? <div><span>{es ? "Lugar" : "Venue"}</span><strong>{venue.name}{venue.city ? ` · ${venue.city}` : ""}</strong></div> : null}
          {event.capacity ? <div><span>{es ? "Cupo" : "Capacity"}</span><strong>{event.capacity}</strong></div> : null}
          <div><span>{es ? "Inversión" : "Price"}</span><strong>{event.is_free ? (es ? "Sin costo" : "Free") : new Intl.NumberFormat(locale, { style: "currency", currency: event.currency }).format(event.price_amount ?? 0)}</strong></div>
        </section>
        {event.registration_url ? <a className={styles.eventButton} href={event.registration_url} target="_blank" rel="noreferrer">{es ? "Inscribirme" : "Register"}</a> : null}
        {virtualUrl ? <a className={styles.eventButton} href={virtualUrl} target="_blank" rel="noreferrer">{es ? "Entrar al evento" : "Join event"}</a> : null}
        {upcoming.length ? <section className={styles.sideBlock}><h2>{es ? "Otros eventos" : "Other events"}</h2><ul>{upcoming.map((item) => <li key={item.event.id}><Link href={`/${locale}/evento/${item.translation.slug}`}>{item.translation.title}</Link></li>)}</ul></section> : null}
      </aside>
    </div>
  </article>;
}
