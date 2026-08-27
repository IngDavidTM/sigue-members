'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import HomeMobileNavigation from '@/app/components/home-2026/HomeMobileNavigation';
import NavigationIcon from './NavigationIcon';
import {
  localizedNavigationHref,
  siteNavigation,
  type NavigationChild,
  type SiteLocale,
} from './navigation';
import styles from './SiteHeader2026.module.css';

function resolvePreviewHref(href: string, previewHome: boolean) {
  if (!previewHome) return href;
  if (href === '/') return '/inicio-2026';
  if (href.startsWith('/#')) return `/inicio-2026${href.slice(1)}`;
  return href;
}

function NavigationLink({
  locale,
  href,
  children,
  className,
  onClick,
}: {
  locale: SiteLocale;
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const external = href.startsWith('http');

  return (
    <Link
      className={className}
      href={localizedNavigationHref(locale, href)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

function DropdownEntry({
  child,
  locale,
  previewHome,
  close,
}: {
  child: NavigationChild;
  locale: SiteLocale;
  previewHome: boolean;
  close: () => void;
}) {
  const content = (
    <>
      <span className={styles.menuIcon} style={{ background: child.color }}>
        <NavigationIcon name={child.icon} />
      </span>
      <span className={styles.menuText}>
        <span className={styles.menuLabel}>{child.label}</span>
        {child.description && <span className={styles.menuDescription}>{child.description}</span>}
      </span>
    </>
  );

  if (!child.href) {
    return (
      <span className={`${styles.menuEntry} ${styles.menuEntryDisabled}`} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <NavigationLink
      className={styles.menuEntry}
      href={resolvePreviewHref(child.href, previewHome)}
      locale={locale}
      onClick={close}
    >
      {content}
    </NavigationLink>
  );
}

export default function SiteHeader2026({
  locale,
  onHomePage = false,
  previewHome = false,
  localePath,
}: {
  locale: SiteLocale;
  onHomePage?: boolean;
  previewHome?: boolean;
  localePath: string;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navigation = siteNavigation[locale];
  const homePath = previewHome ? '/inicio-2026' : '/';
  const closeDropdown = () => setOpenDropdown(null);

  useEffect(() => {
    const closeFromOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeDropdown();
    };
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDropdown();
    };

    document.addEventListener('pointerdown', closeFromOutside);
    document.addEventListener('keydown', closeFromKeyboard);
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside);
      document.removeEventListener('keydown', closeFromKeyboard);
    };
  }, []);

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

      <header ref={headerRef} className={styles.header}>
        <div className={styles.headerInner}>
          <NavigationLink locale={locale} href={homePath} className={styles.logoLink} onClick={closeDropdown}>
            <Image src="/images/home-2026/logo-transparent.png" alt="SIGUE Network" width={88} height={106} priority />
          </NavigationLink>

          <nav className={styles.desktopNav} aria-label={locale === 'es' ? 'Navegación principal' : 'Main navigation'}>
            {navigation.items.map((item) => {
              if (item.href) {
                return (
                  <NavigationLink
                    locale={locale}
                    href={resolvePreviewHref(item.href, previewHome)}
                    className={`${styles.navParent} ${onHomePage ? styles.navParentActive : ''}`}
                    key={item.label}
                    onClick={closeDropdown}
                  >
                    {item.label}
                  </NavigationLink>
                );
              }

              const isOpen = openDropdown === item.label;
              return (
                <div
                  className={styles.navGroup}
                  data-open={isOpen || undefined}
                  key={item.label}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={closeDropdown}
                >
                  <button
                    className={`${styles.navParent} ${item.accent ? styles.navParentAccent : ''}`}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown className={styles.chevron} aria-hidden="true" />
                  </button>
                  <div
                    className={`${styles.navDropdown} ${item.wide ? styles.navDropdownWide : ''}`}
                    role="menu"
                    aria-hidden={!isOpen}
                  >
                    {item.topLink && (
                      <>
                        <NavigationLink
                          locale={locale}
                          href={item.topLink.href}
                          className={styles.menuTopLink}
                          onClick={closeDropdown}
                        >
                          {item.topLink.label}<ArrowRight aria-hidden="true" />
                        </NavigationLink>
                        <span className={styles.menuDivider} aria-hidden="true" />
                      </>
                    )}
                    {item.children?.map((child) => (
                      <DropdownEntry
                        child={child}
                        locale={locale}
                        previewHome={previewHome}
                        close={closeDropdown}
                        key={child.label}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <NavigationLink locale={locale} href="/donacion" className={styles.donateButton} onClick={closeDropdown}>
            <Heart aria-hidden="true" />{navigation.donate}
          </NavigationLink>

          <HomeMobileNavigation
            items={navigation.items}
            donateLabel={navigation.donate}
            locale={locale}
            previewHome={previewHome}
            label={locale === 'es' ? 'Abrir menú de navegación' : 'Open navigation menu'}
          />
        </div>
      </header>
    </>
  );
}
