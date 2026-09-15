import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { optimizeContentImage } from "../lib/content/process-image.ts";
import { sanitizeRichText, validateSanitizedRichText, zonedInputToIso, isoToZonedInput } from "../lib/content/admin-utils.ts";

test("la agenda opcional permite vaciar el editor; el cuerpo exige texto", () => {
  assert.equal(validateSanitizedRichText("<p></p>", "Agenda", true).html, "");
  assert.equal(validateSanitizedRichText("<p><br></p>", "Agenda", true).error, undefined);
  assert.ok(validateSanitizedRichText("<p></p>", "Contenido").error);
});

test("las imágenes y tablas sobreviven al guardado sin atributos ejecutables", () => {
  const clean = sanitizeRichText('<p>Texto</p><img src="https://example.org/photo.webp" alt="Foto del equipo" onerror="alert(1)"><table><tbody><tr><td>Sesión</td></tr></tbody></table><script>alert(1)</script>');
  assert.match(clean, /alt="Foto del equipo"/);
  assert.match(clean, /loading="lazy"/);
  assert.match(clean, /<td>Sesión<\/td>/);
  assert.doesNotMatch(clean, /onerror|<script/);
  assert.equal(validateSanitizedRichText(clean, "Contenido").error, undefined);
  assert.ok(validateSanitizedRichText('<p>Texto</p><img src="data:image/png;base64,AAAA">', "Contenido").error);
});

test("quita protocolos peligrosos de enlaces e imágenes", () => {
  const clean = sanitizeRichText('<a href="javascript:alert(1)">Texto</a><img src="//evil.example/a.webp"><iframe src="https://evil.example"></iframe>');
  assert.doesNotMatch(clean, /javascript:|src=|iframe/);
});

test("convierte zonas horarias y rechaza fechas imposibles y saltos de DST", () => {
  assert.equal(zonedInputToIso("2026-10-27T09:30", "America/Bogota"), "2026-10-27T14:30:00.000Z");
  assert.equal(isoToZonedInput("2026-10-27T14:30:00.000Z", "America/Bogota"), "2026-10-27T09:30");
  for (const invalid of ["2026-02-30T10:00", "2026-13-01T10:00", "2026-01-01T24:00", "2026-01-01T10:60"])
    assert.throws(() => zonedInputToIso(invalid, "UTC"));
  assert.throws(() => zonedInputToIso("2026-03-08T02:30", "America/New_York"));
  assert.throws(() => zonedInputToIso("2026-01-01T10:00", "Invalid/Zone"));
});


test("el servidor decodifica, optimiza y mantiene las proporciones de la imagen", async () => {
  const input = await sharp({ create: { width: 3000, height: 1500, channels: 4, background: { r: 81, g: 32, b: 123, alpha: 0.5 } } }).webp().toBuffer();
  const output = await optimizeContentImage(new File([input], "foto.webp", { type: "image/webp" }));
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, 2400);
  assert.equal(metadata.height, 1200);
  assert.equal(metadata.hasAlpha, true);
  assert.equal(metadata.exif, undefined);
  const small = await sharp({ create: { width: 100, height: 50, channels: 3, background: "white" } }).webp().toBuffer();
  const smallResult = await sharp(await optimizeContentImage(new File([small], "small.webp"))).metadata();
  assert.equal(smallResult.width, 100);
});

test("el servidor rechaza un archivo truncado aunque su cabecera diga WebP", async () => {
  const forged = new File(["RIFF\x00\x00\x00\x00WEBP"], "forged.webp", { type: "image/webp" });
  await assert.rejects(() => optimizeContentImage(forged));
});
