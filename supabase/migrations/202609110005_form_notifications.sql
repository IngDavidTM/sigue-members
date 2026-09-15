-- Durable email notification queue for form submissions.

create table public.dynamic_form_notifications (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.dynamic_form_submissions(id) on delete cascade,
  recipients text[] not null,
  subject text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  attempts integer not null default 0 check (attempts between 0 and 20),
  provider_id text,
  last_error text,
  attempted_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index dynamic_form_notifications_status_idx on public.dynamic_form_notifications(status, created_at);
alter table public.dynamic_form_notifications enable row level security;
create policy "Admins read form notifications" on public.dynamic_form_notifications
for select to authenticated using (public.is_admin());
create policy "Admins update form notifications" on public.dynamic_form_notifications
for update to authenticated using (public.is_admin()) with check (public.is_admin());
grant select, update on public.dynamic_form_notifications to authenticated;

create or replace function public.queue_dynamic_form_notification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare selected_form public.dynamic_forms%rowtype;
begin
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

create trigger dynamic_form_submission_queue_notification
after insert on public.dynamic_form_submissions
for each row execute function public.queue_dynamic_form_notification();
