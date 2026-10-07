// Keep the small set of WordPress-only features on their existing public URLs.
// The proxied wp-origin record points to the current GoDaddy server. Cloudflare
// sends the original Host header, so WordPress continues to see siguenetwork.org.
const WORDPRESS_PAGES = new Set([
  'confirmacion-de-donacion',
  'event-organizers',
  'event-venues',
  'my-calendar',
  'organizer-dashboard',
  'submit-organizer-form',
  'submit-venue-form',
  'venue-dashboard',
  'carrito',
  'checkout',
  'finalizar-compra',
  'mi-cuenta',
]);

const WORDPRESS_SITEMAPS = new Set([
  '/sitemap_index.xml',
  '/post-sitemap.xml',
  '/page-sitemap.xml',
  '/edge-event-sitemap.xml',
  '/product-sitemap.xml',
  '/mailpoet_page-sitemap.xml',
  '/category-sitemap.xml',
]);

function shouldRouteToWordPress(url) {
  const path = url.pathname;
  const firstSegment = path.split('/')[1];

  return path.startsWith('/wp-')
    || path.startsWith('/producto/')
    || WORDPRESS_PAGES.has(firstSegment)
    || WORDPRESS_SITEMAPS.has(path)
    || url.searchParams.has('wc-ajax');
}

const handler = {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname !== 'siguenetwork.org' || !shouldRouteToWordPress(url)) {
      return fetch(request);
    }

    return fetch(request, {
      cf: { resolveOverride: 'wp-origin.siguenetwork.org' },
    });
  },
};

export default handler;
