-- PLM College of Accountancy BSA Alumni System
-- Supabase PostgreSQL Schema

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique,
  description text,
  highlights text[],
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  student_number text unique,
  first_name text not null,
  middle_name text,
  last_name text not null,
  email text unique,
  phone text,
  address text,
  graduation_year integer references public.batches(year),
  profile_image_url text,
  profession text,
  company text,
  bio text,
  role text not null default 'alumni',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  start_time time,
  end_time time,
  location text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  achievement_date date,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  credential_type text not null,
  file_url text not null,
  status text not null default 'pending',
  remarks text,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text,
  record_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);
