-- Zero-cost PostgreSQL integration tests for trusted Auth -> profiles provisioning.
-- This file is run only against an ephemeral PostgreSQL container in GitHub Actions.

create schema if not exists auth;
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin; end if;
end
$$;

create table public.batches (year integer primary key);
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

-- A caller-controlled metadata flag without a matching private ticket must not
-- create a profile or be accepted as trusted provisioning.
insert into auth.users(id, email, raw_user_meta_data)
values ('00000000-0000-0000-0000-000000000001', 'ordinary@example.test',
  '{"provision_alumni_profile":"true","first_name":"Spoof","last_name":"Attempt"}'::jsonb);
do $$
begin
  if exists (select 1 from public.profiles where id = '00000000-0000-0000-0000-000000000001') then
    raise exception 'untrusted metadata unexpectedly created a profile';
  end if;
end
$$;

-- A forged or random ticket cannot provision a profile and aborts the Auth insert.
do $$
begin
  begin
    insert into auth.users(id, email, raw_user_meta_data)
    values ('00000000-0000-0000-0000-000000000007', 'forged-ticket@example.test',
      '{"provisioning_token":"99999999-9999-9999-9999-999999999999"}'::jsonb);
    raise exception 'expected an unknown provisioning ticket to fail';
  exception when raise_exception then
    if sqlerrm not like 'No trusted alumni provisioning request%' then
      raise;
    end if;
  end;
  if exists (select 1 from auth.users where id = '00000000-0000-0000-0000-000000000007') then
    raise exception 'forged ticket left an Auth user';
  end if;
end
$$;

-- A normal signup with no provisioning ticket remains unaffected.
insert into auth.users(id, email, raw_user_meta_data)
values ('00000000-0000-0000-0000-000000000006', 'normal@example.test', '{}'::jsonb);
do $$
begin
  if exists (select 1 from public.profiles where id = '00000000-0000-0000-0000-000000000006') then
    raise exception 'normal Auth signup unexpectedly received an alumni profile';
  end if;
end
$$;

-- Valid ticket creates exactly one alumni profile and is consumed.
select public.queue_alumni_invite_profile(
  '10000000-0000-0000-0000-000000000002', 'valid@example.test',
  'Ada', 'M', 'Lovelace', 'PLM-2024-001', 2024, 'Engineer', 'Analytical Engines'
);
insert into auth.users(id, email, raw_user_meta_data)
values ('00000000-0000-0000-0000-000000000002', 'VALID@EXAMPLE.TEST',
  '{"provisioning_token":"10000000-0000-0000-0000-000000000002"}'::jsonb);
do $$
begin
  if (select count(*) from public.profiles where id = '00000000-0000-0000-0000-000000000002') <> 1 then
    raise exception 'valid invite did not create exactly one profile';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = '00000000-0000-0000-0000-000000000002'
      and first_name = 'Ada' and middle_name = 'M' and last_name = 'Lovelace'
      and email = 'valid@example.test' and student_number = 'PLM-2024-001'
      and graduation_year = 2024 and role = 'alumni'
  ) then
    raise exception 'valid invite profile values or forced alumni role are incorrect';
  end if;
  if exists (select 1 from private.alumni_invite_provisioning where token = '10000000-0000-0000-0000-000000000002') then
    raise exception 'successful invite did not consume its one-time ticket';
  end if;
end
$$;

-- Seed profile values that cause the following invite transactions to fail.
insert into public.profiles(id, first_name, last_name, email, student_number)
values ('00000000-0000-0000-0000-000000000001', 'Seed', 'Student',
  'duplicate-profile-email@example.test', 'DUP-STUDENT');

-- Duplicate student number aborts auth.users insert and leaves no orphan user.
select public.queue_alumni_invite_profile(
  '10000000-0000-0000-0000-000000000003', 'duplicate-student@example.test',
  'Duplicate', null, 'Student', 'DUP-STUDENT', null, null, null
);
do $$
begin
  begin
    insert into auth.users(id, email, raw_user_meta_data)
    values ('00000000-0000-0000-0000-000000000003', 'duplicate-student@example.test',
      '{"provisioning_token":"10000000-0000-0000-0000-000000000003"}'::jsonb);
    raise exception 'expected duplicate student number to fail';
  exception when unique_violation then null;
  end;
  if exists (select 1 from auth.users where id = '00000000-0000-0000-0000-000000000003') then
    raise exception 'duplicate student number left an orphan Auth user';
  end if;
  if not exists (select 1 from private.alumni_invite_provisioning where token = '10000000-0000-0000-0000-000000000003') then
    raise exception 'failed trigger transaction should preserve ticket until caller cleanup';
  end if;
end
$$;
select public.cancel_alumni_invite_profile('10000000-0000-0000-0000-000000000003');

-- Duplicate profile email also aborts the Auth insert.
select public.queue_alumni_invite_profile(
  '10000000-0000-0000-0000-000000000004', 'duplicate-profile-email@example.test',
  'Duplicate', null, 'Email', 'UNIQUE-EMAIL-TEST', null, null, null
);
do $$
begin
  begin
    insert into auth.users(id, email, raw_user_meta_data)
    values ('00000000-0000-0000-0000-000000000004', 'duplicate-profile-email@example.test',
      '{"provisioning_token":"10000000-0000-0000-0000-000000000004"}'::jsonb);
    raise exception 'expected duplicate profile email to fail';
  exception when unique_violation then null;
  end;
  if exists (select 1 from auth.users where id = '00000000-0000-0000-0000-000000000004') then
    raise exception 'duplicate profile email left an orphan Auth user';
  end if;
end
$$;
select public.cancel_alumni_invite_profile('10000000-0000-0000-0000-000000000004');

-- Unknown graduation batch aborts the Auth insert.
select public.queue_alumni_invite_profile(
  '10000000-0000-0000-0000-000000000005', 'invalid-batch@example.test',
  'Invalid', null, 'Batch', 'UNIQUE-BATCH-TEST', 2099, null, null
);
do $$
begin
  begin
    insert into auth.users(id, email, raw_user_meta_data)
    values ('00000000-0000-0000-0000-000000000005', 'invalid-batch@example.test',
      '{"provisioning_token":"10000000-0000-0000-0000-000000000005"}'::jsonb);
    raise exception 'expected unknown graduation batch to fail';
  exception when foreign_key_violation then null;
  end;
  if exists (select 1 from auth.users where id = '00000000-0000-0000-0000-000000000005') then
    raise exception 'invalid graduation batch left an orphan Auth user';
  end if;
end
$$;
select public.cancel_alumni_invite_profile('10000000-0000-0000-0000-000000000005');

select 'Trusted Auth/profile trigger integration tests passed' as result;
