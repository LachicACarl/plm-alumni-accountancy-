-- Enforce alumni account status at the database boundary.
-- SECURITY DEFINER helpers avoid recursive RLS evaluation on profiles.

create or replace function public.is_active_alumni(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.profiles
    where id = p_user_id
      and role = 'alumni'
      and account_status = 'active'
  );
$$;

create or replace function public.is_account_admin(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.profiles
    where id = p_user_id
      and role in ('admin', 'head_admin')
  );
$$;

revoke all on function public.is_active_alumni(uuid) from public, anon;
revoke all on function public.is_account_admin(uuid) from public, anon;
grant execute on function public.is_active_alumni(uuid) to authenticated;
grant execute on function public.is_account_admin(uuid) to authenticated;

drop policy if exists "Active alumni can read own profile" on public.profiles;
drop policy if exists "Active alumni or admins can read profiles" on public.profiles;
create policy "Active alumni or admins can read profiles"
  on public.profiles for select to authenticated
  using (
    (id = (select auth.uid()) and role = 'alumni' and account_status = 'active')
    or (select public.is_account_admin())
  );

drop policy if exists "Active alumni can update own profile" on public.profiles;
create policy "Active alumni can update own profile"
  on public.profiles for update to authenticated
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

-- Existing administrator policies are intentionally preserved. Policies for
-- credentials, achievements and Storage are not changed by this migration.
