import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import LeadCaptureSection from '@/app/components/forms/LeadCaptureSection';
import type { PublishedDynamicForm } from '@/types/supabase';
import styles from './ToolsLibraryLanding.module.css';
import { getToolAxis, getToolsForAxis, otherGuides, toolAxes, type ToolsLocale } from './toolsLibrary';

const content = {
  es: {
    eyebrow: 'BIBLIOTECA DE HERRAMIENTAS SIGUE',
    title: 'Herramientas para fortalecer tu organización',
    subtitle: 'Plantillas gratuitas y prácticas, una por cada eje de SIGUE, para servir mejor, medir tu impacto, ordenar tu gestión y comunicar con propósito.',
    breadcrumb: 'Herramientas',
    filtersLabel: 'Filtrar herramientas por eje',
    all: 'Todas',
    axisIntro: 'Herramientas del eje',
    download: 'Descargar herramienta gratuita',
    duration: 'Tiempo estimado',
    previewAlt: 'Vista previa de la herramienta',
    format: 'Documento Word editable',
    noTools: 'Pronto publicaremos herramientas para este eje.',
    otherTitle: 'Otras guías y documentos',
    otherDownload: 'Descargar',
    ctaTitle: 'Sigue creciendo con SIGUE Network',
    ctas: [
      { title: 'Recibe una herramienta nueva cada mes', body: 'Suscríbete a nuestras novedades y recibe las próximas herramientas e invitaciones.', label: 'Suscribirme', href: '#novedades' },
      { title: 'Participa en nuestros webinars', body: 'Aprende a aplicar estas herramientas en encuentros en vivo con otros líderes.', label: 'Ver próximos eventos', href: '/eventos' },
      { title: 'Únete a SIGUE Network', body: 'Accede a acompañamiento, comunidad y recursos exclusivos para miembros.', label: 'Conocer la membresía', href: '/miembros-sigue' },
    ],
  },
  en: {
    eyebrow: 'SIGUE TOOLS LIBRARY',
    title: 'Tools to strengthen your organization',
    subtitle: 'Free, practical templates, one for each SIGUE axis, to serve better, measure your impact, organize your management, and communicate with purpose.',
    breadcrumb: 'Tools',
    filtersLabel: 'Filter tools by axis',
    all: 'All',
    axisIntro: 'Tools for the axis',
    download: 'Download free tool',
    duration: 'Estimated time',
    previewAlt: 'Tool preview',
    format: 'Editable Word document',
    noTools: 'Tools for this axis are coming soon.',
    otherTitle: 'Other guides and documents',
    otherDownload: 'Download',
    ctaTitle: 'Keep growing with SIGUE Network',
    ctas: [
      { title: 'Get a new tool every month', body: 'Subscribe to our updates to receive upcoming tools and invitations.', label: 'Subscribe', href: '#novedades' },
      { title: 'Join our webinars', body: 'Learn to apply these tools in live sessions with other leaders.', label: 'See upcoming events', href: '/eventos' },
      { title: 'Join SIGUE Network', body: 'Get support, community, and member-only resources.', label: 'Explore membership', href: '/miembros-sigue' },
    ],
  },
} as const;

export default function ToolsLibraryLanding({ locale, axis = null, newsletterForm }: {
  locale: ToolsLocale;
  axis?: string | null;
  newsletterForm: PublishedDynamicForm | null;
}) {
  const c = content[locale];
  const activeAxis = axis ? getToolAxis(axis) : null;
  const tools = getToolsForAxis(activeAxis?.slug ?? null);
  const basePath = `/${locale}/herramientas`;
  const sourcePath = activeAxis ? `${basePath}/${activeAxis.slug}` : basePath;
  const ctas = newsletterForm ? c.ctas : c.ctas.filter((cta) => cta.href !== '#novedades');

  return (
    <div className={styles.page} data-tools-library-page>
      <header className={styles.heading}>
        <div className={styles.headingInner}>
          <p className={styles.breadcrumb} aria-label={locale === 'es' ? 'Ruta de navegación' : 'Breadcrumb'}>
            <Link href={`/${locale}`}>SIGUE Network</Link>
            <span aria-hidden="true">/</span>
            {activeAxis ? <Link href={basePath}>{c.breadcrumb}</Link> : c.breadcrumb}
            {activeAxis ? <><span aria-hidden="true">/</span>{activeAxis.name[locale]}</> : null}
          </p>
          <span className={styles.eyebrow}>{c.eyebrow}</span>
          <h1>{c.title}</h1>
          <p className={styles.subtitle}>{c.subtitle}</p>
        </div>
      </header>

      <div className={styles.main}>
        <nav className={styles.filters} aria-label={c.filtersLabel}>
          <Link href={basePath} className={styles.filter} aria-current={activeAxis ? undefined : 'page'}>
            {c.all}
          </Link>
          {toolAxes.map((item) => (
            <Link
              key={item.slug}
              href={`${basePath}/${item.slug}`}
              className={styles.filter}
              style={{ '--axis-color': item.color } as CSSProperties}
              aria-current={activeAxis?.slug === item.slug ? 'page' : undefined}
            >
              {item.name[locale]}
            </Link>
          ))}
        </nav>

        {activeAxis ? (
          <h2 className={styles.axisHeading}>
            {c.axisIntro} <span style={{ color: activeAxis.color }}>{activeAxis.name[locale]}</span>
          </h2>
        ) : null}

        {tools.length ? (
          <section className={styles.grid} aria-label={c.title}>
            {tools.map((tool) => {
              const toolAxis = getToolAxis(tool.axis);
              const color = toolAxis?.color ?? '#5e17eb';
              return (
                <article key={tool.id} className={styles.card} style={{ '--axis-color': color } as CSSProperties}>
                  <div className={styles.preview}>
                    <Image
                      src={tool.preview}
                      alt={`${c.previewAlt}: ${tool.title[locale]}`}
                      width={720}
                      height={540}
                      sizes="(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 360px"
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.meta}>
                      <Link href={`${basePath}/${tool.axis}`} className={styles.axisBadge}>{toolAxis?.name[locale]}</Link>
                      <span>{tool.month[locale]} 2026</span>
                    </p>
                    <h3>{tool.title[locale]}</h3>
                    <p className={styles.description}>{tool.description[locale]}</p>
                    <p className={styles.details}>
                      {tool.duration ? <span>{c.duration}: {tool.duration[locale]}</span> : null}
                      <span>{c.format}</span>
                    </p>
                    <a
                      className={styles.downloadButton}
                      href={tool.file}
                      download
                      data-analytics-event="tool_download"
                      data-tool-id={tool.id}
                      data-tool-axis={tool.axis}
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                        <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      {c.download}
                    </a>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <p className={styles.empty}>{c.noTools}</p>
        )}

        {!activeAxis ? (
          <section className={styles.others} aria-labelledby="other-guides">
            <h2 id="other-guides">{c.otherTitle}</h2>
            <ul>
              {otherGuides.map((item) => (
                <li key={item.href}>
                  <span>{item[locale]}</span>
                  <span className={styles.fileType}>{item.type}</span>
                  <a
                    href={item.href}
                    download
                    data-analytics-event="tool_download"
                    data-tool-id={item.href.split('/').pop()}
                  >
                    {c.otherDownload}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className={styles.ctaSection} aria-labelledby="tools-cta">
          <h2 id="tools-cta">{c.ctaTitle}</h2>
          <div className={styles.ctaGrid}>
            {ctas.map((cta) => (
              <div key={cta.href} className={styles.cta}>
                <h3>{cta.title}</h3>
                <p>{cta.body}</p>
                {cta.href.startsWith('#')
                  ? <a href={cta.href}>{cta.label}</a>
                  : <Link href={`/${locale}${cta.href}`}>{cta.label}</Link>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {newsletterForm ? (
        <LeadCaptureSection id="novedades" form={newsletterForm} locale={locale} sourcePath={sourcePath} />
      ) : null}
    </div>
  );
}
