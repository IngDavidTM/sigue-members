-- Dynamic forms, protected submissions, and idempotent legacy imports.

create table public.dynamic_forms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  title_es text not null,
  title_en text not null,
  description_es text,
  description_en text,
  submit_label_es text not null default 'Enviar',
  submit_label_en text not null default 'Submit',
  success_message_es text not null default 'Gracias. Recibimos tu información.',
  success_message_en text not null default 'Thank you. We received your information.',
  notification_emails text[] not null default '{}',
  notification_subject text,
  reply_to_field_key text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dynamic_forms_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint dynamic_forms_notification_emails_limit check (cardinality(notification_emails) <= 10)
);

create table public.dynamic_form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.dynamic_forms(id) on delete cascade,
  field_key text not null,
  field_type text not null check (field_type in (
    'short_text', 'long_text', 'email', 'phone', 'number', 'date', 'url',
    'select', 'multiselect', 'radio', 'checkbox', 'consent'
  )),
  label_es text not null,
  label_en text not null,
  placeholder_es text,
  placeholder_en text,
  help_text_es text,
  help_text_en text,
  required boolean not null default false,
  options jsonb not null default '[]'::jsonb,
  validation jsonb not null default '{}'::jsonb,
  conditional_logic jsonb,
  sort_order integer not null default 0,
  width integer not null default 100 check (width in (25, 50, 75, 100)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (form_id, field_key),
  constraint dynamic_form_fields_key_format check (field_key ~ '^[a-z][a-z0-9_]*$'),
  constraint dynamic_form_fields_options_array check (jsonb_typeof(options) = 'array'),
  constraint dynamic_form_fields_validation_object check (jsonb_typeof(validation) = 'object'),
  constraint dynamic_form_fields_conditional_object check (conditional_logic is null or jsonb_typeof(conditional_logic) = 'object')
);

create table public.dynamic_form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.dynamic_forms(id) on delete restrict,
  locale text not null check (locale in ('es', 'en')),
  status text not null default 'new' check (status in ('new', 'read', 'archived', 'spam')),
  answers jsonb not null,
  source_path text,
  admin_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint dynamic_form_submissions_answers_object check (jsonb_typeof(answers) = 'object'),
  constraint dynamic_form_submissions_source_length check (source_path is null or length(source_path) <= 500)
);

create table public.legacy_content_sources (
  id uuid primary key default gen_random_uuid(),
  source_system text not null default 'wordpress',
  source_kind text not null check (source_kind in ('blog', 'event', 'media')),
  source_id text not null,
  source_url text not null,
  target_table text not null check (target_table in ('blog_posts', 'events', 'storage.objects')),
  target_id text not null,
  checksum text not null,
  source_payload jsonb,
  imported_at timestamptz not null default now(),
  unique (source_system, source_kind, source_id),
  unique (source_url)
);

create index dynamic_form_fields_order_idx on public.dynamic_form_fields(form_id, sort_order, created_at);
create index dynamic_form_submissions_inbox_idx on public.dynamic_form_submissions(form_id, status, created_at desc);
create index dynamic_form_submissions_answers_idx on public.dynamic_form_submissions using gin(answers);
create index legacy_content_target_idx on public.legacy_content_sources(target_table, target_id);

create trigger dynamic_forms_set_updated_at before update on public.dynamic_forms
for each row execute function public.set_updated_at();
create trigger dynamic_form_fields_set_updated_at before update on public.dynamic_form_fields
for each row execute function public.set_updated_at();

alter table public.dynamic_forms enable row level security;
alter table public.dynamic_form_fields enable row level security;
alter table public.dynamic_form_submissions enable row level security;
alter table public.legacy_content_sources enable row level security;

create policy "Published forms are public" on public.dynamic_forms
for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy "Admins manage forms" on public.dynamic_forms
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Published form fields are public" on public.dynamic_form_fields
for select to anon, authenticated using (
  exists (select 1 from public.dynamic_forms f where f.id = form_id and f.status = 'published')
  or public.is_admin()
);
create policy "Admins manage form fields" on public.dynamic_form_fields
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins read submissions" on public.dynamic_form_submissions
for select to authenticated using (public.is_admin());
create policy "Admins update submissions" on public.dynamic_form_submissions
for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins read import history" on public.legacy_content_sources
for select to authenticated using (public.is_admin());

grant select on public.dynamic_forms, public.dynamic_form_fields to anon, authenticated;
grant select, insert, update, delete on public.dynamic_forms, public.dynamic_form_fields to authenticated;
grant select, update on public.dynamic_form_submissions to authenticated;
grant select on public.legacy_content_sources to authenticated;

create or replace function public.submit_dynamic_form(
  p_slug text,
  p_locale text,
  p_answers jsonb,
  p_source_path text default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_form public.dynamic_forms%rowtype;
  field_row public.dynamic_form_fields%rowtype;
  answer jsonb;
  answer_text text;
  saved_id uuid;
  option_valid boolean;
begin
  if p_locale not in ('es', 'en') then
    raise exception 'Unsupported locale' using errcode = '22023';
  end if;
  if jsonb_typeof(p_answers) is distinct from 'object' then
    raise exception 'Answers must be an object' using errcode = '22023';
  end if;
  if pg_column_size(p_answers) > 65536 then
    raise exception 'Answers are too large' using errcode = '22001';
  end if;

  select * into selected_form
  from public.dynamic_forms
  where slug = p_slug and status = 'published';
  if not found then raise exception 'Form not found' using errcode = 'P0002'; end if;

  if exists (
    select 1 from jsonb_object_keys(p_answers) supplied(key)
    where not exists (
      select 1 from public.dynamic_form_fields f
      where f.form_id = selected_form.id and f.field_key = supplied.key
    )
  ) then
    raise exception 'Unknown field supplied' using errcode = '22023';
  end if;

  for field_row in
    select * from public.dynamic_form_fields where form_id = selected_form.id order by sort_order, created_at
  loop
    answer := p_answers -> field_row.field_key;
    answer_text := case when jsonb_typeof(answer) = 'string' then answer #>> '{}' else null end;

    if field_row.required and (
      answer is null or answer = 'null'::jsonb or answer_text = ''
      or (jsonb_typeof(answer) = 'array' and jsonb_array_length(answer) = 0)
      or (field_row.field_type in ('checkbox', 'consent') and answer <> 'true'::jsonb)
    ) then
      raise exception 'Required field missing: %', field_row.field_key using errcode = '23514';
    end if;
    if answer is null or answer = 'null'::jsonb or answer_text = '' then continue; end if;

    if field_row.field_type in ('short_text', 'long_text', 'email', 'phone', 'date', 'url', 'select', 'radio')
      and jsonb_typeof(answer) <> 'string' then
      raise exception 'Invalid value for field: %', field_row.field_key using errcode = '22023';
    end if;
    if field_row.field_type = 'number' and jsonb_typeof(answer) <> 'number' then
      raise exception 'Invalid number for field: %', field_row.field_key using errcode = '22023';
    end if;
    if field_row.field_type in ('checkbox', 'consent') and jsonb_typeof(answer) <> 'boolean' then
      raise exception 'Invalid checkbox for field: %', field_row.field_key using errcode = '22023';
    end if;
    if field_row.field_type = 'multiselect' and jsonb_typeof(answer) <> 'array' then
      raise exception 'Invalid multiple selection for field: %', field_row.field_key using errcode = '22023';
    end if;
    if answer_text is not null and length(answer_text) > coalesce((field_row.validation->>'max_length')::integer, 5000) then
      raise exception 'Field is too long: %', field_row.field_key using errcode = '22001';
    end if;
    if field_row.field_type = 'email' and answer_text !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
      raise exception 'Invalid email' using errcode = '22023';
    end if;
    if field_row.field_type in ('select', 'radio') then
      select exists (
        select 1 from jsonb_array_elements(field_row.options) option
        where option->>'value' = answer_text
      ) into option_valid;
      if not option_valid then raise exception 'Invalid option for field: %', field_row.field_key using errcode = '22023'; end if;
    end if;
    if field_row.field_type = 'multiselect' and exists (
      select 1 from jsonb_array_elements_text(answer) selected(value)
      where not exists (
        select 1 from jsonb_array_elements(field_row.options) option
        where option->>'value' = selected.value
      )
    ) then
      raise exception 'Invalid option for field: %', field_row.field_key using errcode = '22023';
    end if;
  end loop;

  insert into public.dynamic_form_submissions (form_id, locale, answers, source_path)
  values (selected_form.id, p_locale, p_answers, left(nullif(trim(p_source_path), ''), 500))
  returning id into saved_id;
  return saved_id;
end;
$$;

revoke all on function public.submit_dynamic_form(text, text, jsonb, text) from public;
grant execute on function public.submit_dynamic_form(text, text, jsonb, text) to anon, authenticated;

insert into public.dynamic_forms (
  id, slug, name, status, title_es, title_en, description_es, description_en,
  submit_label_es, submit_label_en, success_message_es, success_message_en,
  notification_emails, notification_subject, reply_to_field_key
) values (
  '11111111-1111-4111-8111-111111111111', 'contacto', 'Contacto general', 'published',
  'Conversemos', 'Let’s talk',
  'Cuéntanos cómo podemos ayudarte. Revisaremos tu mensaje y te responderemos pronto.',
  'Tell us how we can help. We will review your message and get back to you soon.',
  'Enviar mensaje', 'Send message',
  'Gracias por escribirnos. Recibimos tu mensaje correctamente.',
  'Thank you for contacting us. We received your message successfully.',
  array['info@siguenetwork.org'], 'Nuevo mensaje desde {{form_name}}', 'correo'
);

insert into public.dynamic_form_fields (
  form_id, field_key, field_type, label_es, label_en, placeholder_es, placeholder_en,
  help_text_es, help_text_en, required, options, validation, sort_order, width
) values
('11111111-1111-4111-8111-111111111111', 'nombre', 'short_text', 'Nombre completo', 'Full name', 'Tu nombre', 'Your name', null, null, true, '[]', '{"max_length":120}', 10, 50),
('11111111-1111-4111-8111-111111111111', 'correo', 'email', 'Correo electrónico', 'Email address', 'nombre@organizacion.org', 'name@organization.org', null, null, true, '[]', '{"max_length":254}', 20, 50),
('11111111-1111-4111-8111-111111111111', 'telefono', 'phone', 'Número de teléfono', 'Phone number', '+1 000 000 0000', '+1 000 000 0000', null, null, false, '[]', '{"max_length":40}', 30, 50),
('11111111-1111-4111-8111-111111111111', 'asunto', 'select', 'Asunto', 'Topic', null, null, null, null, true,
 '[{"value":"consultas","label_es":"Consultas generales","label_en":"General inquiries"},{"value":"academy","label_es":"Certificación SIGUE Academy","label_en":"SIGUE Academy certification"},{"value":"alianzas","label_es":"Colaboraciones y alianzas","label_en":"Collaborations and partnerships"},{"value":"prensa","label_es":"Prensa y medios","label_en":"Press and media"},{"value":"soporte","label_es":"Soporte técnico","label_en":"Technical support"},{"value":"otros","label_es":"Otros","label_en":"Other"}]', '{}', 40, 50),
('11111111-1111-4111-8111-111111111111', 'mensaje', 'long_text', 'Tu mensaje', 'Your message', 'Escribe aquí…', 'Write here…', null, null, true, '[]', '{"max_length":5000}', 50, 100);
