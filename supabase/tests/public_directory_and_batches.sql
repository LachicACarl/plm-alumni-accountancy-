-- Disposable PostgreSQL regression test for public alumni and batch data.
\set ON_ERROR_STOP on

create role anon nologin;
create role authenticated nologin;
create schema auth;
create or replace function auth.uid()
returns uuid language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

create table public.profiles (
  id uuid primary key,
  role text not null,
  account_status text not null,
  first_name text not null,
  middle_name text,
  last_name text not null,
  graduation_year integer,
  profession text,
  company text,
  profile_image_url text,
  email text,
  phone text,
  address text,
  student_number text
);
create table public.batches (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique,
  description text,
  highlights text[],
  created_at timestamptz not null default now()
);
create or replace function public.is_account_admin()
returns boolean language sql stable security definer
set search_path = pg_catalog, public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','head_admin')) $$;

insert into public.profiles
  (id, role, account_status, first_name, last_name, graduation_year, profession, company, email, phone, address, student_number)
values
  ('00000000-0000-0000-0000-000000000001','alumni','active','Active','Alumni',2025,'CPA','Firm A','private@example.test','09170000000','Private address','S-001'),
  ('00000000-0000-0000-0000-000000000002','alumni','inactive','Inactive','Alumni',2024,'Auditor','Firm B','hidden@example.test','09171111111','Hidden address','S-002'),
  ('00000000-0000-0000-0000-000000000003','admin','active','Admin','User',2020,null,null,'admin@example.test',null,null,null);

insert into public.batches (year, description, highlights)
values (2025, 'Batch description', array['CPA passers']);

grant usage on schema public, auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant select, insert, update, delete on public.batches to authenticated;
grant select on public.profiles to authenticated;

\i supabase/migrations/20261031160000_public_directory_and_batch_content.sql

set role anon;
do $$
declare
  visible_count integer;
  visible_year integer;
begin
  select count(*) into visible_count from public.get_public_alumni();
  if visible_count <> 1 then
    raise exception 'Public directory must return exactly one active alumni profile; got %', visible_count;
  end if;

  if exists (
    select 1 from public.get_public_alumni()
    where email is not null
  ) then
    raise exception 'Public directory must not expose email addresses';
  end if;

  select count(*) into visible_year from public.batches;
  if visible_year <> 1 then
    raise exception 'Anonymous visitors must be able to read published batches';
  end if;

  begin
    insert into public.batches (year, description) values (2026, 'Unauthorized');
    raise exception 'Anonymous visitor unexpectedly inserted a batch';
  exception when insufficient_privilege then
    null;
  end;
end $$;
reset role;

select 'public directory and batch access tests passed' as result;
