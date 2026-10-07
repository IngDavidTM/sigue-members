// Keep WordPress on the existing apex origin and serve Next.js from the
// already verified Vercel subdomain. Visitors keep a single public hostname.
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
  'cart',
  'my-account',
  'shop',
  'tienda',
  'product-category',
  'product-tag',
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
    || url.searchParams.has('wc-ajax')
    || url.searchParams.has('wc-api')
    || url.searchParams.has('add-to-cart')
    || url.searchParams.has('rest_route');
}

const handler = {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname !== 'siguenetwork.org') {
      return new Response('Not found', { status: 404 });
    }

    const localizedPath = url.pathname.match(/^\/(?:es|en)\/(.+)$/);
    if (localizedPath) {
      const wordpressUrl = new URL(`/${localizedPath[1]}`, url);
      if (shouldRouteToWordPress(wordpressUrl)) {
        if (!wordpressUrl.pathname.endsWith('/') && !wordpressUrl.pathname.startsWith('/wp-')) {
          wordpressUrl.pathname += '/';
        }
        return Response.redirect(wordpressUrl.toString(), 308);
      }
    }

    if (shouldRouteToWordPress(url)) {
      return fetch(request);
    }

    url.hostname = 'app.siguenetwork.org';
    const upstream = await fetch(new Request(url, request));
    const location = upstream.headers.get('location');
    if (!location || !location.startsWith('https://app.siguenetwork.org/')) {
      return upstream;
    }

    const headers = new Headers(upstream.headers);
    headers.set('location', location.replace('https://app.siguenetwork.org/', 'https://siguenetwork.org/'));
    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers });
  },
};

export default handler;
