-- Allow administrators to take the saved homepage offline without deleting it.
-- Existing content remains published by default when this migration is applied.
alter table public.homepage_content
  add column if not exists is_published boolean not null default true;

alter table public.homepage_content enable row level security;

drop policy if exists "Homepage content is publicly readable" on public.homepage_content;
drop policy if exists "Published homepage content is publicly readable" on public.homepage_content;
create policy "Published homepage content is publicly readable"
  on public.homepage_content for select to anon, authenticated
  using (id = 'main' and is_published);

drop policy if exists "Administrators can read homepage drafts" on public.homepage_content;
create policy "Administrators can read homepage drafts"
  on public.homepage_content for select to authenticated
  using ((select public.is_homepage_admin()));
