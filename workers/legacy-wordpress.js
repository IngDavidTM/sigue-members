// WordPress still serves its administration and legacy media. Public pages
// retired during the migration must not reappear through an origin cache.
const RETIRED_PAGES = new Set([
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

const RETIRED_SITEMAPS = new Set([
  '/wp-sitemap.xml',
  '/sitemap_index.xml',
  '/post-sitemap.xml',
  '/page-sitemap.xml',
  '/edge-event-sitemap.xml',
  '/product-sitemap.xml',
  '/mailpoet_page-sitemap.xml',
  '/category-sitemap.xml',
]);

function isRetired(url) {
  const path = url.pathname;
  const firstSegment = path.split('/')[1];

  return path.startsWith('/producto/')
    || path.startsWith('/product/')
    || RETIRED_PAGES.has(firstSegment)
    || RETIRED_SITEMAPS.has(path)
    || url.searchParams.has('wc-ajax')
    || url.searchParams.has('wc-api')
    || url.searchParams.has('add-to-cart');
}

function shouldRouteToWordPress(url) {
  return url.pathname.startsWith('/wp-') || url.searchParams.has('rest_route');
}

function retiredResponse() {
  return new Response('Esta página fue retirada.', {
    status: 410,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'x-robots-tag': 'noindex',
      'cache-control': 'no-store',
    },
  });
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
      if (isRetired(wordpressUrl)) {
        return retiredResponse();
      }
      if (shouldRouteToWordPress(wordpressUrl)) {
        if (!wordpressUrl.pathname.endsWith('/') && !wordpressUrl.pathname.startsWith('/wp-')) {
          wordpressUrl.pathname += '/';
        }
        return Response.redirect(wordpressUrl.toString(), 308);
      }
    }

    if (isRetired(url)) {
      return retiredResponse();
    }

    if (shouldRouteToWordPress(url)) {
      return fetch(request);
    }

    url.hostname = 'sigue-members.vercel.app';
    const upstream = await fetch(new Request(url, request));
    const location = upstream.headers.get('location');
    if (!location || !location.startsWith('https://sigue-members.vercel.app/')) {
      return upstream;
    }

    const headers = new Headers(upstream.headers);
    headers.set('location', location.replace('https://sigue-members.vercel.app/', 'https://siguenetwork.org/'));
    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers });
  },
};

export default handler;
