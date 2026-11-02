-- Verify the hardened is_admin() function's execution grants and behavior.
create role anon nologin;
create role authenticated nologin;
create schema auth;
create or replace function auth.uid() returns uuid
language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

create table public.profiles (
  id uuid primary key,
  role text not null
);
insert into public.profiles (id, role) values
  ('00000000-0000-0000-0000-000000000001', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'alumni');

grant usage on schema public, auth to anon, authenticated;
grant select on public.profiles to authenticated;
grant execute on function auth.uid() to authenticated;

\i supabase/migrations/20261103120000_harden_is_admin_function.sql

do $$
begin
  if has_function_privilege('anon', 'public.is_admin()', 'EXECUTE') then
    raise exception 'anon must not execute public.is_admin()';
  end if;
  if not has_function_privilege('authenticated', 'public.is_admin()', 'EXECUTE') then
    raise exception 'authenticated must execute public.is_admin()';
  end if;
end;
$$;

begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
do $$
begin
  if not public.is_admin() then
    raise exception 'admin JWT must return true';
  end if;
end;
$$;
rollback;

begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
do $$
begin
  if public.is_admin() then
    raise exception 'alumni JWT must return false';
  end if;
end;
$$;
rollback;

select 'is_admin ACL and behavior checks passed' as result;
