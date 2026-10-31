-- Disposable PostgreSQL regression test for active/inactive alumni access.

\set ON_ERROR_STOP on
create schema if not exists auth;
create table if not exists auth.users (id uuid primary key);
create or replace function auth.uid()
returns uuid language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

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
on conflict (id) do update set role=excluded.role, account_status=excluded.account_status;

grant usage on schema public, auth to authenticated;
grant execute on function auth.uid() to authenticated;
grant select, update on public.profiles to authenticated;

set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', false);
do $$
begin
  if (select count(*) from public.profiles) <> 1 then
    raise exception 'Active alumnus must see only their own profile';
  end if;
  begin
    update public.profiles set account_status='inactive' where id=auth.uid();
    raise exception 'Active alumnus unexpectedly changed their own account status';
  exception
    when insufficient_privilege then
      null; -- Expected: WITH CHECK rejects a self-deactivation.
  end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', false);
do $$
begin
  if exists (select 1 from public.profiles where id=auth.uid()) then
    raise exception 'Inactive alumnus must not read their profile';
  end if;
  update public.profiles set role='admin' where id=auth.uid();
  if exists (select 1 from public.profiles where id=auth.uid()) then
    raise exception 'Inactive alumnus must not update their profile';
  end if;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000003', false);
do $$
begin
  if not exists (select 1 from public.profiles where id=auth.uid() and role='admin') then
    raise exception 'Administrator must retain profile read access';
  end if;
end $$;
reset role;
