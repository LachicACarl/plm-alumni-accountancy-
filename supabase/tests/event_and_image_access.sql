\set ON_ERROR_STOP on

create role anon nologin;
create role authenticated nologin;
create schema auth;
create schema storage;

create function auth.uid() returns uuid
language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

create table public.profiles (
  id uuid primary key,
  role text not null
);

create function public.is_account_admin() returns boolean
language sql stable security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'head_admin')
  );
$$;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  created_at timestamptz not null default now()
);
create table public.batches (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique,
  description text,
  highlights text[],
  image_url text
);

create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null,
  name text not null
);
create table storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false
);
insert into storage.buckets (id, name, public) values
  ('alumni-credentials', 'alumni-credentials', true),
  ('event-images', 'event-images', false),
  ('batch-images', 'batch-images', false);

insert into public.profiles (id, role) values
  ('00000000-0000-0000-0000-000000000001', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'alumni');
insert into public.events (id, title, event_date)
values ('00000000-0000-0000-0000-000000000010', 'Public event', '2026-12-01');
insert into public.batches (id, year) values
  ('00000000-0000-0000-0000-000000000011', 2024);
insert into storage.objects (id, bucket_id, name) values
  ('00000000-0000-0000-0000-000000000020', 'event-images', 'events/public.png'),
  ('00000000-0000-0000-0000-000000000021', 'batch-images', 'batches/public.png'),
  ('00000000-0000-0000-0000-000000000022', 'alumni-credentials', '00000000-0000-0000-0000-000000000002/proof.pdf');

alter table public.events enable row level security;
alter table public.batches enable row level security;
alter table storage.objects enable row level security;
create policy "legacy open event access" on public.events
  for all to authenticated using (true) with check (true);
create policy "Public can read batches" on public.batches
  for select to anon, authenticated using (true);
create policy "Administrators manage batches" on public.batches
  for all to authenticated using ((select public.is_account_admin()))
  with check ((select public.is_account_admin()));
create policy "legacy open batch access" on public.batches
  for all to authenticated using (true) with check (true);
create policy "legacy open storage access" on storage.objects
  for all to authenticated using (true) with check (true);
create policy "legacy public storage access" on storage.objects
  for all to anon using (true) with check (true);

grant usage on schema public, auth, storage to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant select, insert, update, delete on public.events, public.batches, storage.objects to anon, authenticated;

\ir ../migrations/20261102100000_enforce_admin_event_and_image_access.sql

do $$
begin
  if (select public from storage.buckets where id = 'alumni-credentials') is not false then
    raise exception 'Credential files must remain in a private bucket';
  end if;
  if (select public from storage.buckets where id = 'event-images') is not true
    or (select public from storage.buckets where id = 'batch-images') is not true then
    raise exception 'Event and batch image buckets must be public';
  end if;
end;
$$;

begin;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
do $$
begin
  if (select count(*) from public.events) <> 1 then
    raise exception 'Anonymous visitors must read public events';
  end if;
  if (select count(*) from public.batches) <> 1 then
    raise exception 'Anonymous visitors must read public batches';
  end if;
  if (select count(*) from storage.objects where bucket_id in ('event-images', 'batch-images')) <> 2 then
    raise exception 'Anonymous visitors must read managed public images';
  end if;
  if (select count(*) from storage.objects where bucket_id = 'alumni-credentials') <> 0 then
    raise exception 'Anonymous visitors must not read alumni credentials';
  end if;
end;
$$;
rollback;

begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
do $$
declare
  affected_rows integer;
begin
  begin
    insert into public.events (title, event_date) values ('Alumni injected event', '2026-12-02');
    raise exception 'Alumni must not insert events';
  exception when insufficient_privilege then
    null;
  end;

  begin
    insert into public.batches (year) values (2025);
    raise exception 'Alumni must not insert batches';
  exception when insufficient_privilege then
    null;
  end;

  update public.events set title = 'Alumni changed event'
  where id = '00000000-0000-0000-0000-000000000010';
  get diagnostics affected_rows = row_count;
  if affected_rows <> 0 then
    raise exception 'Alumni must not update events';
  end if;

  update public.batches set description = 'Alumni changed batch'
  where year = 2024;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 0 then
    raise exception 'Alumni must not update batches';
  end if;

  begin
    insert into storage.objects (bucket_id, name) values ('event-images', 'events/injected.png');
    raise exception 'Alumni must not upload event images';
  exception when insufficient_privilege then
    null;
  end;

  delete from storage.objects where bucket_id = 'event-images'
    and name = 'events/public.png';
  get diagnostics affected_rows = row_count;
  if affected_rows <> 0 then
    raise exception 'Alumni must not delete managed images';
  end if;
end;
$$;
rollback;

begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
insert into public.events (title, event_date) values ('Admin event', '2026-12-03');
insert into public.batches (year) values (2025);
insert into storage.objects (bucket_id, name) values ('event-images', 'events/admin.png');
rollback;

select 'event and image access checks passed' as result;
