-- Validate structured public answers at the database boundary as well as in HTML.

create or replace function public.validate_dynamic_form_submission_values()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  field_row public.dynamic_form_fields%rowtype;
  answer jsonb;
  answer_text text;
begin
  for field_row in
    select * from public.dynamic_form_fields
    where form_id = new.form_id
    order by sort_order, created_at
  loop
    answer := new.answers -> field_row.field_key;
    if answer is null or answer = 'null'::jsonb then continue; end if;
    answer_text := case when jsonb_typeof(answer) = 'string' then answer #>> '{}' else null end;

    if field_row.field_type = 'url' and (
      answer_text is null or answer_text !~* '^https?://[^[:space:]]+$'
    ) then
      raise exception 'Invalid URL for field: %', field_row.field_key using errcode = '22023';
    end if;

    if field_row.field_type = 'date' and answer_text is not null and answer_text <> '' then
      if answer_text !~ '^\d{4}-\d{2}-\d{2}$' then
        raise exception 'Invalid date for field: %', field_row.field_key using errcode = '22023';
      end if;
      begin
        perform answer_text::date;
      exception when datetime_field_overflow then
        raise exception 'Invalid date for field: %', field_row.field_key using errcode = '22023';
      end;
    end if;

    if field_row.field_type = 'multiselect' and jsonb_typeof(answer) = 'array' then
      if jsonb_array_length(answer) > 100 then
        raise exception 'Too many options for field: %', field_row.field_key using errcode = '22023';
      end if;
      if (
        select count(*) <> count(distinct selected.value)
        from jsonb_array_elements_text(answer) selected(value)
      ) then
        raise exception 'Duplicate options for field: %', field_row.field_key using errcode = '22023';
      end if;
    end if;
  end loop;
  return new;
end;
$$;

drop trigger if exists dynamic_form_submission_validate_values on public.dynamic_form_submissions;
create trigger dynamic_form_submission_validate_values
before insert or update of answers, form_id on public.dynamic_form_submissions
for each row execute function public.validate_dynamic_form_submission_values();

revoke all on function public.validate_dynamic_form_submission_values() from public, anon, authenticated;
