import Image from 'next/image';
import styles from './ToolsGuidesLanding.module.css';
import Link from 'next/link';

type Locale = 'es' | 'en';

const DOWNLOAD_ICON = 'https://siguenetwork.org/wp-content/uploads/2025/02/download-347.png';

const downloads = [
  {
    es: 'Herramienta Mayo',
    en: 'May tool',
    href: 'https://siguenetwork.org/wp-content/uploads/2026/04/MAYO.docx',
    type: 'DOCX',
  },
  {
    es: 'Herramienta Abril',
    en: 'April tool',
    href: 'https://siguenetwork.org/wp-content/uploads/2026/04/ABRIL.docx',
    type: 'DOCX',
  },
  {
    es: 'Herramienta Marzo',
    en: 'March tool',
    href: 'https://siguenetwork.org/wp-content/uploads/2026/04/MARZO.docx',
    type: 'DOCX',
  },
  {
    es: 'Herramienta Febrero',
    en: 'February tool',
    href: 'https://siguenetwork.org/wp-content/uploads/2026/04/FEBRERO.docx',
    type: 'DOCX',
  },
  {
    es: 'Herramienta Enero',
    en: 'January tool',
    href: 'https://siguenetwork.org/wp-content/uploads/2026/04/ENERO-.docx',
    type: 'DOCX',
  },
  {
    es: 'Hoja de chequeo para evaluar los desafíos de FE de mi proyecto social o entidad sin ánimo de lucro',
    en: 'Checklist to assess the FE challenges of my social project or nonprofit organization',
    href: 'https://siguenetwork.org/wp-content/uploads/2024/11/Hoja-de-chequeo-para-evaluar-los-desafios-de-FE-de-mi-fundacion-ONG-o-proyecto-social.docx',
    type: 'DOCX',
  },
  {
    es: 'Hoja de trabajo para establecer una estrategia de transformación integral de comunidades',
    en: 'Worksheet for developing a comprehensive community-transformation strategy',
    href: 'https://siguenetwork.org/wp-content/uploads/2025/02/Plantilla-para-elaborar-estrategia-de-transformacion-FES-SIGUE-Network-2025.pdf',
    type: 'PDF',
  },
  {
    es: 'Política de tratamiento de datos personales',
    en: 'Personal data processing policy',
    href: 'https://siguenetwork.org/wp-content/uploads/2025/05/Herramienta_-politica-de-tratamiento-de-datos-personales.pdf',
    type: 'PDF',
  },
] as const;

const content = {
  es: {
    eyebrow: 'RECURSOS SIGUE NETWORK',
    title: 'Herramientas y guías descargables',
    description: 'Recursos prácticos para fortalecer tu proyecto social, organización o iniciativa de impacto.',
    breadcrumb: 'Herramientas y guías',
    download: 'Descargar',
    iconAlt: 'Ícono de descarga',
    note: 'Selecciona una herramienta para descargar el archivo original publicado por SIGUE Network.',
  },
  en: {
    eyebrow: 'SIGUE NETWORK RESOURCES',
    title: 'Downloadable tools and guides',
    description: 'Practical resources to strengthen your social project, organization, or impact initiative.',
    breadcrumb: 'Tools and guides',
    download: 'Download',
    iconAlt: 'Download icon',
    note: 'Select a tool to download the original file published by SIGUE Network.',
  },
} as const;

export default function ToolsGuidesLanding({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <div className={styles.page} data-tools-guides-page>
      <header className={styles.heading}>
        <div className={styles.headingInner}>
          <div>
            <span>{c.eyebrow}</span>
            <h1>{c.title}</h1>
          </div>
          <p aria-label={locale === 'es' ? 'Ruta de navegación' : 'Breadcrumb'}>
            <Link href={`/${locale}`}>SIGUE Network</Link>
            <span aria-hidden="true">/</span>
            {c.breadcrumb}
          </p>
        </div>
      </header>

      <div className={styles.main}>
        <section className={styles.intro} aria-labelledby="tools-description">
          <div className={styles.iconFrame}>
            <Image src={DOWNLOAD_ICON} alt={c.iconAlt} fill unoptimized sizes="104px" />
          </div>
          <h2 id="tools-description">{c.description}</h2>
          <p>{c.note}</p>
        </section>

        <section className={styles.downloads} aria-label={c.title}>
          {downloads.map((item, index) => (
            <article className={styles.row} key={item.href}>
              <div className={styles.rowCopy}>
                <span className={styles.index} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item[locale]}</h3>
                <span className={styles.fileType}>{item.type}</span>
              </div>
              <a className={styles.downloadButton} href={item.href}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                {c.download}
              </a>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
