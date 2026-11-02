-- One editable public-homepage document. Public visitors can read only;
-- authenticated administrators/head administrators can update it.
create table if not exists public.homepage_content (
  id text primary key check (id = 'main'),
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.homepage_content enable row level security;

create or replace function public.is_homepage_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'head_admin')
  );
$$;

revoke all on function public.is_homepage_admin() from public, anon;
grant execute on function public.is_homepage_admin() to authenticated;

drop policy if exists "Homepage content is publicly readable" on public.homepage_content;
create policy "Homepage content is publicly readable"
  on public.homepage_content for select
  to anon, authenticated
  using (id = 'main');

drop policy if exists "Administrators can update homepage content" on public.homepage_content;
create policy "Administrators can update homepage content"
  on public.homepage_content for update
  to authenticated
  using (public.is_homepage_admin())
  with check (public.is_homepage_admin());

revoke all on public.homepage_content from public;
grant select on public.homepage_content to anon, authenticated;
grant update on public.homepage_content to authenticated;

insert into public.homepage_content (id, content)
values ('main', '{
  "hero":{"eyebrow":"WELCOME BACK,","title":"BSA ALUMNI","tagline":"Once part of the journey, Always part of the legacy.","description":"Reconnect, celebrate achievements, and be part of the future of PLM - BSA Community.","campusImage":""},
  "statistics":[{"value":"3,000+","label":"Alumni"},{"value":"20+","label":"Batches"},{"value":"500+","label":"CPA Passers"}],
  "events":{"eyebrow":"STAY UPDATED","title":"What''s Happening in BSA?","description":"Catch up on the latest events, announcements, and milestones happening in our community.","items":[{"title":"TESTIMONIAL DINNER","description":"A new horizon beckons, earned through the relentless dedication of our new CPAs.","image":""},{"title":"MAY 2026 PASSERS","description":"PLM achieved a commendable passing rate of 52.94%.","image":""},{"title":"MAY 2026 PASSERS","description":"Celebrating the achievements of our newest CPA passers.","image":""}]},
  "spotlight":{"eyebrow":"ALUMNI SPOTLIGHT","quoteTitle":"Just keep going","description":"Inspiring stories of our alumni who continue to make an impact.","name":"Dante F. Falsado, CPA, CMA","position":"Professor at Pamantasan ng Lungsod ng Maynila","quote":"The values and the discipline I learned in BSA shaped the professional I am today.","image":""},
  "batches":["2027","2026","2025","2024","2023","2022","2021","2020","2019","2018","2017"],
  "memories":["","","","",""],
  "footer":{"address":"General Luna corner Muralla Streets, Intramuros, Manila, 1002 Metro Manila, Philippines","email":"BSAAlumniSystem.2026@gmail.com","phone":"(02) 1234-5678 / 09123456789","copyright":"© BSA ALUMNI SYSTEM | Pamantasan ng Lungsod ng Maynila. All Rights Reserved"}
}'::jsonb)
on conflict (id) do nothing;

create or replace function public.set_homepage_content_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists set_homepage_content_updated_at on public.homepage_content;
create trigger set_homepage_content_updated_at
before update on public.homepage_content
for each row execute function public.set_homepage_content_updated_at();
