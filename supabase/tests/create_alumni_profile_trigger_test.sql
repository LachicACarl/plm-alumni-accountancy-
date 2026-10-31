-- Zero-cost PostgreSQL integration tests for the Auth -> profiles trigger.
-- Run against an ephemeral local PostgreSQL instance only. Never point this at production.

create schema if not exists auth;
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
end
$$;

create table auth.users (
  id uuid primary key,
  email text unique,
  raw_user_meta_data jsonb not null default '{}'::jsonb
);

create table public.batches (
  year integer primary key
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  student_number text unique,
  first_name text not null,
  middle_name text,
  last_name text not null,
  email text unique,
  graduation_year integer references public.batches(year),
  profession text,
  company text,
  role text not null default 'alumni' check (role in ('alumni', 'admin', 'head_admin'))
);

insert into public.batches(year) values (2024), (2025);

-- Migration file is applied by the workflow before this test script.

-- A normal Auth signup must not be affected by the alumni provisioning trigger.
insert into auth.users(id, email, raw_user_meta_data)
values ('00000000-0000-0000-0000-000000000001', 'ordinary@example.test', '{}'::jsonb);
do $$
begin
  if exists (select 1 from public.profiles where id = '00000000-0000-0000-0000-000000000001') then
    raise exception 'non-invite Auth user unexpectedly received an alumni profile';
  end if;
end
$$;

-- A valid invite creates exactly one profile, trims fields, normalizes email,
-- and never accepts a caller-supplied privileged role.
insert into auth.users(id, email, raw_user_meta_data)
values (
  '00000000-0000-0000-0000-000000000002',
  'VALID@EXAMPLE.TEST',
  '{"provision_alumni_profile":"true","first_name":"  Ada ","middle_name":"  M  ","last_name":" Lovelace ","student_number":"  PLM-2024-001 ","graduation_year":"2024","profession":"Engineer","company":"Analytical Engines","role":"admin"}'::jsonb
);
do $$
begin
  if (select count(*) from public.profiles where id = '00000000-0000-0000-0000-000000000002') <> 1 then
    raise exception 'valid invite did not create exactly one profile';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = '00000000-0000-0000-0000-000000000002'
      and first_name = 'Ada'
      and middle_name = 'M'
      and last_name = 'Lovelace'
      and email = 'valid@example.test'
      and student_number = 'PLM-2024-001'
      and graduation_year = 2024
      and role = 'alumni'
  ) then
    raise exception 'valid invite profile values or forced alumni role are incorrect';
  end if;
end
$$;

-- Seed existing profile data for each uniqueness/FK failure scenario.
insert into public.profiles(id, first_name, last_name, email, student_number)
values
  ('00000000-0000-0000-0000-000000000001', 'Seed', 'Student', 'new-auth-email@example.test', 'DUP-STUDENT');

-- Duplicate student number: auth.users insert and trigger profile insert must roll back together.
do $$
begin
  begin
    insert into auth.users(id, email, raw_user_meta_data)
    values ('00000000-0000-0000-0000-000000000003', 'duplicate-student@example.test',
      '{"provision_alumni_profile":"true","first_name":"Duplicate","last_name":"Student","student_number":"DUP-STUDENT"}'::jsonb);
    raise exception 'expected duplicate student number to fail';
  exception when unique_violation then
    null;
  end;
  if exists (select 1 from auth.users where id = '00000000-0000-0000-0000-000000000003') then
    raise exception 'duplicate student number left an orphan Auth user';
  end if;
end
$$;

-- Duplicate profile email: the existing profile email differs from its owner's Auth email.
do $$
begin
  begin
    insert into auth.users(id, email, raw_user_meta_data)
    values ('00000000-0000-0000-0000-000000000004', 'new-auth-email@example.test',
      '{"provision_alumni_profile":"true","first_name":"Duplicate","last_name":"Email","student_number":"UNIQUE-EMAIL-TEST"}'::jsonb);
    raise exception 'expected duplicate profile email to fail';
  exception when unique_violation then
    null;
  end;
  if exists (select 1 from auth.users where id = '00000000-0000-0000-0000-000000000004') then
    raise exception 'duplicate profile email left an orphan Auth user';
  end if;
end
$$;

-- Invalid graduation year must fail the profiles FK and roll back Auth user creation.
do $$
begin
  begin
    insert into auth.users(id, email, raw_user_meta_data)
    values ('00000000-0000-0000-0000-000000000005', 'invalid-batch@example.test',
      '{"provision_alumni_profile":"true","first_name":"Invalid","last_name":"Batch","student_number":"UNIQUE-BATCH-TEST","graduation_year":"2099"}'::jsonb);
    raise exception 'expected unknown graduation batch to fail';
  exception when foreign_key_violation then
    null;
  end;
  if exists (select 1 from auth.users where id = '00000000-0000-0000-0000-000000000005') then
    raise exception 'invalid graduation batch left an orphan Auth user';
  end if;
end
$$;

select 'Auth/profile trigger integration tests passed' as result;
