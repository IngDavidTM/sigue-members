import assert from "node:assert/strict";
import test from "node:test";

import { safeNextPath } from "../lib/auth/next-path";
import { formatMaterials, isSigueAxis, parseMaterials, videoEmbed } from "../lib/members/recordings";

test("YouTube y Vimeo se incrustan; Zoom y otros se abren aparte", () => {
  const youtube = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0";
  for (const url of [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s",
    "https://youtu.be/dQw4w9WgXcQ?si=abc",
    "https://youtube.com/live/dQw4w9WgXcQ",
    "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
  ]) {
    assert.deepEqual(videoEmbed(url), { kind: "iframe", provider: "youtube", src: youtube }, url);
  }
  assert.deepEqual(videoEmbed("https://vimeo.com/123456789"), { kind: "iframe", provider: "vimeo", src: "https://player.vimeo.com/video/123456789?dnt=1" });
  assert.deepEqual(videoEmbed("https://vimeo.com/123456789/abcdef12"), { kind: "iframe", provider: "vimeo", src: "https://player.vimeo.com/video/123456789?h=abcdef12&dnt=1" });
  assert.equal(videoEmbed("https://us02web.zoom.us/rec/share/xyz")?.kind, "link");
  assert.equal(videoEmbed("https://us02web.zoom.us/rec/share/xyz")?.provider, "zoom");
  assert.equal(videoEmbed("https://drive.google.com/file/d/1/view")?.kind, "link");
});

test("los enlaces de video no https o mal formados se rechazan", () => {
  assert.equal(videoEmbed("http://youtube.com/watch?v=dQw4w9WgXcQ"), null);
  assert.equal(videoEmbed("javascript:alert(1)"), null);
  assert.equal(videoEmbed("no es un enlace"), null);
  // A YouTube URL with a malformed id is not embedded, it opens as a link.
  assert.equal(videoEmbed("https://www.youtube.com/watch?v=<script>")?.kind, "link");
});

test("materiales: una línea por material y errores con número de línea", () => {
  const { materials, invalidLines } = parseMaterials("Presentación | https://example.org/deck.pdf\n\nhttps://example.org/plantilla\nMal | http://inseguro.org\nSin enlace");
  assert.deepEqual(materials, [
    { label: "Presentación", url: "https://example.org/deck.pdf" },
    { label: "https://example.org/plantilla", url: "https://example.org/plantilla" },
  ]);
  assert.deepEqual(invalidLines, [4, 5]);
  assert.equal(formatMaterials(materials), "Presentación | https://example.org/deck.pdf\nhttps://example.org/plantilla | https://example.org/plantilla");
});

test("solo se aceptan los cinco ejes SIGUE", () => {
  assert.ok(isSigueAxis("servir"));
  assert.ok(isSigueAxis("equipar"));
  assert.ok(!isSigueAxis("Servir"));
  assert.ok(!isSigueAxis(undefined));
});

test("después del login solo se vuelve a páginas del área de miembros", () => {
  assert.equal(safeNextPath("/dashboard/webinars/2f1c?x=1"), "/dashboard/webinars/2f1c?x=1");
  assert.equal(safeNextPath("/dashboard"), "/dashboard");
  for (const value of ["/admin", "//evil.example", "/dashboard//evil.example", "https://evil.example/dashboard", "/dashboardx", "/dashboard\\evil", null, 42]) {
    assert.equal(safeNextPath(value), null, String(value));
  }
});
