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
const nextEnvPath = new URL('../next-env.d.ts', import.meta.url);
const originalNextEnv = await readFile(nextEnvPath).catch((error) => {
  if (error.code === 'ENOENT') return null;
  throw error;
});
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
import DynamicForm from '@/app/components/forms/DynamicForm';
import type { AdminActionState } from '@/app/admin/actions/types';
import type { DynamicFormFieldRow, DynamicFormRow } from '@/types/supabase';
export default function Page() {
  async function save(_state: AdminActionState, _form: FormData): Promise<AdminActionState> {
    'use server';
    return { error: 'Validación de prueba', fieldErrors: { seoTitleEs: ['Revisa el título SEO'] } };
  }
  const form = { id: '33333333-3333-4333-8333-333333333333', slug: 'qa-contacto', name: 'Contacto QA', status: 'published', title_es: 'Conversemos', title_en: 'Let’s talk', description_es: 'Formulario configurable', description_en: 'Configurable form', submit_label_es: 'Enviar mensaje', submit_label_en: 'Send message', success_message_es: 'Mensaje recibido.', success_message_en: 'Message received.', notification_emails: [], notification_subject: null, reply_to_field_key: 'correo', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), created_by: null, updated_by: null } as DynamicFormRow;
  const fields = [
    { id: 'field-name', form_id: form.id, field_key: 'nombre', field_type: 'short_text', label_es: 'Nombre completo', label_en: 'Full name', placeholder_es: 'Tu nombre', placeholder_en: 'Your name', help_text_es: null, help_text_en: null, required: true, options: [], validation: { max_length: 120 }, conditional_logic: null, sort_order: 10, width: 50, created_at: form.created_at, updated_at: form.updated_at },
    { id: 'field-email', form_id: form.id, field_key: 'correo', field_type: 'email', label_es: 'Correo electrónico', label_en: 'Email address', placeholder_es: null, placeholder_en: null, help_text_es: null, help_text_en: null, required: true, options: [], validation: { max_length: 254 }, conditional_logic: null, sort_order: 20, width: 50, created_at: form.created_at, updated_at: form.updated_at },
    { id: 'field-topic', form_id: form.id, field_key: 'asunto', field_type: 'select', label_es: 'Asunto', label_en: 'Topic', placeholder_es: null, placeholder_en: null, help_text_es: null, help_text_en: null, required: true, options: [{ value: 'alianzas', label_es: 'Alianzas', label_en: 'Partnerships' }], validation: {}, conditional_logic: null, sort_order: 30, width: 100, created_at: form.created_at, updated_at: form.updated_at },
  ] as DynamicFormFieldRow[];
  return <main style={{maxWidth:900, margin:'40px auto', padding:20}}>
    <ActionForm action={save}>
      <label>Título<input name="titleEs" defaultValue="Original" /></label>
      <label><input type="checkbox" name="featured" defaultChecked />Destacado</label>
      <RichTextEditor name="contentEs" label="Contenido" initialContent='<p>Contenido inicial</p><table><tbody><tr><td><p>Agenda existente</p></td></tr></tbody></table>' />
      <RichTextEditor name="agendaEs" label="Agenda opcional" />
      <MediaField name="featuredImageUrl" label="Portada" />
      <details><summary>SEO</summary><label>Título SEO<input name="seoTitleEs" defaultValue="" /></label><label>Descripción SEO<textarea name="seoDescriptionEs" /></label><SeoAssistant suffix="Es" /></details>
    </ActionForm>
    <div style={{marginTop:60}}><DynamicForm form={form} fields={fields} locale="es" sourcePath="/es/content-editor-qa" /></div>
  </main>;
}
`);
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--port', String(port)], { env: { ...process.env, SIGUE_TEST_DIST_DIR: '.next-admin-qa', NEXT_PUBLIC_SUPABASE_URL: fixture.url, NEXT_PUBLIC_SUPABASE_ANON_KEY: 'local-test-key', SUPABASE_SERVICE_ROLE_KEY: 'local-test-service-key', FORM_RATE_LIMIT_SECRET: 'local-test-rate-limit-key', NEXT_PUBLIC_SITE_URL: 'https://example.org', CRON_SECRET: 'qa-cron-secret' }, stdio: ['ignore', 'pipe', 'pipe'] });
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
  await page.waitForFunction(() => document.querySelector('input[name="contentEs"]')?.value.includes('alt="Equipo en el encuentro"'));
  assert.match(await page.locator('input[name="contentEs"]').inputValue(), /alt="Equipo en el encuentro"/);
  const inline = page.getByRole('textbox', { name: 'Contenido', exact: true }).locator('img');
  await inline.click();
  await toolbar.getByRole('button', { name: 'Insertar o editar imagen' }).click();
  await page.getByPlaceholder('Describe lo que se ve en la imagen').fill('Descripción actualizada');
  await page.getByRole('button', { name: 'Actualizar imagen' }).click();
  assert.match(await page.locator('input[name="contentEs"]').inputValue(), /alt="Descripción actualizada"/);
  const agenda = page.getByRole('textbox', { name: 'Agenda opcional', exact: true });
  await agenda.fill('Borrar esta agenda');
  await agenda.press('Control+A');
  await agenda.press('Backspace');
  await page.waitForFunction(() => document.querySelector('input[name="agendaEs"]')?.value === '');
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
  await page.getByRole('textbox', { name: 'Nombre completo' }).fill('Sandra');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('sandra@example.org');
  await page.getByRole('combobox', { name: 'Asunto' }).selectOption('alianzas');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await page.getByText('Mensaje recibido.', { exact: true }).waitFor();
  assert.ok(fixture.requests.some((url) => url.pathname === '/rest/v1/rpc/submit_dynamic_form'));
  console.log('Dynamic form: configured fields, public Server Action, RPC submission and success state passed.');
  assert.equal((await fetch(`${origin}/api/cron/form-notifications`)).status, 401);
  const cron = await fetch(`${origin}/api/cron/form-notifications`, { headers: { authorization: 'Bearer qa-cron-secret' } });
  const cronResult = await cron.json();
  assert.equal(cron.status, 200, JSON.stringify(cronResult));
  assert.deepEqual(cronResult, { processed: 0, sent: 0, failed: 0 });
  console.log('Notification cron: authentication, queue access and cleanup passed.');
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
    assert.equal(await page.title(), 'Configured English SEO title');
    assert.equal(await page.getByRole('heading', { level: 1 }).innerText(), 'English test content');
    assert.equal(await page.locator('meta[name=description]').getAttribute('content'), 'Configured English SEO description');
    assert.match(await page.locator('[class*="richText"]').first().innerText(), /Public content in English/);
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
  if (originalNextEnv === null) {
    await rm(nextEnvPath, { force: true });
  } else {
    await writeFile(nextEnvPath, originalNextEnv);
  }
}
