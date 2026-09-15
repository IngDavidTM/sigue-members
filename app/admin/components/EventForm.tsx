import { saveEvent } from "@/app/admin/actions/events";
import { isoToZonedInput } from "@/lib/content/admin-utils";
import type { EventRow, EventTranslationRow, EventVenueRow } from "@/types/supabase";

import contentStyles from "../content.module.css";
import { ActionForm } from "./ActionForm";
import { MediaField } from "./MediaField";
import { RichTextEditor } from "./RichTextEditor";
import { SeoAssistant } from "./SeoAssistant";

type Props = { event?: EventRow; translations?: EventTranslationRow[]; venues: EventVenueRow[]; virtualUrl?: string | null; organizerEmail?: string | null };

function LocaleFields({ locale, translation }: { locale: "es" | "en"; translation?: EventTranslationRow }) {
  const suffix = locale === "es" ? "Es" : "En";
  return <section className={`${contentStyles.card} ${contentStyles.localeCard}`} data-locale={locale}>
    <div className={contentStyles.localeHeading}><h2>{locale === "es" ? "Español" : "English"}</h2><span>{locale.toUpperCase()}</span></div>
    <div className={contentStyles.fields2}>
      <label className={contentStyles.field}><span>Título *</span><input name={`title${suffix}`} required defaultValue={translation?.title ?? ""} /></label>
      <label className={contentStyles.field}><span>Slug</span><input name={`slug${suffix}`} defaultValue={translation?.slug ?? ""} /></label>
    </div>
    <label className={contentStyles.field}><span>Resumen</span><textarea name={`excerpt${suffix}`} defaultValue={translation?.excerpt ?? ""} maxLength={500} /></label>
    <RichTextEditor name={`content${suffix}`} label="Descripción completa *" initialContent={translation?.content_html} />
    <RichTextEditor name={`agenda${suffix}`} label="Agenda (opcional)" initialContent={translation?.agenda_html} placeholder="Horarios, sesiones y actividades…" />
    <label className={contentStyles.field}><span>Texto alternativo de la imagen</span><input name={`imageAlt${suffix}`} defaultValue={translation?.image_alt ?? ""} /></label>
    <details className={contentStyles.seoDetails}>
      <summary>SEO y datos para buscadores</summary>
      <div>
        <div className={contentStyles.fields2}>
          <label className={contentStyles.field}><span>Título SEO (máx. 60)</span><input name={`seoTitle${suffix}`} defaultValue={translation?.seo_title ?? ""} maxLength={60} /></label>
          <label className={contentStyles.field}><span>Frase clave</span><input name={`focusKeyphrase${suffix}`} defaultValue={translation?.focus_keyphrase ?? ""} maxLength={100} /></label>
        </div>
        <label className={contentStyles.field}><span>Descripción SEO (máx. 160)</span><textarea name={`seoDescription${suffix}`} defaultValue={translation?.seo_description ?? ""} maxLength={160} /></label>
        <label className={contentStyles.field}><span>URL canónica</span><input type="url" name={`canonicalUrl${suffix}`} defaultValue={translation?.canonical_url ?? ""} /></label>
        <div className={contentStyles.fields2}>
          <label className={contentStyles.field}><span>Título para redes</span><input name={`ogTitle${suffix}`} maxLength={60} defaultValue={translation?.og_title ?? ""} /></label>
          <MediaField name={`ogImageUrl${suffix}`} label="Imagen para redes (opcional)" initialValue={translation?.og_image_url} />
        </div>
        <label className={contentStyles.field}><span>Descripción para redes</span><textarea name={`ogDescription${suffix}`} maxLength={200} defaultValue={translation?.og_description ?? ""} /></label>
        <label className={contentStyles.checkbox}><input type="checkbox" name={`noindex${suffix}`} defaultChecked={translation?.noindex} /> No indexar esta versión</label>
        <label className={contentStyles.checkbox}><input type="checkbox" name={`nofollow${suffix}`} defaultChecked={translation?.nofollow} /> No seguir enlaces</label>
        <SeoAssistant suffix={suffix} />
      </div>
    </details>
  </section>;
}

const timezones = ["America/Bogota", "America/Guayaquil", "America/Lima", "America/Mexico_City", "America/Santiago", "America/New_York", "UTC"];

export function EventForm({ event, translations = [], venues, virtualUrl, organizerEmail }: Props) {
  const timezone = event?.timezone ?? "America/Bogota";
  const es = translations.find((item) => item.locale === "es");
  const en = translations.find((item) => item.locale === "en");
  return <ActionForm action={saveEvent} className={contentStyles.form} submitLabel={event ? "Actualizar evento" : "Crear evento"}>
    <input type="hidden" name="id" value={event?.id ?? ""} />
      <input type="hidden" name="expectedUpdatedAt" value={event?.updated_at ?? ""} />
    <input type="hidden" name="existingPublishedAt" value={event?.published_at ?? ""} />
    <div className={contentStyles.mainColumn}>
      <LocaleFields locale="es" translation={es} />
      <LocaleFields locale="en" translation={en} />
    </div>
    <aside className={contentStyles.sideColumn}>
      <section className={contentStyles.card}>
        <h3>Estado y fecha</h3>
        <div className={contentStyles.fields}>
          <label className={contentStyles.field}><span>Estado</span><select name="status" defaultValue={event?.status ?? "draft"}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="cancelled">Cancelado</option><option value="archived">Archivado</option></select></label>
          <label className={contentStyles.field}><span>Zona horaria</span><select name="timezone" defaultValue={timezone}>{timezones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}</select></label>
          <label className={contentStyles.field}><span>Comienza *</span><input type="datetime-local" name="startsAt" required defaultValue={isoToZonedInput(event?.starts_at ?? null, timezone)} /></label>
          <label className={contentStyles.field}><span>Termina *</span><input type="datetime-local" name="endsAt" required defaultValue={isoToZonedInput(event?.ends_at ?? null, timezone)} /></label>
          <label className={contentStyles.field}><span>Fecha de publicación</span><input type="datetime-local" name="publishedAt" defaultValue={isoToZonedInput(event?.published_at ?? null, timezone)} /></label>
          <label className={contentStyles.checkbox}><input type="checkbox" name="allDay" defaultChecked={event?.all_day} /> Evento de todo el día</label>
          <label className={contentStyles.checkbox}><input type="checkbox" name="isFeatured" defaultChecked={event?.is_featured} /> Destacar evento</label>
        </div>
      </section>
      <section className={contentStyles.card}>
        <h3>Modalidad y registro</h3>
        <div className={contentStyles.fields}>
          <label className={contentStyles.field}><span>Modalidad</span><select name="attendanceMode" defaultValue={event?.attendance_mode ?? "virtual"}><option value="virtual">Virtual</option><option value="in_person">Presencial</option><option value="hybrid">Híbrido</option></select></label>
          <label className={contentStyles.field}><span>Sede</span><select name="venueId" defaultValue={event?.venue_id ?? ""}><option value="">Sin sede</option>{venues.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}{venue.city ? ` · ${venue.city}` : ""}</option>)}</select></label>
          <label className={contentStyles.field}><span>Enlace virtual</span><input type="url" name="virtualUrl" defaultValue={virtualUrl ?? ""} /></label>
          <label className={contentStyles.checkbox}><input type="checkbox" name="showVirtualUrl" defaultChecked={event?.show_virtual_url} /> Mostrar enlace públicamente</label>
          <label className={contentStyles.field}><span>Enlace de inscripción</span><input type="url" name="registrationUrl" defaultValue={event?.registration_url ?? ""} /></label>
          <label className={contentStyles.field}><span>Cierre de inscripción</span><input type="datetime-local" name="registrationDeadline" defaultValue={isoToZonedInput(event?.registration_deadline ?? null, timezone)} /></label>
          <label className={contentStyles.field}><span>Cupo</span><input type="number" min="1" name="capacity" defaultValue={event?.capacity ?? ""} /></label>
        </div>
      </section>
      <section className={contentStyles.card}>
        <h3>Precio y organizador</h3>
        <div className={contentStyles.fields}>
          <label className={contentStyles.checkbox}><input type="checkbox" name="isFree" defaultChecked={event?.is_free ?? true} /> Evento gratuito</label>
          <div className={contentStyles.fields2}>
            <label className={contentStyles.field}><span>Precio</span><input type="number" min="0" step="0.01" name="priceAmount" defaultValue={event?.price_amount ?? ""} /></label>
            <label className={contentStyles.field}><span>Moneda</span><input name="currency" maxLength={3} defaultValue={event?.currency ?? "USD"} /></label>
          </div>
          <label className={contentStyles.field}><span>Organizador</span><input name="organizerName" defaultValue={event?.organizer_name ?? "SIGUE Network"} /></label>
          <label className={contentStyles.field}><span>Email del organizador</span><input type="email" name="organizerEmail" defaultValue={organizerEmail ?? ""} /></label>
        </div>
      </section>
      <section className={contentStyles.card}><MediaField name="featuredImageUrl" label="Imagen destacada" initialValue={event?.featured_image_url} /></section>
    </aside>
  </ActionForm>;
}
