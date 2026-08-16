import Image from 'next/image';
import Link from 'next/link';
import HomeMobileNavigation from '@/app/components/home-2026/HomeMobileNavigation';
import styles from './SiteHeader2026.module.css';

type Locale = 'es' | 'en';

const navigation = {
  es: [
    {
      label: 'Inicio',
      href: '#inicio',
      children: [
        ['Nuestra red', '#nuestra-red'],
        ['¿Para quién es SIGUE?', '#para-quien'],
        ['Nuestro primer año', '#impacto'],
        ['Nuestro portafolio', '#portafolio'],
        ['Tu ruta de crecimiento', '#ruta-crecimiento'],
        ['Lo que dicen nuestros miembros', '#testimonios'],
        ['Espacios de conexión', '#conexion'],
        ['Calendario', '#eventos'],
        ['Conéctate con nosotros', '#conectate'],
        ['Tu organización puede más', '#potencial'],
      ],
    },
    {
      label: 'Conoce',
      href: '/conoce-sigue',
      children: [
        ['Conoce SIGUE', '/conoce-sigue'],
        ['SIGUE Tracks', '/sigue-tracks'],
        ['Recursos y herramientas', '/recursos'],
      ],
    },
    {
      label: 'Portafolio',
      href: '#portafolio',
      children: [
        ['Nuestro portafolio', '#portafolio'],
        ['SIGUE Tracks', '/sigue-tracks'],
        ['SIGUE Consulting', '/sigue-consulting'],
        ['SIGUE Academy', '/sigue-academy'],
        ['SIGUE Hub', '/sigue-hub'],
      ],
    },
    {
      label: 'Membresía',
      href: '/unete',
      children: [
        ['Únete a SIGUE', '/unete'],
        ['Miembros SIGUE', '/miembros-sigue'],
      ],
    },
    {
      label: 'Donar',
      href: '/donacion',
      children: [
        ['Donación', '/donacion'],
        ['Transparencia', 'https://app.candid.org/profile/8856365/sigue-network-inc-26-2010006/?pkId=69ae89f8-7514-4198-ad73-e733554cd736'],
      ],
    },
    { label: 'Blog', href: '/blog', children: [] },
  ],
  en: [
    {
      label: 'Home',
      href: '#inicio',
      children: [
        ['Our network', '#nuestra-red'],
        ['Who is SIGUE for?', '#para-quien'],
        ['Our first year', '#impacto'],
        ['Our portfolio', '#portafolio'],
        ['Your growth path', '#ruta-crecimiento'],
        ['What our members say', '#testimonios'],
        ['Connection spaces', '#conexion'],
        ['Calendar', '#eventos'],
        ['Connect with us', '#conectate'],
        ['Your organization can do more', '#potencial'],
      ],
    },
    {
      label: 'About',
      href: '/conoce-sigue',
      children: [
        ['About SIGUE', '/conoce-sigue'],
        ['SIGUE Tracks', '/sigue-tracks'],
        ['Resources and tools', '/recursos'],
      ],
    },
    {
      label: 'Portfolio',
      href: '#portafolio',
      children: [
        ['Our portfolio', '#portafolio'],
        ['SIGUE Tracks', '/sigue-tracks'],
        ['SIGUE Consulting', '/sigue-consulting'],
        ['SIGUE Academy', '/sigue-academy'],
        ['SIGUE Hub', '/sigue-hub'],
      ],
    },
    {
      label: 'Membership',
      href: '/unete',
      children: [
        ['Join SIGUE', '/unete'],
        ['SIGUE members', '/miembros-sigue'],
      ],
    },
    {
      label: 'Donate',
      href: '/donacion',
      children: [
        ['Donation', '/donacion'],
        ['Transparency', 'https://app.candid.org/profile/8856365/sigue-network-inc-26-2010006/?pkId=69ae89f8-7514-4198-ad73-e733554cd736'],
      ],
    },
    { label: 'Blog', href: '/blog', children: [] },
  ],
} as const;

function localizedHref(locale: Locale, href: string) {
  if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

function NavigationLink({ locale, href, children, className }: {
  locale: Locale;
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = href.startsWith('http');

  return (
    <Link
      className={className}
      href={localizedHref(locale, href)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </Link>
  );
}

export default function SiteHeader2026({
  locale,
  onHomePage = false,
  previewHome = true,
  localePath,
}: {
  locale: Locale;
  onHomePage?: boolean;
  previewHome?: boolean;
  localePath: string;
}) {
  const homePath = previewHome ? '/inicio-2026' : '/';
  const items = navigation[locale].map((item, index) => ({
    ...item,
    href: index === 0 ? homePath : item.href.startsWith('#') && !onHomePage ? `${homePath}${item.href}` : item.href,
    children: item.children.map(([label, href]) => [
      label,
      href.startsWith('#') && !onHomePage ? `${homePath}${href}` : href,
    ] as const),
  }));

  return (
    <>
      <nav className={styles.localeToggle} aria-label={locale === 'es' ? 'Cambiar idioma' : 'Change language'}>
        <Link
          href={`/es${localePath}`}
          className={locale === 'es' ? styles.localeActive : undefined}
          aria-current={locale === 'es' ? 'page' : undefined}
          hrefLang="es"
          lang="es"
        >
          ES
        </Link>
        <Link
          href={`/en${localePath}`}
          className={locale === 'en' ? styles.localeActive : undefined}
          aria-current={locale === 'en' ? 'page' : undefined}
          hrefLang="en"
          lang="en"
        >
          EN
        </Link>
      </nav>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.logoLink} href={localizedHref(locale, homePath)} aria-label="SIGUE Network">
            <Image src="/images/home-2026/logo-transparent.png" alt="SIGUE Network" width={134} height={161} priority />
          </Link>
          <nav className={styles.desktopNav} aria-label={locale === 'es' ? 'Navegación principal' : 'Main navigation'}>
            {items.map((item) => (
              <div className={styles.navGroup} key={item.label}>
                <NavigationLink locale={locale} href={item.href} className={styles.navParent}>
                  {item.label}
                </NavigationLink>
                {item.children.length > 0 && (
                  <div className={`${styles.navDropdown} ${item.children.length > 6 ? styles.navDropdownWide : ''}`}>
                    {item.children.map(([label, href]) => (
                      <NavigationLink locale={locale} href={href} key={label}>{label}</NavigationLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <HomeMobileNavigation
            items={items}
            locale={locale}
            label={locale === 'es' ? 'Abrir menú de navegación' : 'Open navigation menu'}
          />
        </div>
      </header>
    </>
  );
}
