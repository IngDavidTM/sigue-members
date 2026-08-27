'use client';

import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import SiteHeader2026 from '@/app/components/site-2026/SiteHeader2026';

export default function Header() {
  const locale = useLocale() === 'en' ? 'en' : 'es';
  const pathname = usePathname() as string;
  const localePath = pathname === '/' ? '' : pathname;

  return (
    <div data-site-header className="contents">
      <SiteHeader2026
        locale={locale}
        localePath={localePath}
        onHomePage={pathname === '/'}
      />
    </div>
  );
}
