'use client';

import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { useLocaleAlternatePaths } from './LocaleAlternates';
import SiteHeader2026 from '@/app/components/site-2026/SiteHeader2026';

export default function Header() {
  const locale = useLocale() === 'en' ? 'en' : 'es';
  const pathname = usePathname() as string;
  const localePath = pathname === '/' ? '' : pathname;
  const previewHome = pathname === '/inicio-2026';
  const alternatePaths = useLocaleAlternatePaths();

  return (
    <div data-site-header className="sticky top-0 z-[200]">
      <SiteHeader2026
        locale={locale}
        localePath={localePath}
        alternatePaths={alternatePaths}
        onHomePage={pathname === '/' || previewHome}
        previewHome={previewHome}
      />
    </div>
  );
}
