'use client';

import Link from 'next/link';
import { Heart, Menu, X } from 'lucide-react';
import { useRef } from 'react';
import NavigationIcon from '@/app/components/site-2026/NavigationIcon';
import {
  localizedNavigationHref,
  type NavigationChild,
  type NavigationItem,
  type SiteLocale,
} from '@/app/components/site-2026/navigation';
import styles from './HomeMobileNavigation.module.css';

function resolvePreviewHref(href: string, previewHome: boolean) {
  if (!previewHome) return href;
  if (href === '/') return '/inicio-2026';
  if (href.startsWith('/#')) return `/inicio-2026${href.slice(1)}`;
  return href;
}

function MobileEntry({
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
      <span className={styles.entryIcon} style={{ background: child.color }}>
        <NavigationIcon name={child.icon} />
      </span>
      <span className={styles.entryText}>
        <strong>{child.label}</strong>
        {child.description && <small>{child.description}</small>}
      </span>
    </>
  );

  if (!child.href) {
    return <span className={`${styles.drawerLink} ${styles.drawerLinkDisabled}`} aria-disabled="true">{content}</span>;
  }

  return (
    <Link
      className={styles.drawerLink}
      href={localizedNavigationHref(locale, resolvePreviewHref(child.href, previewHome))}
      onClick={close}
    >
      {content}
    </Link>
  );
}

export default function HomeMobileNavigation({
  items,
  donateLabel,
  locale,
  previewHome,
  label,
}: {
  items: readonly NavigationItem[];
  donateLabel: string;
  locale: SiteLocale;
  previewHome: boolean;
  label: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => detailsRef.current?.removeAttribute('open');

  return (
    <details ref={detailsRef} className={styles.mobileMenu}>
      <summary aria-label={label}>
        <Menu className={styles.menuOpenIcon} size={27} aria-hidden="true" />
        <X className={styles.menuCloseIcon} size={27} aria-hidden="true" />
      </summary>
      <nav aria-label={locale === 'es' ? 'Navegación móvil' : 'Mobile navigation'}>
        {items.map((item) => {
          if (item.href) {
            return (
              <Link
                className={styles.homeLink}
                href={localizedNavigationHref(locale, resolvePreviewHref(item.href, previewHome))}
                onClick={closeMenu}
                key={item.label}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <div className={styles.drawerGroup} key={item.label}>
              <p className={item.accent ? styles.drawerSectionAccent : undefined}>{item.label}</p>
              {item.topLink && (
                <Link
                  className={styles.drawerTopLink}
                  href={localizedNavigationHref(locale, item.topLink.href)}
                  onClick={closeMenu}
                >
                  {item.topLink.label}
                </Link>
              )}
              {item.children?.map((child) => (
                <MobileEntry
                  child={child}
                  locale={locale}
                  previewHome={previewHome}
                  close={closeMenu}
                  key={child.label}
                />
              ))}
            </div>
          );
        })}
        <Link className={styles.drawerDonate} href={`/${locale}/donacion`} onClick={closeMenu}>
          <Heart aria-hidden="true" />{donateLabel}
        </Link>
      </nav>
    </details>
  );
}
