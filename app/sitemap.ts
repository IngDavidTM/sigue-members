import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const spanishUrl = absoluteUrl('/es/cumbre-sigue-2026');
  const englishUrl = absoluteUrl('/en/cumbre-sigue-2026');
  const languages = { es: spanishUrl, en: englishUrl };

  return [
    {
      url: spanishUrl,
      lastModified: new Date('2026-08-15'),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: englishUrl,
      lastModified: new Date('2026-08-15'),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages },
    },
  ];
}
