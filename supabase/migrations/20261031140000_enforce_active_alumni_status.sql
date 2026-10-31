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

-- Restrict a user's own profile row. Other administrator policies, if present,
-- continue to allow the roles they explicitly authorize.
drop policy if exists "Active alumni can read own profile" on public.profiles;
create policy "Active alumni can read own profile"
  on public.profiles
  for select
  to authenticated
  using (
    id = (select auth.uid())
    and role = 'alumni'
    and account_status = 'active'
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

-- Expose one reusable predicate for policy definitions on alumni-owned tables.
-- Apply it only to authenticated alumni self-service policies. Admin policies
-- stay separate and retain their existing authorization conditions.
