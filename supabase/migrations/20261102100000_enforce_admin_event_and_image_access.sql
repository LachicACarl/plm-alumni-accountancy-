-- Events are public content. Only administrators may manage event records or
-- upload/replace/delete public event and batch images or edit batch records.

-- Require the buckets to exist, then align visibility with the public-page
-- contract. Credential files must never be served through public object URLs.
do $buckets$
begin
  if not exists (select 1 from storage.buckets where id = 'alumni-credentials') then
    raise exception 'Create the alumni-credentials Storage bucket before applying this migration.';
  end if;
  if not exists (select 1 from storage.buckets where id = 'event-images') then
    raise exception 'Create the event-images Storage bucket before applying this migration.';
  end if;
  if not exists (select 1 from storage.buckets where id = 'batch-images') then
    raise exception 'Create the batch-images Storage bucket before applying this migration.';
  end if;

  update storage.buckets set public = false
  where id = 'alumni-credentials';

  update storage.buckets set public = true
  where id in ('event-images', 'batch-images');
end;
$buckets$;

-- Intersect legacy permissive batch policies left behind by older deployments.
alter table public.batches enable row level security;
revoke all on public.batches from public, anon, authenticated;
grant select on public.batches to anon, authenticated;
grant insert, update, delete on public.batches to authenticated;

drop policy if exists "Batch inserts are administrator only" on public.batches;
create policy "Batch inserts are administrator only"
  on public.batches as restrictive for insert to authenticated
  with check ((select public.is_account_admin()));

drop policy if exists "Batch updates are administrator only" on public.batches;
create policy "Batch updates are administrator only"
  on public.batches as restrictive for update to authenticated
  using ((select public.is_account_admin()))
  with check ((select public.is_account_admin()));

drop policy if exists "Batch deletes are administrator only" on public.batches;
create policy "Batch deletes are administrator only"
  on public.batches as restrictive for delete to authenticated
  using ((select public.is_account_admin()));

alter table public.events enable row level security;

revoke all on public.events from public, anon;
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
  on public.events for select to anon, authenticated
  using (true);

drop policy if exists "Administrators can manage events" on public.events;
create policy "Administrators can manage events"
  on public.events for all to authenticated
  using ((select public.is_account_admin()))
  with check ((select public.is_account_admin()));

-- Restrictive policies ensure older permissive policies cannot give ordinary
-- authenticated users event writes.
drop policy if exists "Event inserts are administrator only" on public.events;
create policy "Event inserts are administrator only"
  on public.events as restrictive for insert to authenticated
  with check ((select public.is_account_admin()));

drop policy if exists "Event updates are administrator only" on public.events;
create policy "Event updates are administrator only"
  on public.events as restrictive for update to authenticated
  using ((select public.is_account_admin()))
  with check ((select public.is_account_admin()));

drop policy if exists "Event deletes are administrator only" on public.events;
create policy "Event deletes are administrator only"
  on public.events as restrictive for delete to authenticated
  using ((select public.is_account_admin()));

-- These are public image buckets. Public read is intentional; all object
-- writes are restricted to administrator accounts, even with legacy policies.
revoke insert, update, delete on storage.objects from public, anon;
grant insert, update, delete on storage.objects to authenticated;

drop policy if exists "Public can read event and batch images" on storage.objects;
create policy "Public can read event and batch images"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('event-images', 'batch-images'));

drop policy if exists "Administrators manage event and batch images" on storage.objects;
create policy "Administrators manage event and batch images"
  on storage.objects for all to authenticated
  using (
    bucket_id in ('event-images', 'batch-images')
    and (select public.is_account_admin())
  )
  with check (
    bucket_id in ('event-images', 'batch-images')
    and (select public.is_account_admin())
  );

drop policy if exists "Managed image inserts are administrator only" on storage.objects;
create policy "Managed image inserts are administrator only"
  on storage.objects as restrictive for insert to authenticated
  with check (
    bucket_id not in ('event-images', 'batch-images')
    or (select public.is_account_admin())
  );

drop policy if exists "Managed image updates are administrator only" on storage.objects;
create policy "Managed image updates are administrator only"
  on storage.objects as restrictive for update to authenticated
  using (
    bucket_id not in ('event-images', 'batch-images')
    or (select public.is_account_admin())
  )
  with check (
    bucket_id not in ('event-images', 'batch-images')
    or (select public.is_account_admin())
  );

drop policy if exists "Managed image deletes are administrator only" on storage.objects;
create policy "Managed image deletes are administrator only"
  on storage.objects as restrictive for delete to authenticated
  using (
    bucket_id not in ('event-images', 'batch-images')
    or (select public.is_account_admin())
  );

-- A public bucket bypasses object RLS for URL downloads, so keep credentials
-- private and intersect any legacy anonymous object policy as well.
drop policy if exists "Anonymous users cannot access alumni credentials" on storage.objects;
create policy "Anonymous users cannot access alumni credentials"
  on storage.objects as restrictive for all to anon
  using (bucket_id <> 'alumni-credentials')
  with check (bucket_id <> 'alumni-credentials');
