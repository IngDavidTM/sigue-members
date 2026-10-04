-- Editable lead-capture forms for existing public journeys.
-- Existing forms are never overwritten; apply before deploying the matching UI.
with templates (slug, name, title_es, title_en, description_es, description_en, submit_es, submit_en, success_es, success_en) as (
  values
    ('novedades', 'Novedades SIGUE', 'Recibe nuestras novedades', 'Get SIGUE updates',
      'Comparte tu correo para recibir noticias e invitaciones de SIGUE Network.',
      'Share your email to receive SIGUE Network news and invitations.',
      'Quiero recibir novedades', 'Send me updates',
      'Gracias. Registramos tu interés en recibir novedades.',
      'Thank you. We recorded your interest in receiving updates.'),
    ('voluntariado-interes', 'Interés en voluntariado', 'Conversemos sobre voluntariado', 'Let’s talk about volunteering',
      'Cuéntanos cómo te gustaría servir. Esta consulta no reemplaza la solicitud formal de voluntariado.',
      'Tell us how you would like to serve. This inquiry does not replace the formal volunteer application.',
      'Enviar mi interés', 'Send my interest',
      'Gracias. Recibimos tu interés y nos pondremos en contacto contigo.',
      'Thank you. We received your interest and will get in touch.'),
    ('membresia-interes', 'Interés en membresía', 'Conoce la membresía SIGUE', 'Learn about SIGUE membership',
      'Déjanos tus datos para conocer más. Esta consulta no es una solicitud de membresía.',
      'Leave your details to learn more. This inquiry is not a membership application.',
      'Solicitar información', 'Request information',
      'Gracias. Recibimos tu consulta sobre la membresía.',
      'Thank you. We received your membership inquiry.'),
    ('cumbre-alianzas', 'Alianzas Cumbre 2026', 'Conversemos sobre alianzas para la Cumbre', 'Let’s discuss Summit partnerships',
      'Si te interesa apoyar o patrocinar la Cumbre, comparte tus datos. Este formulario no inscribe ni reserva entradas.',
      'If you are interested in supporting or sponsoring the Summit, share your details. This form does not register or reserve tickets.',
      'Quiero conversar', 'Contact me',
      'Gracias. Recibimos tu interés en apoyar la Cumbre.',
      'Thank you. We received your interest in supporting the Summit.')
), created as (
  insert into public.dynamic_forms (
    slug, name, status, title_es, title_en, description_es, description_en,
    submit_label_es, submit_label_en, success_message_es, success_message_en,
    notification_emails, notification_subject, reply_to_field_key
  )
  select slug, name, 'published', title_es, title_en, description_es, description_en,
    submit_es, submit_en, success_es, success_en,
    array['info@siguenetwork.org'], 'Nuevo interés desde {{form_name}}', 'correo'
  from templates
  on conflict (slug) do nothing
  returning id, slug
), field_templates (slug, field_key, field_type, label_es, label_en, required, sort_order, validation) as (
  values
    ('novedades', 'correo', 'email', 'Correo electrónico', 'Email address', true, 10, '{"max_length":254}'::jsonb),
    ('novedades', 'consentimiento', 'consent', 'Acepto que SIGUE Network me contacte con novedades e invitaciones.', 'I agree to be contacted by SIGUE Network with news and invitations.', true, 20, '{}'::jsonb),
    ('voluntariado-interes', 'nombre', 'short_text', 'Nombre completo', 'Full name', true, 10, '{"max_length":150}'::jsonb),
    ('voluntariado-interes', 'correo', 'email', 'Correo electrónico', 'Email address', true, 20, '{"max_length":254}'::jsonb),
    ('voluntariado-interes', 'interes', 'long_text', '¿Cómo te gustaría colaborar?', 'How would you like to help?', true, 30, '{"max_length":1000}'::jsonb),
    ('voluntariado-interes', 'consentimiento', 'consent', 'Acepto que SIGUE Network me contacte sobre voluntariado.', 'I agree to be contacted by SIGUE Network about volunteering.', true, 40, '{}'::jsonb),
    ('membresia-interes', 'nombre', 'short_text', 'Nombre completo', 'Full name', true, 10, '{"max_length":150}'::jsonb),
    ('membresia-interes', 'correo', 'email', 'Correo electrónico', 'Email address', true, 20, '{"max_length":254}'::jsonb),
    ('membresia-interes', 'organizacion', 'short_text', 'Organización (opcional)', 'Organization (optional)', false, 30, '{"max_length":150}'::jsonb),
    ('membresia-interes', 'consentimiento', 'consent', 'Acepto que SIGUE Network me contacte sobre membresía.', 'I agree to be contacted by SIGUE Network about membership.', true, 40, '{}'::jsonb),
    ('cumbre-alianzas', 'nombre', 'short_text', 'Nombre completo', 'Full name', true, 10, '{"max_length":150}'::jsonb),
    ('cumbre-alianzas', 'correo', 'email', 'Correo electrónico', 'Email address', true, 20, '{"max_length":254}'::jsonb),
    ('cumbre-alianzas', 'organizacion', 'short_text', 'Organización (opcional)', 'Organization (optional)', false, 30, '{"max_length":150}'::jsonb),
    ('cumbre-alianzas', 'mensaje', 'long_text', '¿Cómo te gustaría apoyar la Cumbre?', 'How would you like to support the Summit?', true, 40, '{"max_length":1000}'::jsonb),
    ('cumbre-alianzas', 'consentimiento', 'consent', 'Acepto que SIGUE Network me contacte sobre alianzas para la Cumbre.', 'I agree to be contacted by SIGUE Network about Summit partnerships.', true, 50, '{}'::jsonb)
)
insert into public.dynamic_form_fields (
  form_id, field_key, field_type, label_es, label_en, required, sort_order, validation
)
select created.id, field_key, field_type, label_es, label_en, required, sort_order, validation
from created join field_templates using (slug);
