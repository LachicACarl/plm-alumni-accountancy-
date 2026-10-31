-- Disposable PostgreSQL regression test for active/inactive alumni access.
\set ON_ERROR_STOP on

create schema if not exists auth;
create schema if not exists storage;
create table if not exists auth.users (id uuid primary key);
create or replace function auth.uid()
returns uuid language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create or replace function storage.foldername(name text)
returns text[] language sql immutable
as $fn$ select (string_to_array(name, '/'))[1:1] $fn$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  role text not null default 'alumni',
  account_status text not null default 'active'
    check (account_status in ('active', 'inactive')),
  student_number text unique,
  first_name text not null default '',
  middle_name text,
  last_name text not null default '',
  email text unique,
  phone text,
  address text,
  graduation_year integer,
  profile_image_url text,
  profession text,
  company text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.credentials (
  id uuid primary key,
  profile_id uuid not null references public.profiles(id),
  credential_type text not null,
  file_url text not null,
  status text not null default 'pending'
);
create table if not exists public.achievements (
  id uuid primary key,
  profile_id uuid not null references public.profiles(id),
  title text not null
);
create table if not exists storage.objects (
  id uuid primary key,
  bucket_id text not null,
  name text not null
);
alter table public.profiles enable row level security;
alter table public.credentials enable row level security;
alter table public.achievements enable row level security;
alter table storage.objects enable row level security;

insert into auth.users(id) values
 ('00000000-0000-0000-0000-000000000001'),
 ('00000000-0000-0000-0000-000000000002'),
 ('00000000-0000-0000-0000-000000000003'),
 ('00000000-0000-0000-0000-000000000004')
on conflict do nothing;
insert into public.profiles(id, role, account_status, first_name, last_name, graduation_year)
values
 ('00000000-0000-0000-0000-000000000001', 'alumni', 'active', 'Active', 'One', 2024),
 ('00000000-0000-0000-0000-000000000002', 'alumni', 'inactive', 'Inactive', 'Two', 2024),
 ('00000000-0000-0000-0000-000000000003', 'admin', 'active', 'Admin', 'User', 2020),
 ('00000000-0000-0000-0000-000000000004', 'alumni', 'active', 'Active', 'Four', 2024)
on conflict (id) do update set role=excluded.role,
  account_status=excluded.account_status, first_name=excluded.first_name,
  last_name=excluded.last_name, graduation_year=excluded.graduation_year;

insert into public.credentials(id, profile_id, credential_type, file_url) values
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Academic','00000000-0000-0000-0000-000000000001/active.pdf'),
 ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','Academic','00000000-0000-0000-0000-000000000002/inactive.pdf');
insert into public.achievements(id, profile_id, title) values
 ('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Active achievement'),
 ('20000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','Inactive achievement');
insert into storage.objects(id,bucket_id,name) values
 ('30000000-0000-0000-0000-000000000001','alumni-credentials','00000000-0000-0000-0000-000000000001/active.pdf'),
 ('30000000-0000-0000-0000-000000000002','alumni-credentials','00000000-0000-0000-0000-000000000002/inactive.pdf');

grant usage on schema public, auth, storage to authenticated;
grant execute on function auth.uid() to authenticated;
grant execute on function storage.foldername(text) to authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.credentials, public.achievements, storage.objects to authenticated;

-- Simulate older broad permissive policies to prove the restrictive guards
-- still stop inactive accounts even when legacy policies remain installed.
create policy "test legacy profiles read" on public.profiles for select to authenticated using (true);
create policy "test legacy profiles update" on public.profiles for update to authenticated using (true) with check (true);
create policy "test legacy credentials access" on public.credentials for all to authenticated using (true) with check (true);
create policy "test legacy achievements access" on public.achievements for all to authenticated using (true) with check (true);
create policy "test legacy storage access" on storage.objects for all to authenticated using (true) with check (true);

\i supabase/migrations/20261031140000_enforce_active_alumni_status.sql
\i supabase/migrations/20261031150000_enforce_active_alumni_resource_access.sql

set role authenticated;
do $$
begin
  if not has_table_privilege('authenticated', 'public.profiles', 'SELECT') then
    raise exception 'Authenticated role must retain profile SELECT';
  end if;
  if has_table_privilege('authenticated', 'public.profiles', 'UPDATE') then
    raise exception 'Alumni must not retain table-wide UPDATE on profiles';
  end if;
  if not has_column_privilege('authenticated', 'public.profiles', 'first_name', 'UPDATE')
     or not has_column_privilege('authenticated', 'public.profiles', 'phone', 'UPDATE')
     or not has_column_privilege('authenticated', 'public.profiles', 'bio', 'UPDATE') then
    raise exception 'Alumni must retain intended editable profile column privileges';
  end if;
  if has_column_privilege('authenticated', 'public.profiles', 'id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.profiles', 'student_number', 'UPDATE')
     or has_column_privilege('authenticated', 'public.profiles', 'email', 'UPDATE')
     or has_column_privilege('authenticated', 'public.profiles', 'graduation_year', 'UPDATE')
     or has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE')
     or has_column_privilege('authenticated', 'public.profiles', 'account_status', 'UPDATE')
     or has_column_privilege('authenticated', 'public.profiles', 'created_at', 'UPDATE')
     or has_column_privilege('authenticated', 'public.profiles', 'updated_at', 'UPDATE') then
    raise exception 'Alumni must not update protected profile columns';
  end if;
end $$;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', false);
do $$
begin
  begin
    perform public.set_alumni_account_status(
      '00000000-0000-0000-0000-000000000002',
      'active'
    );
    raise exception 'Active alumnus unexpectedly invoked the administrator status RPC';
  exception when insufficient_privilege then
    null;
  end;
end $$;
do $$
begin
  if (select count(*) from public.profiles) <> 1 then
    raise exception 'Active alumnus must see own profile only through profiles table';
  end if;
  if (select count(*) from public.credentials) <> 1 then
    raise exception 'Active alumnus must read own credential';
  end if;
  if (select count(*) from public.achievements) <> 1 then
    raise exception 'Active alumnus must read own achievement';
  end if;
  if (select count(*) from storage.objects where bucket_id='alumni-credentials') <> 1 then
    raise exception 'Active alumnus must read own credential storage object';
  end if;
  if (select count(*) from public.list_active_batch_members(2024)) <> 2 then
    raise exception 'Batch directory must return active batch members only';
  end if;
  if exists (select 1 from public.list_active_batch_members(2025)) then
    raise exception 'Active alumnus must not read a different graduation cohort';
  end if;
  begin
    update public.profiles set account_status='inactive' where id=auth.uid();
    raise exception 'Active alumnus unexpectedly changed their own account status';
  exception when insufficient_privilege then
    null;
  end;
  begin
    update public.profiles set graduation_year=2025 where id=auth.uid();
    raise exception 'Active alumnus unexpectedly changed their graduation year';
  exception when insufficient_privilege then
    null;
  end;
  begin
    update public.profiles set student_number='CHANGED-BY-ALUMNI' where id=auth.uid();
    raise exception 'Active alumnus unexpectedly changed their student number';
  exception when insufficient_privilege then
    null;
  end;
  begin
    insert into public.credentials(id,profile_id,credential_type,file_url)
    values ('10000000-0000-0000-0000-000000000003',auth.uid(),'Academic',auth.uid()::text||'/new.pdf');
    -- The active owner is allowed to upload; reaching here is expected.
  exception when others then
    raise exception 'Active alumnus could not upload own credential: %', SQLERRM;
  end;
  begin
    insert into public.credentials(id,profile_id,credential_type,file_url,status,verified_by,verified_at)
    values ('10000000-0000-0000-0000-000000000005',auth.uid(),'Academic',auth.uid()::text||'/forged.pdf','verified',auth.uid(),now());
    raise exception 'Active alumnus unexpectedly self-verified a credential';
  exception when insufficient_privilege then
    null;
  end;
  declare
    affected_rows integer;
  begin
    update public.credentials
    set status='verified', verified_by=auth.uid(), verified_at=now()
    where id='10000000-0000-0000-0000-000000000001';
    get diagnostics affected_rows = row_count;
    if affected_rows <> 0 then
      raise exception 'Active alumnus unexpectedly updated a credential record';
    end if;
  end;
  declare
    affected_rows integer;
  begin
    delete from public.credentials
    where id='10000000-0000-0000-0000-000000000001';
    get diagnostics affected_rows = row_count;
    if affected_rows <> 0 then
      raise exception 'Active alumnus unexpectedly deleted a credential record';
    end if;
  end;
  begin
    insert into storage.objects(id,bucket_id,name)
    values ('30000000-0000-0000-0000-000000000004','alumni-credentials',auth.uid()::text||'/active-upload.pdf');
  exception when others then
    raise exception 'Active alumnus could not upload own credential file: %', SQLERRM;
  end;
  declare
    affected_rows integer;
  begin
    update storage.objects set name=auth.uid()::text||'/tampered.pdf'
    where id='30000000-0000-0000-0000-000000000001';
    get diagnostics affected_rows = row_count;
    if affected_rows <> 0 then
      raise exception 'Active alumnus unexpectedly replaced an existing credential file';
    end if;
  end;
  declare
    affected_rows integer;
  begin
    delete from storage.objects
    where id='30000000-0000-0000-0000-000000000001';
    get diagnostics affected_rows = row_count;
    if affected_rows <> 0 then
      raise exception 'Active alumnus unexpectedly deleted an existing credential file';
    end if;
  end;
  declare
    affected_rows integer;
  begin
    delete from storage.objects
    where id='30000000-0000-0000-0000-000000000004';
    get diagnostics affected_rows = row_count;
    if affected_rows <> 1 then
      raise exception 'Active alumnus must be able to clean up an unlinked failed upload';
    end if;
  end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', false);
do $$
begin
  if exists (select 1 from public.profiles where id=auth.uid()) then
    raise exception 'Inactive alumnus must not read own profile';
  end if;
  if exists (select 1 from public.credentials where profile_id=auth.uid()) then
    raise exception 'Inactive alumnus must not read own credentials';
  end if;
  if exists (select 1 from public.achievements where profile_id=auth.uid()) then
    raise exception 'Inactive alumnus must not read own achievements';
  end if;
  if exists (select 1 from storage.objects where bucket_id='alumni-credentials') then
    raise exception 'Inactive alumnus must not read own credential files';
  end if;
  if exists (select 1 from public.list_active_batch_members(2024) where id=auth.uid()) then
    raise exception 'Inactive alumnus must not use batch directory';
  end if;
  begin
    insert into public.credentials(id,profile_id,credential_type,file_url)
    values ('10000000-0000-0000-0000-000000000004',auth.uid(),'Academic',auth.uid()::text||'/blocked.pdf');
    raise exception 'Inactive alumnus unexpectedly inserted a credential';
  exception when insufficient_privilege then
    null;
  end;
  begin
    insert into storage.objects(id,bucket_id,name)
    values ('30000000-0000-0000-0000-000000000003','alumni-credentials',auth.uid()::text||'/blocked.pdf');
    raise exception 'Inactive alumnus unexpectedly inserted a storage object';
  exception when insufficient_privilege then
    null;
  end;
  begin
    update public.profiles set role='admin' where id=auth.uid();
    raise exception 'Inactive alumnus unexpectedly changed their role';
  exception when insufficient_privilege then
    null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000003', false);
do $$
begin
  if not exists (select 1 from public.profiles where id=auth.uid() and role='admin') then
    raise exception 'Administrator must retain profile read access';
  end if;
  if has_column_privilege('authenticated', 'public.profiles', 'account_status', 'UPDATE') then
    raise exception 'Authenticated users must not have direct account_status UPDATE';
  end if;
  perform public.set_alumni_account_status(
    '00000000-0000-0000-0000-000000000002',
    'active'
  );
  if not exists (
    select 1 from public.profiles
    where id='00000000-0000-0000-0000-000000000002'
      and account_status='active'
  ) then
    raise exception 'Administrator RPC must reactivate an alumnus';
  end if;
  if not exists (select 1 from public.profiles where id='00000000-0000-0000-0000-000000000002') then
    raise exception 'Administrator must retain full profile directory access';
  end if;
  update public.credentials
  set status='verified', verified_by=auth.uid(), verified_at=now()
  where id='10000000-0000-0000-0000-000000000003';
  if not exists (
    select 1 from public.credentials
    where id='10000000-0000-0000-0000-000000000003'
      and status='verified'
      and verified_by=auth.uid()
  ) then
    raise exception 'Administrator must retain credential verification access';
  end if;
  if (select count(*) from public.credentials) <> 3 then
    raise exception 'Administrator must retain credential review access';
  end if;
  if (select count(*) from storage.objects where bucket_id='alumni-credentials') <> 3 then
    raise exception 'Administrator must retain access to credential files';
  end if;
end $$;
reset role;
