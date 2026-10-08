-- Replace the WordPress Contact Form 7 journeys that remain useful in SIGUE.
-- Existing editor-managed forms are left untouched.
with templates (slug, name, title_es, title_en, description_es, description_en, submit_es, submit_en, success_es, success_en) as (
  values
    ('membresia-solicitud', 'Solicitud de membresía SIGUE', 'Solicita la membresía', 'Apply for membership',
      'Cuéntanos sobre tu organización o proyecto. Revisaremos tu solicitud y te contactaremos.',
      'Tell us about your organization or project. We will review your application and contact you.',
      'Enviar solicitud', 'Submit application',
      'Recibimos tu solicitud de membresía. Nos comunicaremos contigo.',
      'We received your membership application. We will contact you.'),
    ('descarga-recursos', 'Solicitud de descarga', 'Solicita un recurso SIGUE', 'Request a SIGUE resource',
      'Comparte tus datos para que podamos atender tu solicitud de recursos.',
      'Share your details so we can respond to your resource request.',
      'Enviar solicitud', 'Send request',
      'Recibimos tu solicitud. Puedes descargar las herramientas desde la página de recursos.',
      'We received your request. You can download tools from the resources page.'),
    ('cumbre-reportar-pago', 'Reporte de transferencia Cumbre 2026', 'Reporta tu transferencia', 'Report your bank transfer',
      'Registra los datos de tu transferencia para que el equipo pueda verificarla. Este formulario no confirma un cupo ni procesa un pago.',
      'Share your transfer details so the team can verify them. This form does not confirm a place or process payment.',
      'Reportar pago', 'Report payment',
      'Recibimos tu reporte. El equipo confirmará tu inscripción después de verificar el pago.',
      'We received your report. The team will confirm your registration after verifying payment.')
), created as (
  insert into public.dynamic_forms (
    slug, name, status, title_es, title_en, description_es, description_en,
    submit_label_es, submit_label_en, success_message_es, success_message_en,
    notification_emails, notification_subject, reply_to_field_key
  )
  select slug, name, 'published', title_es, title_en, description_es, description_en,
    submit_es, submit_en, success_es, success_en,
    array['info@siguenetwork.org'], 'Nuevo envío desde {{form_name}}', 'correo'
  from templates
  on conflict (slug) do nothing
  returning id, slug
), fields (slug, field_key, field_type, label_es, label_en, required, sort_order, validation, options) as (
  values
    ('membresia-solicitud', 'nombre', 'short_text', 'Nombre completo del solicitante', 'Applicant full name', true, 10, '{"max_length":150}'::jsonb, '[]'::jsonb),
    ('membresia-solicitud', 'organizacion', 'short_text', 'Organización o proyecto social', 'Organization or social project', true, 20, '{"max_length":200}'::jsonb, '[]'::jsonb),
    ('membresia-solicitud', 'correo', 'email', 'Correo de contacto', 'Contact email', true, 30, '{"max_length":254}'::jsonb, '[]'::jsonb),
    ('membresia-solicitud', 'urls', 'long_text', 'Sitio web o redes sociales (opcional)', 'Website or social links (optional)', false, 40, '{"max_length":1000}'::jsonb, '[]'::jsonb),
    ('membresia-solicitud', 'pais_ciudad', 'short_text', 'País y ciudad de operación', 'Country and city of operation', true, 50, '{"max_length":180}'::jsonb, '[]'::jsonb),
    ('membresia-solicitud', 'acerca', 'select', '¿Cómo conociste SIGUE Network?', 'How did you hear about SIGUE Network?', false, 60, '{}'::jsonb, '[{"value":"redes","label_es":"Redes sociales","label_en":"Social media"},{"value":"recomendacion","label_es":"Recomendación de un amigo","label_en":"Friend recommendation"},{"value":"evento","label_es":"Evento o conferencia","label_en":"Event or conference"},{"value":"otros","label_es":"Otros","label_en":"Other"}]'::jsonb),
    ('membresia-solicitud', 'mision', 'long_text', 'Misión de la organización o proyecto', 'Organization or project mission', false, 70, '{"max_length":3000}'::jsonb, '[]'::jsonb),
    ('membresia-solicitud', 'consentimiento', 'consent', 'Acepto que SIGUE Network trate estos datos para responder a mi solicitud de membresía según su política de privacidad.', 'I agree that SIGUE Network may process this information to answer my membership application under its privacy policy.', true, 80, '{}'::jsonb, '[]'::jsonb),
    ('descarga-recursos', 'nombre', 'short_text', 'Nombre completo', 'Full name', true, 10, '{"max_length":150}'::jsonb, '[]'::jsonb),
    ('descarga-recursos', 'correo', 'email', 'Correo electrónico', 'Email address', true, 20, '{"max_length":254}'::jsonb, '[]'::jsonb),
    ('descarga-recursos', 'celular', 'phone', 'Celular', 'Phone', true, 30, '{"max_length":40}'::jsonb, '[]'::jsonb),
    ('descarga-recursos', 'recurso', 'short_text', 'Recurso solicitado', 'Requested resource', true, 40, '{"max_length":200}'::jsonb, '[]'::jsonb),
    ('descarga-recursos', 'consentimiento', 'consent', 'Acepto el tratamiento de estos datos para atender mi solicitud según la política de privacidad.', 'I agree to the processing of this information to answer my request under the privacy policy.', true, 50, '{}'::jsonb, '[]'::jsonb),
    ('cumbre-reportar-pago', 'nombre', 'short_text', 'Nombre completo del participante', 'Participant full name', true, 10, '{"max_length":150}'::jsonb, '[]'::jsonb),
    ('cumbre-reportar-pago', 'correo', 'email', 'Correo electrónico', 'Email address', true, 20, '{"max_length":254}'::jsonb, '[]'::jsonb),
    ('cumbre-reportar-pago', 'tarifa', 'select', 'Tarifa seleccionada', 'Selected rate', true, 30, '{}'::jsonb, '[{"value":"general","label_es":"General","label_en":"General"},{"value":"miembro","label_es":"Miembro Activo SIGUE","label_en":"Active SIGUE Member"},{"value":"diario","label_es":"Pase diario","label_en":"Day pass"}]'::jsonb),
    ('cumbre-reportar-pago', 'fecha', 'date', 'Fecha de la transferencia', 'Transfer date', true, 40, '{}'::jsonb, '[]'::jsonb),
    ('cumbre-reportar-pago', 'monto', 'number', 'Monto transferido en COP', 'Amount transferred in COP', true, 50, '{"min":1}'::jsonb, '[]'::jsonb),
    ('cumbre-reportar-pago', 'referencia', 'short_text', 'Referencia de la transacción', 'Transaction reference', true, 60, '{"max_length":150}'::jsonb, '[]'::jsonb),
    ('cumbre-reportar-pago', 'detalles', 'long_text', 'Día de asistencia o datos adicionales (opcional)', 'Attendance day or additional details (optional)', false, 70, '{"max_length":1000}'::jsonb, '[]'::jsonb),
    ('cumbre-reportar-pago', 'consentimiento', 'consent', 'Acepto el tratamiento de mis datos para verificar esta inscripción según la política de privacidad.', 'I agree to processing my information to verify this registration under the privacy policy.', true, 80, '{}'::jsonb, '[]'::jsonb)
)
insert into public.dynamic_form_fields (form_id, field_key, field_type, label_es, label_en, required, sort_order, validation, options)
select created.id, field_key, field_type, label_es, label_en, required, sort_order, validation, options
from created join fields using (slug);

-- Source IDs make historical Contact Form 7 imports repeatable without duplicating submissions.
create table if not exists public.legacy_form_submission_sources (
  id uuid primary key default gen_random_uuid(),
  source_system text not null default 'wordpress_flamingo',
  source_id text not null,
  source_form text not null,
  submission_id uuid not null unique references public.dynamic_form_submissions(id) on delete cascade,
  imported_at timestamptz not null default now(),
  unique (source_system, source_id)
);
alter table public.legacy_form_submission_sources enable row level security;
create policy "Admins read legacy form import history" on public.legacy_form_submission_sources
for select to authenticated using (public.is_admin());
grant select on public.legacy_form_submission_sources to authenticated;

-- Historical imports are records, not new inquiries. Never email them again.
create or replace function public.queue_dynamic_form_notification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare selected_form public.dynamic_forms%rowtype;
begin
  if new.source_path like 'wordpress://%' then
    return new;
  end if;
  select * into selected_form from public.dynamic_forms where id = new.form_id;
  if cardinality(selected_form.notification_emails) > 0 then
    insert into public.dynamic_form_notifications (submission_id, recipients, subject)
    values (
      new.id,
      selected_form.notification_emails,
      replace(coalesce(selected_form.notification_subject, 'Nuevo mensaje desde {{form_name}}'), '{{form_name}}', selected_form.name)
    );
  end if;
  return new;
end;
$$;
