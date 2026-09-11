import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { startPublicContentFixture } from './fixtures/public-content.mjs';

// A temporary route mounts real editor components without bypassing admin auth.
// It has no database access and is always removed after the test.
const route = new URL('../app/[locale]/content-editor-qa/', import.meta.url);
const port = Number(process.env.ADMIN_TEST_PORT || 3197);
const origin = `http://localhost:${port}`;
const originalTsconfig = await readFile(new URL('../tsconfig.json', import.meta.url));
const originalNextEnv = await readFile(new URL('../next-env.d.ts', import.meta.url));
let server;
let browser;
const fixture = await startPublicContentFixture(origin);
await mkdir(route); // Refuse to overwrite an existing route.
try {
  await writeFile(new URL('page.tsx', route), `
import { ActionForm } from '@/app/admin/components/ActionForm';
import { RichTextEditor } from '@/app/admin/components/RichTextEditor';
import { MediaField } from '@/app/admin/components/MediaField';
import { SeoAssistant } from '@/app/admin/components/SeoAssistant';
import type { AdminActionState } from '@/app/admin/actions/types';
export default function Page() {
  async function save(_state: AdminActionState, _form: FormData): Promise<AdminActionState> {
    'use server';
    return { error: 'Validación de prueba', fieldErrors: { seoTitleEs: ['Revisa el título SEO'] } };
  }
  return <main style={{maxWidth:900, margin:'40px auto', padding:20}}>
    <ActionForm action={save}>
      <label>Título<input name="titleEs" defaultValue="Original" /></label>
      <label><input type="checkbox" name="featured" defaultChecked />Destacado</label>
      <RichTextEditor name="contentEs" label="Contenido" initialContent='<p>Contenido inicial</p><table><tbody><tr><td><p>Agenda existente</p></td></tr></tbody></table>' />
      <RichTextEditor name="agendaEs" label="Agenda opcional" />
      <MediaField name="featuredImageUrl" label="Portada" />
      <details><summary>SEO</summary><label>Título SEO<input name="seoTitleEs" defaultValue="" /></label><label>Descripción SEO<textarea name="seoDescriptionEs" /></label><SeoAssistant suffix="Es" /></details>
    </ActionForm>
  </main>;
}
`);
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--port', String(port)], { env: { ...process.env, SIGUE_TEST_DIST_DIR: '.next-admin-qa', NEXT_PUBLIC_SUPABASE_URL: fixture.url, NEXT_PUBLIC_SUPABASE_ANON_KEY: 'local-test-key', NEXT_PUBLIC_SITE_URL: 'https://example.org' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  server.stdout.on('data', (chunk) => { log += chunk; });
  server.stderr.on('data', (chunk) => { log += chunk; });
  for (let attempt = 0; attempt < 90; attempt++) {
    try { if ((await fetch(`${origin}/es/content-editor-qa`)).ok) break; } catch {}
    if (server.exitCode !== null) throw new Error(log);
    if (attempt === 89) throw new Error(`Server did not start: ${log}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', (error) => { errors.push(error.message); console.error('Browser:', error.message); });
  const image = await sharp({ create: { width: 600, height: 400, channels: 3, background: '#663399' } }).png().toBuffer();
  const webp = await sharp(image).webp().toBuffer();
  await page.route('**/qa-photo.webp', (route) => route.fulfill({ contentType: 'image/webp', body: webp }));
  await page.route('**/api/admin/media', async (route) => {
    assert.match(route.request().postDataBuffer().toString('latin1'), /image\/webp/);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ url: `${origin}/qa-photo.webp` }) });
  });
  await page.goto(`${origin}/es/content-editor-qa`);
  await page.getByRole('textbox', { name: 'Contenido', exact: true }).waitFor();
  await page.locator('input[name="titleEs"]').fill('Título que debe conservarse');
  await page.locator('input[name="featured"]').uncheck();
  assert.match(await page.locator('input[name="contentEs"]').inputValue(), /<table>/);
  const toolbar = page.getByRole('toolbar', { name: 'Formato de Contenido', exact: true });
  await toolbar.getByRole('button', { name: 'Insertar o editar imagen' }).click();
  await page.getByRole('group', { name: 'Configurar imagen' }).locator('input[type=file]').setInputFiles({ name: 'foto.png', mimeType: 'image/png', buffer: image });
  await page.waitForFunction(() => document.querySelector('button[type=submit]')?.disabled);
  await page.getByRole('group', { name: 'Configurar imagen' }).getByPlaceholder('Describe lo que se ve en la imagen').fill('Equipo en el encuentro');
  const insert = page.getByRole('button', { name: 'Insertar imagen', exact: true });
  await insert.click();
  assert.match(await page.locator('input[name="contentEs"]').inputValue(), /alt="Equipo en el encuentro"/);
  const inline = page.getByRole('textbox', { name: 'Contenido', exact: true }).locator('img');
  await inline.click();
  await toolbar.getByRole('button', { name: 'Insertar o editar imagen' }).click();
  await page.getByPlaceholder('Describe lo que se ve en la imagen').fill('Descripción actualizada');
  await page.getByRole('button', { name: 'Actualizar imagen' }).click();
  assert.match(await page.locator('input[name="contentEs"]').inputValue(), /alt="Descripción actualizada"/);
  const agenda = page.getByRole('textbox', { name: 'Agenda opcional', exact: true });
  await agenda.fill('Borrar esta agenda');
  await agenda.fill('');
  assert.equal(await page.locator('input[name="agendaEs"]').inputValue(), '');
  await page.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  await page.getByText('Validación de prueba', { exact: true }).waitFor();
  assert.equal(await page.locator('input[name="titleEs"]').inputValue(), 'Título que debe conservarse');
  assert.equal(await page.locator('input[name="featured"]').isChecked(), false);
  assert.equal(await page.locator('input[name="seoTitleEs"]').isVisible(), true);
  assert.equal(await page.locator('input[name="seoTitleEs"]').getAttribute('aria-invalid'), 'true');
  await page.locator('input[name="seoTitleEs"]').fill('SEO configurable');
  assert.equal(await page.locator('[class*="searchPreview"] span').innerText(), 'SEO configurable');
  for (const width of [1366, 390]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }
  for (const [segment, slug] of [['blog', 'articulo-prueba'], ['evento', 'evento-prueba']]) {
    await page.goto(`${origin}/es/${segment}/${slug}`);
    assert.equal(await page.title(), 'Título SEO configurado');
    assert.equal(await page.locator('meta[name=description]').getAttribute('content'), 'Descripción SEO configurada');
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://example.org/canonical');
    assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), 'Título social configurado');
    assert.match(await page.locator('meta[name=robots]').getAttribute('content'), /nofollow/);
    assert.equal(await page.locator('[class*="richText"] img').evaluate((img) => img.complete && img.naturalWidth > 0), true);
    const schema = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent)));
    assert.ok(schema.some((item) => item['@type'] === (segment === 'blog' ? 'BlogPosting' : 'Event')));
    await page.goto(`${origin}/en/${segment}/${slug}`);
    assert.match(page.url(), segment === 'blog' ? /test-article$/ : /test-event$/);
    assert.match(await page.locator('meta[name=robots]').getAttribute('content'), /noindex/);
  }
  await page.goto(`${origin}/es/evento/evento-pasado`);
  assert.equal(await page.getByRole('link', { name: 'Inscribirme', exact: true }).count(), 0);
  for (const path of ['/es/blog/borrador', '/es/evento/evento-borrador', '/es/evento/evento-futuro']) {
    const response = await page.goto(`${origin}${path}`);
    assert.equal(response.status(), 404);
  }
  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  assert.match(sitemap, /articulo-prueba/);
  assert.doesNotMatch(sitemap, /test-article|evento-borrador|evento-futuro/);
  const eventQueries = fixture.requests.filter((url) => url.pathname === '/rest/v1/events');
  assert.ok(eventQueries.length > 0);
  assert.ok(eventQueries.every((url) => url.searchParams.has('status') && url.searchParams.has('published_at')));
  console.log('Public pages: configured SEO/canonical/social/robots, inline images, JSON-LD, language redirects, hidden drafts/future events, closed past registration and sitemap passed.');
  assert.deepEqual(errors, []);
  console.log('Admin UI: upload/conversion, upload guard, insert/edit/alt, table preservation, empty agenda, validation recovery, SEO preview, desktop/mobile passed.');
} finally {
  await browser?.close();
  await new Promise((resolve) => fixture.server.close(resolve));
  server?.kill('SIGTERM');
  if (server && server.exitCode === null) await new Promise((resolve) => server.once('exit', resolve));
  await rm(route, { recursive: true, force: true });
  await rm(new URL('../.next-admin-qa/', import.meta.url), { recursive: true, force: true });
  await writeFile(new URL('../tsconfig.json', import.meta.url), originalTsconfig);
  await writeFile(new URL('../next-env.d.ts', import.meta.url), originalNextEnv);
}
