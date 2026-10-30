-- Add an explicit administrative account status for alumni records.
-- Existing alumni default to active; administrators can later mark them inactive.
alter table public.profiles
  add column if not exists account_status text not null default 'active';

alter table public.profiles
  drop constraint if exists profiles_account_status_check;

alter table public.profiles
  add constraint profiles_account_status_check
  check (account_status in ('active', 'inactive'));

create index if not exists profiles_role_account_status_idx
  on public.profiles (role, account_status);
