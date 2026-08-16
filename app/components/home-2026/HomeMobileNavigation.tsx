'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useRef } from 'react';
import styles from './HomeMobileNavigation.module.css';

type Locale = 'es' | 'en';

type NavigationItem = {
  readonly label: string;
  readonly href: string;
  readonly children: readonly (readonly [string, string])[];
};

function localizedHref(locale: Locale, href: string) {
  if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return href;
  return `/${locale}${href}`;
}

export default function HomeMobileNavigation({
  items,
  locale,
  label,
}: {
  items: readonly NavigationItem[];
  locale: Locale;
  label: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => detailsRef.current?.removeAttribute('open');

  return (
    <details ref={detailsRef} className={styles.mobileMenu}>
      <summary aria-label={label}>
        <Menu className={styles.menuOpenIcon} size={28} aria-hidden="true" />
        <X className={styles.menuCloseIcon} size={28} aria-hidden="true" />
      </summary>
      <nav aria-label={locale === 'es' ? 'Navegación móvil' : 'Mobile navigation'}>
        {items.map((item) => (
          <div className={styles.mobileNavGroup} key={item.label}>
            <Link className={styles.mobileNavParent} href={localizedHref(locale, item.href)} onClick={closeMenu}>
              {item.label}
            </Link>
            {item.children.length > 0 && (
              <div className={styles.mobileNavChildren}>
                {item.children.map(([childLabel, href]) => {
                  const external = href.startsWith('http');
                  return (
                    <Link
                      href={localizedHref(locale, href)}
                      key={childLabel}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      onClick={closeMenu}
                    >
                      {childLabel}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </details>
  );
}
