-- Create alumni profiles inside the same database transaction as Auth user creation.
-- If a profile constraint fails (duplicate student number/email or unknown batch),
-- the auth.users insert fails too, so inviteUserByEmail cannot send a dangling invite.

create or replace function public.handle_alumni_invite_profile()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  invite_metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  -- Scope this behavior to accounts created by the protected alumni invite
  -- Edge Function; other Auth user creation flows remain unchanged.
  if invite_metadata ->> 'provision_alumni_profile' is distinct from 'true' then
    return new;
  end if;

  insert into public.profiles (
    id,
    first_name,
    middle_name,
    last_name,
    email,
    student_number,
    graduation_year,
    profession,
    company,
    role
  ) values (
    new.id,
    nullif(btrim(invite_metadata ->> 'first_name'), ''),
    nullif(btrim(invite_metadata ->> 'middle_name'), ''),
    nullif(btrim(invite_metadata ->> 'last_name'), ''),
    lower(new.email),
    nullif(btrim(invite_metadata ->> 'student_number'), ''),
    nullif(invite_metadata ->> 'graduation_year', '')::integer,
    nullif(btrim(invite_metadata ->> 'profession'), ''),
    nullif(btrim(invite_metadata ->> 'company'), ''),
    'alumni'
  );

  return new;
end;
$$;

create trigger on_auth_user_created_alumni_profile
after insert on auth.users
for each row
execute function public.handle_alumni_invite_profile();

-- Trigger functions are not callable as ordinary RPC functions. Keep their
-- execution surface restricted while allowing the trigger itself to run.
revoke all on function public.handle_alumni_invite_profile() from public;
revoke all on function public.handle_alumni_invite_profile() from anon;
revoke all on function public.handle_alumni_invite_profile() from authenticated;
