'use client';

import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import SiteFooter2026 from '@/app/components/site-2026/SiteFooter2026';

export default function Footer() {
  const requestedLocale = useLocale();
  const pathname = usePathname();
  const locale = requestedLocale === 'en' ? 'en' : 'es';

  if (pathname === '/cumbre-sigue-2026') {
    return null;
  }

  return (
    <div data-site-footer>
      <SiteFooter2026 locale={locale} />
    </div>
  );
}
