-- Public directory and batch page data must come from database records.
-- The directory RPC deliberately returns only approved public profile fields.

alter table public.batches
  add column if not exists image_url text;

alter table public.batches enable row level security;

drop policy if exists "Public can read batches" on public.batches;
create policy "Public can read batches"
  on public.batches for select
  to anon, authenticated
  using (true);

drop policy if exists "Administrators manage batches" on public.batches;
create policy "Administrators manage batches"
  on public.batches for all
  to authenticated
  using ((select public.is_account_admin()))
  with check ((select public.is_account_admin()));

grant select on public.batches to anon, authenticated;
grant insert, update, delete on public.batches to authenticated;

create or replace function public.get_public_alumni()
returns table (
  id uuid,
  first_name text,
  middle_name text,
  last_name text,
  graduation_year integer,
  profession text,
  company text,
  profile_image_url text
)
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select
    p.id,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.graduation_year,
    p.profession,
    p.company,
    p.profile_image_url
  from public.profiles p
  where p.role = 'alumni'
    and p.account_status = 'active'
  order by p.last_name asc, p.first_name asc;
$$;

revoke all on function public.get_public_alumni() from public;
grant execute on function public.get_public_alumni() to anon, authenticated;

comment on function public.get_public_alumni() is
  'Returns only active alumni and public directory fields. Never returns email, phone, address, or student number.';
