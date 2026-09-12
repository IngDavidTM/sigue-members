import { createServer } from 'node:http';

export async function startPublicContentFixture(siteOrigin) {
  const past = '2020-01-01T12:00:00.000Z';
  const future = '2090-01-01T12:00:00.000Z';
  const translation = {
    title: 'Contenido de prueba', excerpt: 'Resumen de prueba',
    content_html: `<p>Contenido público</p><img src="${siteOrigin}/qa-photo.webp" alt="Imagen dentro del texto">`,
    image_alt: 'Imagen destacada', seo_title: 'Título SEO configurado', seo_description: 'Descripción SEO configurada',
    og_title: 'Título social configurado', og_description: 'Descripción social configurada', og_image_url: `${siteOrigin}/qa-photo.webp`,
    canonical_url: 'https://example.org/canonical', noindex: false, nofollow: true, schema_type: 'BlogPosting',
  };
  const post = { id: 'post', status: 'published', published_at: past, updated_at: past, created_at: past, author_name: 'Autor', reading_time_minutes: 2, featured_image_url: `${siteOrigin}/qa-photo.webp`, is_featured: false, allow_comments: false, series_id: null };
  const event = { id: 'event', status: 'published', attendance_mode: 'virtual', published_at: past, starts_at: future, ends_at: '2090-01-01T14:00:00.000Z', updated_at: past, timezone: 'America/Bogota', all_day: false, venue_id: null, organizer_name: 'SIGUE Network', registration_url: 'https://example.org/register', registration_deadline: null, is_free: true, currency: 'USD', capacity: null, show_virtual_url: false, featured_image_url: `${siteOrigin}/qa-photo.webp` };
  const dynamicForm = {
    id: '33333333-3333-4333-8333-333333333333', slug: 'qa-contacto', name: 'Contacto QA', status: 'published',
    title_es: 'Conversemos', title_en: 'Let’s talk', description_es: 'Formulario configurable', description_en: 'Configurable form',
    submit_label_es: 'Enviar mensaje', submit_label_en: 'Send message', success_message_es: 'Mensaje recibido.', success_message_en: 'Message received.',
    notification_emails: [], notification_subject: null, reply_to_field_key: 'correo', created_at: past, updated_at: past, created_by: null, updated_by: null,
  };
  const dynamicFields = [
    { id: 'field-name', form_id: dynamicForm.id, field_key: 'nombre', field_type: 'short_text', label_es: 'Nombre completo', label_en: 'Full name', placeholder_es: 'Tu nombre', placeholder_en: 'Your name', help_text_es: null, help_text_en: null, required: true, options: [], validation: { max_length: 120 }, conditional_logic: null, sort_order: 10, width: 50, created_at: past, updated_at: past },
    { id: 'field-email', form_id: dynamicForm.id, field_key: 'correo', field_type: 'email', label_es: 'Correo electrónico', label_en: 'Email address', placeholder_es: null, placeholder_en: null, help_text_es: null, help_text_en: null, required: true, options: [], validation: { max_length: 254 }, conditional_logic: null, sort_order: 20, width: 50, created_at: past, updated_at: past },
    { id: 'field-topic', form_id: dynamicForm.id, field_key: 'asunto', field_type: 'select', label_es: 'Asunto', label_en: 'Topic', placeholder_es: null, placeholder_en: null, help_text_es: null, help_text_en: null, required: true, options: [{ value: 'alianzas', label_es: 'Alianzas', label_en: 'Partnerships' }], validation: {}, conditional_logic: null, sort_order: 30, width: 100, created_at: past, updated_at: past },
  ];
  const tables = {
    blog_posts: [post, { ...post, id: 'draft-post', status: 'draft' }],
    blog_post_translations: [
      { ...translation, post_id: 'post', locale: 'es', slug: 'articulo-prueba' },
      { ...translation, post_id: 'post', locale: 'en', slug: 'test-article', noindex: true },
      { ...translation, post_id: 'draft-post', locale: 'es', slug: 'borrador' },
    ],
    events: [event, { ...event, id: 'past-event', starts_at: past, ends_at: past }, { ...event, id: 'draft-event', status: 'draft' }, { ...event, id: 'future-event', published_at: future }],
    event_translations: [
      { ...translation, event_id: 'event', locale: 'es', slug: 'evento-prueba', agenda_html: '<p>Agenda pública</p>' },
      { ...translation, event_id: 'event', locale: 'en', slug: 'test-event', noindex: true },
      { ...translation, event_id: 'draft-event', locale: 'es', slug: 'evento-borrador' },
      { ...translation, event_id: 'future-event', locale: 'es', slug: 'evento-futuro' },
      { ...translation, event_id: 'past-event', locale: 'es', slug: 'evento-pasado' },
    ],
    dynamic_forms: [dynamicForm], dynamic_form_fields: dynamicFields,
    dynamic_form_notifications: [], dynamic_form_submissions: [], dynamic_form_submission_attempts: [],
    blog_series: [], blog_series_translations: [], blog_post_tags: [], approved_blog_comments: [], blog_tags: [], blog_tag_translations: [], event_venues: [], public_event_access: [],
  };
  const requests = [];
  const server = createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    requests.push(url);
    if (url.pathname === '/rest/v1/rpc/submit_dynamic_form' && request.method === 'POST') {
      let body = '';
      request.setEncoding('utf8');
      request.on('data', (chunk) => { body += chunk; });
      request.on('end', () => {
        const payload = JSON.parse(body);
        if (payload.p_slug !== dynamicForm.slug || payload.p_answers?.nombre !== 'Sandra' || !/^[a-f0-9]{64}$/.test(payload.p_request_fingerprint)) {
          response.writeHead(422, { 'content-type': 'application/json' }).end(JSON.stringify({ message: 'Invalid QA submission' }));
          return;
        }
        response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify('44444444-4444-4444-8444-444444444444'));
      });
      return;
    }
    const table = url.pathname.split('/').pop();
    if (!(table in tables)) { response.writeHead(404).end('{}'); return; }
    let rows = tables[table].filter((row) => [...url.searchParams].every(([key, filter]) => {
      if (filter.startsWith('eq.')) return String(row[key]) === filter.slice(3);
      if (filter.startsWith('neq.')) return String(row[key]) !== filter.slice(4);
      if (filter.startsWith('in.(')) return filter.slice(4, -1).split(',').includes(String(row[key]));
      if (filter.startsWith('lte.')) return row[key] && row[key] <= filter.slice(4);
      return true;
    }));
    if (request.headers.accept?.includes('vnd.pgrst.object')) rows = rows[0] || null;
    response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(rows));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { server, requests, url: `http://127.0.0.1:${server.address().port}` };
}
