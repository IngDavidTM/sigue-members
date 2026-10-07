import type { MetadataRoute } from 'next';
import { absoluteUrl, getSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/auth/',
        '/dashboard',
        '/forgot-password',
        '/login',
        '/register',
        '/reset-password',
        '/wp-admin/',
        '/wp-login.php',
        '/wp-content/uploads/wc-logs/',
        '/wp-content/uploads/woocommerce_transient_files/',
        '/wp-content/uploads/woocommerce_uploads/',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getSiteUrl(),
  };
}
