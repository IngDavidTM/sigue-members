-- Save a form and its ordered field definition in one transaction.

create or replace function public.save_dynamic_form(
  p_id uuid,
  p_record jsonb,
  p_fields jsonb,
  p_expected_updated_at timestamptz
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_id uuid;
  existing public.dynamic_forms%rowtype;
  incoming public.dynamic_forms%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if jsonb_typeof(p_fields) is distinct from 'array' or jsonb_array_length(p_fields) > 100 then
    raise exception 'Invalid form fields' using errcode = '23514';
  end if;
  if p_id is not null then
    select * into existing from public.dynamic_forms where id = p_id for update;
    if not found then raise exception 'Form no longer exists' using errcode = 'P0002'; end if;
    if p_expected_updated_at is null or existing.updated_at <> p_expected_updated_at then
      raise exception 'Form changed since it was opened' using errcode = '40001';
    end if;
  end if;

  incoming := jsonb_populate_record(null::public.dynamic_forms, p_record);
  if p_id is null then
    insert into public.dynamic_forms (
      slug, name, status, title_es, title_en, description_es, description_en,
      submit_label_es, submit_label_en, success_message_es, success_message_en,
      notification_emails, notification_subject, reply_to_field_key, created_by, updated_by
    ) values (
      incoming.slug, incoming.name, incoming.status, incoming.title_es, incoming.title_en,
      incoming.description_es, incoming.description_en, incoming.submit_label_es,
      incoming.submit_label_en, incoming.success_message_es, incoming.success_message_en,
      incoming.notification_emails, incoming.notification_subject, incoming.reply_to_field_key,
      auth.uid(), auth.uid()
    ) returning id into saved_id;
  else
    update public.dynamic_forms set
      slug = incoming.slug, name = incoming.name, status = incoming.status,
      title_es = incoming.title_es, title_en = incoming.title_en,
      description_es = incoming.description_es, description_en = incoming.description_en,
      submit_label_es = incoming.submit_label_es, submit_label_en = incoming.submit_label_en,
      success_message_es = incoming.success_message_es, success_message_en = incoming.success_message_en,
      notification_emails = incoming.notification_emails,
      notification_subject = incoming.notification_subject,
      reply_to_field_key = incoming.reply_to_field_key,
      updated_by = auth.uid()
    where id = p_id returning id into saved_id;
  end if;

  delete from public.dynamic_form_fields where form_id = saved_id;
  insert into public.dynamic_form_fields (
    form_id, field_key, field_type, label_es, label_en, placeholder_es, placeholder_en,
    help_text_es, help_text_en, required, options, validation, conditional_logic, sort_order, width
  )
  select
    saved_id, f.field_key, f.field_type, f.label_es, f.label_en, f.placeholder_es,
    f.placeholder_en, f.help_text_es, f.help_text_en, f.required, f.options,
    f.validation, f.conditional_logic, f.sort_order, f.width
  from jsonb_populate_recordset(null::public.dynamic_form_fields, p_fields) f;

  if incoming.reply_to_field_key is not null and not exists (
    select 1 from public.dynamic_form_fields
    where form_id = saved_id and field_key = incoming.reply_to_field_key and field_type = 'email'
  ) then
    raise exception 'Reply-to field must be an email field' using errcode = '23514';
  end if;

  return saved_id;
end;
$$;

revoke all on function public.save_dynamic_form(uuid, jsonb, jsonb, timestamptz) from public, anon;
grant execute on function public.save_dynamic_form(uuid, jsonb, jsonb, timestamptz) to authenticated;
