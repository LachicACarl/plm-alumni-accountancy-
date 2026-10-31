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
    and p.graduation_year = (
      select own_profile.graduation_year
      from public.profiles own_profile
      where own_profile.id = (select auth.uid())
        and own_profile.role = 'alumni'
        and own_profile.account_status = 'active'
    )
  order by p.last_name asc, p.first_name asc;
$$;

revoke all on function public.list_active_batch_members(integer) from public, anon;
grant execute on function public.list_active_batch_members(integer) to authenticated;

-- Admins must be able to change alumni account status. Restrict alumni
-- self-service updates to the columns used by the profile editor; protected
-- identity, cohort, role, and account-status fields remain administrator-only.
revoke update on public.profiles from authenticated;
revoke update (id, student_number, email, graduation_year, role, account_status, created_at, updated_at)
  on public.profiles from authenticated;
grant update (first_name, middle_name, last_name, phone, address, profile_image_url, profession, company, bio)
  on public.profiles to authenticated;

-- Administrator-only status transition. Authenticated users share one SQL
-- role, so sensitive admin writes must go through this role-checking function
-- rather than restoring table-wide UPDATE to the browser role.
create or replace function public.set_alumni_account_status(
  p_alumni_id uuid,
  p_account_status text
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  affected_rows integer;
begin
  if not public.is_account_admin(auth.uid()) then
    raise insufficient_privilege using message = 'Administrator access required';
  end if;

  if p_account_status is null or p_account_status not in ('active', 'inactive') then
    raise invalid_parameter_value using message = 'Account status must be active or inactive';
  end if;

  update public.profiles
  set account_status = p_account_status
  where id = p_alumni_id
    and role = 'alumni';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise no_data_found using message = 'Alumni profile not found';
  end if;
end;
$function$;

revoke all on function public.set_alumni_account_status(uuid, text) from public, anon;
grant execute on function public.set_alumni_account_status(uuid, text) to authenticated;
drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Admins can update alumni profiles" on public.profiles;
create policy "Admins can update alumni profiles"
  on public.profiles for update to authenticated
  using ((select public.is_account_admin()))
  with check ((select public.is_account_admin()));

-- Intersect any pre-existing permissive profiles policies, including legacy
-- directory policies. Alumni directory access is provided through the safe RPC.
drop policy if exists "Active alumni profile boundary" on public.profiles;
create policy "Active alumni profile boundary"
  on public.profiles as restrictive for all to authenticated
  using (
    (select public.is_account_admin())
    or (
      id = (select auth.uid())
      and role = 'alumni'
      and account_status = 'active'
    )
  )
  with check (
    (select public.is_account_admin())
    or (
      id = (select auth.uid())
      and role = 'alumni'
      and account_status = 'active'
    )
  );

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
  with check (
    profile_id = (select auth.uid())
    and (select public.is_active_alumni())
    and status = 'pending'
    and verified_by is null
    and verified_at is null
  );

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

-- Alumni may read submitted files and upload new unique paths, but may not
-- overwrite or delete files after submission/verification. Only admins can
-- update or delete existing credential objects.
create policy "Active alumni read own credential files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'alumni-credentials'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_active_alumni())
  );

create policy "Active alumni upload own credential files"
  on storage.objects for insert to authenticated
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
