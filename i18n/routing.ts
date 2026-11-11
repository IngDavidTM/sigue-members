import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  // hreflang lives in each page's <head> and in the sitemap. The Link header
  // next-intl adds would name an unprefixed x-default URL that only redirects.
  alternateLinks: false,
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
