-- Keep anonymous policies independent from the authenticated-only is_admin function.

drop policy if exists "Published forms are public" on public.dynamic_forms;
create policy "Published forms are public" on public.dynamic_forms
for select to anon, authenticated using (status = 'published');

drop policy if exists "Published form fields are public" on public.dynamic_form_fields;
create policy "Published form fields are public" on public.dynamic_form_fields
for select to anon, authenticated using (
  exists (select 1 from public.dynamic_forms f where f.id = form_id and f.status = 'published')
);
