const FALLBACK_SITE_URL = 'https://sigue-members.vercel.app';

export function getSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate || /localhost|127\.0\.0\.1/.test(candidate)) continue;

    try {
      const value = candidate.startsWith('http') ? candidate : `https://${candidate}`;
      return new URL(value).origin;
    } catch {
      // Continue to the next configured URL.
    }
  }

  return FALLBACK_SITE_URL;
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}
