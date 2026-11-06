import assert from "node:assert/strict";
import test from "node:test";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";

import { config } from "../proxy";

test("las páginas prerenderizadas evitan Proxy sin perder rutas antiguas ni privadas", () => {
  for (const path of [
    "/es/conoce-sigue",
    "/en/donacion",
    "/es/eventos",
    "/en/politica-de-privacidad",
  ]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, url: path }), false, path);
  }

  for (const path of [
    "/es/conoce-sigue/",
    "/es/herramientas-y-guias",
    "/es/contacto",
    "/es",
    "/admin",
    "/marca-con-proposito",
  ]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, url: path }), true, path);
  }
});
