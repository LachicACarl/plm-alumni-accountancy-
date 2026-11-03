-- Organization role: event and homepage content access only.
-- This migration is committed for review; do not apply to production without approval.

alter table public.homepage_content
  add column if not exists is_published boolean not null default true;

create or replace function public.is_org_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('org', 'admin', 'head_admin')
  );
$$;

create or replace function public.is_homepage_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('org', 'admin', 'head_admin')
  );
$$;

-- Events are public to read; only org officers and administrators can manage.
drop policy if exists "Public can read events" on public.events;
drop policy if exists "Organization and administrators manage events" on public.events;
create policy "Public can read events"
  on public.events for select
  to anon, authenticated
  using (true);
create policy "Organization and administrators manage events"
  on public.events for all
  to authenticated
  using (public.is_org_or_admin())
  with check (public.is_org_or_admin());

-- Credential records remain administrator-only.
drop policy if exists "Administrators can read credentials" on public.credentials;
drop policy if exists "Administrators can update credentials" on public.credentials;
create policy "Administrators can read credentials"
  on public.credentials for select
  to authenticated
  using (public.is_account_admin());
create policy "Administrators can update credentials"
  on public.credentials for update
  to authenticated
  using (public.is_account_admin())
  with check (public.is_account_admin());

-- Homepage content is readable publicly only when published; admins and org can edit.
drop policy if exists "Homepage content is publicly readable" on public.homepage_content;
drop policy if exists "Homepage managers can update content" on public.homepage_content;
drop policy if exists "Homepage managers can insert content" on public.homepage_content;
create policy "Homepage content is publicly readable"
  on public.homepage_content for select
  to anon, authenticated
  using (id = 'main' and is_published = true);
create policy "Homepage managers can update content"
  on public.homepage_content for update
  to authenticated
  using (public.is_org_or_admin())
  with check (public.is_org_or_admin());
create policy "Homepage managers can insert content"
  on public.homepage_content for insert
  to authenticated
  with check (public.is_org_or_admin());

-- Event image uploads are permitted to org and administrators only.
drop policy if exists "Organization and administrators upload event images" on storage.objects;
drop policy if exists "Organization and administrators update event images" on storage.objects;
drop policy if exists "Organization and administrators delete event images" on storage.objects;
create policy "Organization and administrators upload event images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'event-images' and public.is_org_or_admin());
create policy "Organization and administrators update event images"
  on storage.objects for update to authenticated
  using (bucket_id = 'event-images' and public.is_org_or_admin())
  with check (bucket_id = 'event-images' and public.is_org_or_admin());
create policy "Organization and administrators delete event images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'event-images' and public.is_org_or_admin());
