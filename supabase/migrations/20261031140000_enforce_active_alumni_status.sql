-- Enforce the alumni account state at the database boundary.
-- Existing administrator policies remain additive; these policies only govern
-- the alumni self-service data surface and do not modify production directly.

create or replace function public.is_active_alumni()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'alumni'
      and account_status = 'active'
  );
$$;

revoke all on function public.is_active_alumni() from public, anon;
grant execute on function public.is_active_alumni() to authenticated;

-- Restrict profile access for alumni while retaining administrator access.
-- RLS policies are permissive by default, so combine the alumni condition
-- with explicit admin access. This avoids blocking an administrator's current
-- profile lookup and admin dashboard workflows.
drop policy if exists "Active alumni can read own profile" on public.profiles;
create policy "Active alumni or admins can read profiles"
  on public.profiles
  for select
  to authenticated
  using (
    (id = (select auth.uid()) and role = 'alumni' and account_status = 'active')
    or exists (
      select 1 from public.profiles admin_profile
      where admin_profile.id = (select auth.uid())
        and admin_profile.role in ('admin', 'head_admin')
    )
  );

drop policy if exists "Active alumni can update own profile" on public.profiles;
create policy "Active alumni can update own profile"
  on public.profiles
  for update
  to authenticated
  using (
    id = (select auth.uid())
    and role = 'alumni'
    and account_status = 'active'
  )
  with check (
    id = (select auth.uid())
    and role = 'alumni'
    and account_status = 'active'
  );

-- This migration deliberately does not replace existing policies on
-- credentials, achievements, Storage, or other alumni-owned resources.
-- Audit and extend those policies in a separate migration after confirming
-- their current role-specific rules.
