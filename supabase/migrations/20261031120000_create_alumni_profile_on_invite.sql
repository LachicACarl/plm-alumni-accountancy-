-- Trusted, one-time provisioning tickets for administrator-created alumni invitations.
-- raw_user_meta_data is client-controlled, so it must never be the authority for profile creation.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table if not exists private.alumni_invite_provisioning (
  token uuid primary key,
  email text not null,
  first_name text not null,
  middle_name text,
  last_name text not null,
  student_number text,
  graduation_year integer,
  profession text,
  company text,
  created_at timestamptz not null default now()
);

revoke all on table private.alumni_invite_provisioning from public, anon, authenticated;
grant select, insert, update, delete on table private.alumni_invite_provisioning to service_role;

create or replace function public.queue_alumni_invite_profile(
  p_token uuid,
  p_email text,
  p_first_name text,
  p_middle_name text,
  p_last_name text,
  p_student_number text,
  p_graduation_year integer,
  p_profession text,
  p_company text
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
begin
  insert into private.alumni_invite_provisioning (
    token, email, first_name, middle_name, last_name,
    student_number, graduation_year, profession, company
  ) values (
    p_token, lower(btrim(p_email)), btrim(p_first_name),
    nullif(btrim(p_middle_name), ''), btrim(p_last_name),
    nullif(btrim(p_student_number), ''), p_graduation_year,
    nullif(btrim(p_profession), ''), nullif(btrim(p_company), '')
  );
end;
$$;

create or replace function public.cancel_alumni_invite_profile(p_token uuid)
returns void
language sql
security definer
set search_path = pg_catalog, private
as $$
  delete from private.alumni_invite_provisioning where token = p_token;
$$;

revoke all on function public.queue_alumni_invite_profile(uuid, text, text, text, text, text, integer, text, text) from public, anon, authenticated;
grant execute on function public.queue_alumni_invite_profile(uuid, text, text, text, text, text, integer, text, text) to service_role;
revoke all on function public.cancel_alumni_invite_profile(uuid) from public, anon, authenticated;
grant execute on function public.cancel_alumni_invite_profile(uuid) to service_role;

create or replace function public.handle_alumni_invite_profile()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  provisioning_token uuid;
  invite_request private.alumni_invite_provisioning%rowtype;
begin
  -- Ordinary signups and invitations without a ticket do not create alumni profiles.
  if new.raw_user_meta_data ->> 'provisioning_token' is null then
    return new;
  end if;

  provisioning_token := (new.raw_user_meta_data ->> 'provisioning_token')::uuid;

  select * into invite_request
  from private.alumni_invite_provisioning
  where token = provisioning_token
    and email = lower(new.email)
  for update;

  if not found then
    raise exception 'No trusted alumni provisioning request exists for this invitation.';
  end if;

  insert into public.profiles (
    id, first_name, middle_name, last_name, email, student_number,
    graduation_year, profession, company, role
  ) values (
    new.id, invite_request.first_name, invite_request.middle_name,
    invite_request.last_name, lower(new.email), invite_request.student_number,
    invite_request.graduation_year, invite_request.profession,
    invite_request.company, 'alumni'
  );

  delete from private.alumni_invite_provisioning where token = provisioning_token;
  return new;
end;
$$;

-- Make the trigger declaration safe to retry in environments where the
-- migration was applied manually before the migration ledger was updated.
drop trigger if exists on_auth_user_created_alumni_profile on auth.users;
create trigger on_auth_user_created_alumni_profile
after insert on auth.users
for each row
execute function public.handle_alumni_invite_profile();

revoke all on function public.handle_alumni_invite_profile() from public, anon, authenticated;
