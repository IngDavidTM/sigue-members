import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { proxy } from "../proxy";

const origin = "https://siguenetwork.org";

async function visit(path: string, headers: Record<string, string> = {}) {
  const response = await proxy(new NextRequest(`${origin}${path}`, { headers }));
  const location = response.headers.get("location");
  return {
    status: response.status,
    location: location ? new URL(location, origin).pathname + new URL(location, origin).search : null,
    link: response.headers.get("link"),
  };
}

test("las URL sin prefijo de idioma redirigen de forma permanente en un salto", async () => {
  assert.deepEqual(await visit("/sigue-academy"), { status: 308, location: "/es/sigue-academy", link: null });
  assert.deepEqual(
    await visit("/sigue-academy", { "accept-language": "en-US,en;q=0.9" }),
    { status: 308, location: "/en/sigue-academy", link: null },
  );
});

test("las URL antiguas de WordPress con barra final llegan a su página en un salto", async () => {
  assert.equal((await visit("/sigue-academy/")).location, "/es/sigue-academy");
  assert.equal((await visit("/miembros-sigue/")).location, "/es/miembros-sigue");
  assert.equal((await visit("/en/sigue-academy/")).location, "/en/sigue-academy");
  assert.equal((await visit("/admin/")).location, "/admin");
  for (const path of ["/sigue-academy/", "/en/sigue-academy/", "/admin/"]) {
    assert.equal((await visit(path)).status, 308, path);
  }
});

test("feeds, autores, fechas y paginación de WordPress redirigen a una página viva", async () => {
  const expected: Record<string, string> = {
    "/feed/": "/es/feed.xml",
    "/feed": "/es/feed.xml",
    "/es/feed": "/es/feed.xml",
    "/en/feed": "/en/feed.xml",
    "/comments/feed/": "/es/blog",
    "/author/admin/": "/es/blog",
    "/2024/05/": "/es/blog",
    "/2025/03/12/algo/": "/es/blog",
    "/page/2/": "/es/blog",
    "/blog/page/3/": "/es/blog",
    "/es/blog/page/3": "/es/blog",
    "/eventos/page/2/": "/es/eventos",
    "/tag/ong/feed/": "/es/tag/ong",
    "/category/eje-expandir/page/2/": "/es/category/eje-expandir",
    "/marca-con-proposito/feed/": "/es/blog/marca-con-proposito",
  };
  for (const [path, target] of Object.entries(expected)) {
    const result = await visit(path);
    assert.equal(result.status, 308, path);
    assert.equal(result.location, target, path);
  }
});

test("las redirecciones existentes y las páginas retiradas no cambian", async () => {
  assert.deepEqual(
    await visit("/marca-con-proposito/?migration=1"),
    { status: 308, location: "/es/blog/marca-con-proposito?migration=1", link: null },
  );
  assert.equal((await visit("/category/eje-expandir/")).location, "/es/category/eje-expandir");
  assert.equal((await visit("/tienda/")).status, 410);
  assert.equal((await visit("/wp-json/wp/v2/posts")).status, 410);
});

test("las páginas localizadas no anuncian hreflang en la cabecera Link", async () => {
  const result = await visit("/es/sigue-consulting");
  assert.equal(result.status, 200);
  assert.equal(result.link, null);
});
