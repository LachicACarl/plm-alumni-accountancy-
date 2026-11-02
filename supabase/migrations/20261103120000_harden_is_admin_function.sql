-- Restrict the legacy admin predicate to authenticated callers.
-- The function returns only whether the current JWT user has an admin role;
-- anonymous callers do not need it, and Storage policies continue to use it
-- for authenticated administrator checks.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $function$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'head_admin')
  );
$function$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

comment on function public.is_admin() is
  'Returns whether the authenticated JWT user has admin or head_admin role. Not executable by anonymous users.';
