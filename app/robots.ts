import type { MetadataRoute } from 'next';
import { absoluteUrl, getSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/auth/',
        '/dashboard',
        '/forgot-password',
        '/login',
        '/register',
        '/reset-password',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getSiteUrl(),
  };
}
