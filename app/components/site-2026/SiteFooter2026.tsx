import Image from 'next/image';
import Link from 'next/link';
import styles from './SiteFooter2026.module.css';

type Locale = 'es' | 'en';

const content = {
  es: {
    body: 'Potenciamos y conectamos ONGs, proyectos sociales y empresas basados en principios cristianos para transformar integralmente comunidades.',
    discover: 'DESCUBRE',
    participate: 'PARTICIPA',
    rights: '© 2026 SIGUE NETWORK. TODOS LOS DERECHOS RESERVADOS.',
    discoverLinks: [
      ['Inicio', ''],
      ['Conoce SIGUE', '/conoce-sigue'],
      ['Ecosistema SIGUE', '/ecosistema'],
      ['Consulting', '/sigue-consulting'],
      ['SIGUE Hub', '/sigue-hub'],
    ],
    participateLinks: [
      ['Únete', '/miembros-sigue'],
      ['Contáctanos', '/contacto'],
      ['Donación', '/donacion'],
      ['Voluntariado', '/unete'],
    ],
  },
  en: {
    body: 'We strengthen and connect NGOs, social projects, and businesses grounded in Christian principles to transform communities holistically.',
    discover: 'DISCOVER',
    participate: 'PARTICIPATE',
    rights: '© 2026 SIGUE NETWORK. ALL RIGHTS RESERVED.',
    discoverLinks: [
      ['Home', ''],
      ['About SIGUE', '/conoce-sigue'],
      ['SIGUE Ecosystem', '/ecosistema'],
      ['Consulting', '/sigue-consulting'],
      ['SIGUE Hub', '/sigue-hub'],
    ],
    participateLinks: [
      ['Join', '/miembros-sigue'],
      ['Contact us', '/contacto'],
      ['Donate', '/donacion'],
      ['Volunteer', '/unete'],
    ],
  },
} as const;

export default function SiteFooter2026({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerAbout}>
          <div className={styles.brandRow}>
            <Link href={`/${locale}`} aria-label={locale === 'es' ? 'Inicio de SIGUE Network' : 'SIGUE Network home'}>
              <Image src="/images/home-2026/logo-transparent.png" alt="" width={56} height={68} />
            </Link>
            <strong>SIGUE NETWORK</strong>
          </div>
          <p>{c.body}</p>
          <address>
            501(C)(3) SIN FINES DE LUCRO · EIN: 26-2010006<br />
            3913 GRIESE LANE, GROVETOWN, GA 30813<br />
            <a href="mailto:info@siguenetwork.org">INFO@SIGUENETWORK.ORG</a>
          </address>
        </div>
        <div>
          <strong>{c.discover}</strong>
          <nav aria-label={c.discover}>
            {c.discoverLinks.map(([label, path]) => (
              <Link href={`/${locale}${path}`} key={label}>{label}</Link>
            ))}
          </nav>
        </div>
        <div>
          <strong>{c.participate}</strong>
          <nav aria-label={c.participate}>
            {c.participateLinks.map(([label, path]) => (
              <Link href={`/${locale}${path}`} key={label}>{label}</Link>
            ))}
          </nav>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>{c.rights}</p>
        <nav aria-label={locale === 'es' ? 'Redes sociales' : 'Social media'}>
          <a href="https://www.instagram.com/siguenetwork/" target="_blank" rel="noreferrer">INSTAGRAM</a>
          <a href="https://www.facebook.com/people/SIGUE-Network/61566310019607/" target="_blank" rel="noreferrer">FACEBOOK</a>
          <a href="https://www.linkedin.com/company/sigue-network/" target="_blank" rel="noreferrer">LINKEDIN</a>
          <a href="https://www.youtube.com/@SIGUENetwork" target="_blank" rel="noreferrer">YOUTUBE</a>
        </nav>
      </div>
    </footer>
  );
}
