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

create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null,
  name text not null
);

insert into public.profiles (id, role) values
  ('00000000-0000-0000-0000-000000000001', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'alumni');
insert into public.events (id, title, event_date)
values ('00000000-0000-0000-0000-000000000010', 'Public event', '2026-12-01');
insert into storage.objects (id, bucket_id, name) values
  ('00000000-0000-0000-0000-000000000020', 'event-images', 'events/public.png'),
  ('00000000-0000-0000-0000-000000000021', 'batch-images', 'batches/public.png');

alter table public.events enable row level security;
alter table storage.objects enable row level security;
create policy "legacy open event access" on public.events
  for all to authenticated using (true) with check (true);
create policy "legacy open storage access" on storage.objects
  for all to authenticated using (true) with check (true);

grant usage on schema public, auth, storage to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant select, insert, update, delete on public.events, storage.objects to anon, authenticated;

\ir ../migrations/20261102100000_enforce_admin_event_and_image_access.sql

begin;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
do $$
begin
  if (select count(*) from public.events) <> 1 then
    raise exception 'Anonymous visitors must read public events';
  end if;
  if (select count(*) from storage.objects where bucket_id in ('event-images', 'batch-images')) <> 2 then
    raise exception 'Anonymous visitors must read managed public images';
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

  update public.events set title = 'Alumni changed event'
  where id = '00000000-0000-0000-0000-000000000010';
  get diagnostics affected_rows = row_count;
  if affected_rows <> 0 then
    raise exception 'Alumni must not update events';
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
insert into storage.objects (bucket_id, name) values ('event-images', 'events/admin.png');
rollback;

select 'event and image access checks passed' as result;
