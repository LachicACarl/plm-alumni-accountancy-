-- Complete inactive-alumni data boundaries for credentials, achievements and Storage.
-- Keep batch-member directory access through a narrowly scoped SECURITY DEFINER RPC.

create or replace function public.list_active_batch_members(p_graduation_year integer)
returns table (
  id uuid,
  first_name text,
  middle_name text,
  last_name text,
  graduation_year integer,
  profession text,
  company text,
  profile_image_url text
)
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select p.id, p.first_name, p.middle_name, p.last_name,
         p.graduation_year, p.profession, p.company, p.profile_image_url
  from public.profiles p
  where public.is_active_alumni((select auth.uid()))
    and p.role = 'alumni'
    and p.account_status = 'active'
    and p.graduation_year = p_graduation_year
  order by p.last_name asc, p.first_name asc;
$$;

revoke all on function public.list_active_batch_members(integer) from public, anon;
grant execute on function public.list_active_batch_members(integer) to authenticated;

-- Admins must be able to change alumni account status. Alumni may edit only
-- their own active profile; the existing self-update policy remains in place.
drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Admins can update alumni profiles" on public.profiles;
create policy "Admins can update alumni profiles"
  on public.profiles for update to authenticated
  using ((select public.is_account_admin()))
  with check ((select public.is_account_admin()));

-- Credentials: preserve self-service for active alumni and allow admins to
-- review/manage records. The RESTRICTIVE boundary also intersects older,
-- broader permissive policies that may already exist in deployed projects.
alter table public.credentials enable row level security;
drop policy if exists "Active alumni can read own credentials" on public.credentials;
drop policy if exists "Admins can read credentials" on public.credentials;
drop policy if exists "Admins can manage credentials" on public.credentials;
drop policy if exists "Alumni can upload own credentials" on public.credentials;
drop policy if exists "Active alumni credential boundary" on public.credentials;

create policy "Active alumni can read own credentials"
  on public.credentials for select to authenticated
  using (profile_id = (select auth.uid()) and (select public.is_active_alumni()));

create policy "Active alumni can upload own credentials"
  on public.credentials for insert to authenticated
  with check (profile_id = (select auth.uid()) and (select public.is_active_alumni()));

create policy "Admins can read credentials"
  on public.credentials for select to authenticated
  using ((select public.is_account_admin()));

create policy "Admins can manage credentials"
  on public.credentials for update to authenticated
  using ((select public.is_account_admin()))
  with check ((select public.is_account_admin()));

create policy "Active alumni credential boundary"
  on public.credentials as restrictive for all to authenticated
  using (
    (select public.is_account_admin())
    or (profile_id = (select auth.uid()) and (select public.is_active_alumni()))
  )
  with check (
    (select public.is_account_admin())
    or (profile_id = (select auth.uid()) and (select public.is_active_alumni()))
  );

-- Achievements are currently rendered from static frontend data, but the
-- table exists in the schema. Protect owner reads and admin review now so
-- future DB-backed use cannot bypass account_status.
alter table public.achievements enable row level security;
drop policy if exists "Active alumni can read own achievements" on public.achievements;
drop policy if exists "Admins can read achievements" on public.achievements;
drop policy if exists "Active alumni achievement boundary" on public.achievements;

create policy "Active alumni can read own achievements"
  on public.achievements for select to authenticated
  using (profile_id = (select auth.uid()) and (select public.is_active_alumni()));

create policy "Admins can read achievements"
  on public.achievements for select to authenticated
  using ((select public.is_account_admin()));

create policy "Active alumni achievement boundary"
  on public.achievements as restrictive for all to authenticated
  using (
    (select public.is_account_admin())
    or (profile_id = (select auth.uid()) and (select public.is_active_alumni()))
  )
  with check (
    (select public.is_account_admin())
    or (profile_id = (select auth.uid()) and (select public.is_active_alumni()))
  );

-- Private credential files: only their active owner or an administrator can
-- read/write paths in the alumni-credentials bucket. Restrictive policy
-- intersects any pre-existing permissive Storage policy.
alter table storage.objects enable row level security;
drop policy if exists "Active alumni manage own credential files" on storage.objects;
drop policy if exists "Admins manage alumni credential files" on storage.objects;
drop policy if exists "Active alumni credential storage boundary" on storage.objects;

create policy "Active alumni manage own credential files"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'alumni-credentials'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_active_alumni())
  )
  with check (
    bucket_id = 'alumni-credentials'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_active_alumni())
  );

create policy "Admins manage alumni credential files"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'alumni-credentials'
    and (select public.is_account_admin())
  )
  with check (
    bucket_id = 'alumni-credentials'
    and (select public.is_account_admin())
  );

create policy "Active alumni credential storage boundary"
  on storage.objects as restrictive for all to authenticated
  using (
    bucket_id <> 'alumni-credentials'
    or (select public.is_account_admin())
    or (
      (storage.foldername(name))[1] = (select auth.uid())::text
      and (select public.is_active_alumni())
    )
  )
  with check (
    bucket_id <> 'alumni-credentials'
    or (select public.is_account_admin())
    or (
      (storage.foldername(name))[1] = (select auth.uid())::text
      and (select public.is_active_alumni())
    )
  );
