-- RBAC for organization officers and homepage publishing.
-- Review and apply explicitly; this file is not applied to the connected production database.

-- Keep the role authorization logic in a non-exposed schema. SECURITY DEFINER is
-- restricted to this internal helper and EXECUTE is granted only to authenticated.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.has_content_management_role()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('org', 'admin', 'head_admin')
  );
$$;
revoke all on function private.has_content_management_role() from public, anon;
grant execute on function private.has_content_management_role() to authenticated;

create or replace function private.has_admin_role()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'head_admin')
  );
$$;
revoke all on function private.has_admin_role() from public, anon;
grant execute on function private.has_admin_role() to authenticated;

-- Permit the new organization role while preserving the existing account roles.
alter table public.profiles
  drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role = any (array['alumni'::text, 'admin'::text, 'head_admin'::text, 'org'::text]));

alter table public.homepage_content
  add column if not exists is_published boolean not null default true;

-- Events are public-readable; event mutations are limited to org and admins.
drop policy if exists "Public can read events" on public.events;
drop policy if exists "Organization and administrators manage events" on public.events;
create policy "Public can read events"
  on public.events for select to anon, authenticated
  using (true);
create policy "Organization and administrators manage events"
  on public.events for all to authenticated
  using ((select private.has_content_management_role()))
  with check ((select private.has_content_management_role()));

-- Credentials are visible and editable only to admin/head_admin. Preserve
-- alumni self-service SELECT/INSERT policies already in place.
drop policy if exists "Administrators can read credentials" on public.credentials;
drop policy if exists "Administrators can update credentials" on public.credentials;
create policy "Administrators can read credentials"
  on public.credentials for select to authenticated
  using ((select private.has_admin_role()));
create policy "Administrators can update credentials"
  on public.credentials for update to authenticated
  using ((select private.has_admin_role()))
  with check ((select private.has_admin_role()));

-- Public homepage row is visible only while published. Homepage managers can
-- read the draft row and update it; UPDATE needs an applicable SELECT policy.
drop policy if exists "Homepage content is publicly readable" on public.homepage_content;
drop policy if exists "Homepage managers can read content" on public.homepage_content;
drop policy if exists "Homepage managers can update content" on public.homepage_content;
drop policy if exists "Homepage managers can insert content" on public.homepage_content;
create policy "Homepage content is publicly readable"
  on public.homepage_content for select to anon, authenticated
  using (id = 'main' and is_published = true);
create policy "Homepage managers can read content"
  on public.homepage_content for select to authenticated
  using (id = 'main' and (select private.has_content_management_role()));
create policy "Homepage managers can update content"
  on public.homepage_content for update to authenticated
  using (id = 'main' and (select private.has_content_management_role()))
  with check (id = 'main' and (select private.has_content_management_role()));

-- Allow content editors to create the singleton row only if it does not exist.
create policy "Homepage managers can insert content"
  on public.homepage_content for insert to authenticated
  with check (id = 'main' and (select private.has_content_management_role()));

-- Event image reads stay public to serve image URLs. Organization officers and
-- administrators may upload, replace, and delete files in event-images.
drop policy if exists "Admins can upload event images" on storage.objects;
drop policy if exists "Admins can update event images" on storage.objects;
drop policy if exists "Admins can delete event images" on storage.objects;
drop policy if exists "Public can read event images" on storage.objects;
create policy "Public can read event images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'event-images');

drop policy if exists "Organization and administrators upload event images" on storage.objects;
drop policy if exists "Organization and administrators update event images" on storage.objects;
drop policy if exists "Organization and administrators delete event images" on storage.objects;
create policy "Organization and administrators upload event images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'event-images' and (select private.has_content_management_role()));
create policy "Organization and administrators update event images"
  on storage.objects for update to authenticated
  using (bucket_id = 'event-images' and (select private.has_content_management_role()))
  with check (bucket_id = 'event-images' and (select private.has_content_management_role()));
create policy "Organization and administrators delete event images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'event-images' and (select private.has_content_management_role()));
