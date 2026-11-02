-- Events are public content. Only administrators may manage event records or
-- upload/replace/delete public event and batch images.

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
