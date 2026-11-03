-- Store TruthLens analysis exports separately from the alumni roster.
create table if not exists public.truthlens_reports (
  id uuid primary key default gen_random_uuid(),
  report_date date,
  file_name text not null,
  media_type text,
  result text not null,
  confidence_score numeric(5,2),
  analysis text,
  imported_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint truthlens_reports_confidence_range
    check (confidence_score is null or (confidence_score >= 0 and confidence_score <= 100))
);

create index if not exists truthlens_reports_created_at_idx
  on public.truthlens_reports (created_at desc);
create index if not exists truthlens_reports_file_name_idx
  on public.truthlens_reports (file_name);

alter table public.truthlens_reports enable row level security;

grant select, insert on public.truthlens_reports to authenticated;

drop policy if exists "Admins can view TruthLens reports" on public.truthlens_reports;
create policy "Admins can view TruthLens reports"
  on public.truthlens_reports for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can import TruthLens reports" on public.truthlens_reports;
create policy "Admins can import TruthLens reports"
  on public.truthlens_reports for insert
  to authenticated
  with check (
    (select public.is_admin())
    and imported_by = (select auth.uid())
  );
