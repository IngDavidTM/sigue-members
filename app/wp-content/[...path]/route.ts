import essentialMedia from "@/data/wordpress-essential-media.json";

const redirects = essentialMedia as Record<string, string>;

function respond(request: Request) {
  const url = new URL(request.url);
  const target = redirects[url.pathname];

  if (!target) {
    return new Response("Este archivo ya no está disponible.", {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex",
        "cache-control": "no-store",
      },
    });
  }

  return new Response(null, {
    status: 308,
    headers: {
      location: new URL(target, url).toString(),
      "cache-control": "public, max-age=3600",
    },
  });
}

export const GET = respond;
export const HEAD = respond;
