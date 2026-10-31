-- Disposable PostgreSQL regression test for active/inactive alumni access.
-- Run after 20261030090000_add_alumni_account_status.sql and
-- 20261031140000_enforce_active_alumni_status.sql.

\set ON_ERROR_STOP on

create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key
);
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  role text not null default 'alumni',
  account_status text not null default 'active'
    check (account_status in ('active', 'inactive'))
);
alter table public.profiles enable row level security;

insert into auth.users(id) values
 ('00000000-0000-0000-0000-000000000001'),
 ('00000000-0000-0000-0000-000000000002'),
 ('00000000-0000-0000-0000-000000000003')
on conflict do nothing;

insert into public.profiles(id, role, account_status) values
 ('00000000-0000-0000-0000-000000000001', 'alumni', 'active'),
 ('00000000-0000-0000-0000-000000000002', 'alumni', 'inactive'),
 ('00000000-0000-0000-0000-000000000003', 'admin', 'active')
on conflict (id) do update set role = excluded.role, account_status = excluded.account_status;

grant usage on schema public, auth to authenticated;
grant execute on function auth.uid() to authenticated;
grant select, update on public.profiles to authenticated;

-- Impersonate the active alumnus. Own row is visible and editable.
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', false);
do $$
begin
  if (select count(*) from public.profiles) <> 1 then
    raise exception 'Active alumnus must see exactly their own row';
  end if;
  update public.profiles set account_status = 'inactive'
  where id = auth.uid();
  if not exists (select 1 from public.profiles where id = auth.uid() and account_status = 'active') then
    raise exception 'Alumnus must not be able to deactivate themselves';
  end if;
end;
$$;

-- Impersonate the inactive alumnus. Their row must be invisible and immutable.
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', false);
do $$
begin
  if exists (select 1 from public.profiles where id = auth.uid()) then
    raise exception 'Inactive alumnus must not read their own profile through the self-service policy';
  end if;
  update public.profiles set role = 'admin' where id = auth.uid();
  if exists (select 1 from public.profiles where id = auth.uid()) then
    raise exception 'Inactive alumnus must not update their profile';
  end if;
end;
$$;
reset role;
