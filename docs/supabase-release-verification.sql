-- Read-only release verification for the PLM BSA Alumni Supabase project.
-- Run in Supabase SQL Editor as an authorized project owner. This script does
-- not inspect password hashes, alter data, change policies, or apply migrations.

begin transaction read only;

-- Migration ledger: reports recorded versions without assuming the optional
-- schema_migrations table exists in every project setup.
do $check_migration_history$
declare
  applied_versions text;
  expected_version text;
  is_applied boolean;
begin
  if to_regclass('supabase_migrations.schema_migrations') is null then
    raise notice 'Migration ledger supabase_migrations.schema_migrations is not available.';
    return;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'supabase_migrations'
      and table_name = 'schema_migrations'
      and column_name = 'version'
  ) then
    raise notice 'Migration ledger has no version column; inspect it using the project migration tooling.';
    return;
  end if;

  execute 'select string_agg(version::text, '', '' order by version::text) from supabase_migrations.schema_migrations'
    into applied_versions;
  raise notice 'Recorded migration versions: %', coalesce(applied_versions, '(none)');

  foreach expected_version in array array[
    '20261030090000',
    '20261031120000',
    '20261031130000',
    '20261031140000',
    '20261031150000',
    '20261031160000',
    '20261102100000'
  ] loop
    execute 'select exists (select 1 from supabase_migrations.schema_migrations where version::text = $1)'
      into is_applied using expected_version;
    raise notice 'Migration % applied: %', expected_version, is_applied;
  end loop;
end;
$check_migration_history$;

-- Required application objects, including migrations whose status must be
-- compared with the ledger notice above.
with required_migrations(version, migration_name) as (
  values
    ('20261030090000', 'add_alumni_account_status'),
    ('20261031120000', 'create_alumni_profile_on_invite'),
    ('20261031130000', 'add_homepage_content_management'),
    ('20261031140000', 'enforce_active_alumni_status'),
    ('20261031150000', 'enforce_active_alumni_resource_access'),
    ('20261031160000', 'public_directory_and_batch_content'),
    ('20261102100000', 'enforce_admin_event_and_image_access')
)
select migration_name, version as expected_version
from required_migrations
order by version;

-- Table/column contract used by the application and security migrations.
with required_columns(table_schema, table_name, column_name) as (
  values
    ('public', 'profiles', 'id'),
    ('public', 'profiles', 'email'),
    ('public', 'profiles', 'first_name'),
    ('public', 'profiles', 'last_name'),
    ('public', 'profiles', 'student_number'),
    ('public', 'profiles', 'graduation_year'),
    ('public', 'profiles', 'role'),
    ('public', 'profiles', 'account_status'),
    ('public', 'credentials', 'id'),
    ('public', 'credentials', 'profile_id'),
    ('public', 'credentials', 'credential_type'),
    ('public', 'credentials', 'file_url'),
    ('public', 'credentials', 'status'),
    ('public', 'credentials', 'verified_by'),
    ('public', 'credentials', 'verified_at'),
    ('public', 'achievements', 'id'),
    ('public', 'achievements', 'profile_id'),
    ('public', 'achievements', 'title'),
    ('public', 'batches', 'id'),
    ('public', 'batches', 'year'),
    ('public', 'batches', 'description'),
    ('public', 'batches', 'highlights'),
    ('public', 'batches', 'image_url'),
    ('public', 'events', 'id'),
    ('public', 'events', 'title'),
    ('public', 'events', 'event_date'),
    ('public', 'events', 'start_time'),
    ('public', 'events', 'end_time'),
    ('public', 'events', 'location'),
    ('public', 'events', 'image_url'),
    ('public', 'events', 'created_at'),
    ('public', 'homepage_content', 'id'),
    ('public', 'homepage_content', 'content'),
    ('public', 'homepage_content', 'updated_at'),
    ('public', 'homepage_content', 'updated_by'),
    ('public', 'audit_logs', 'id'),
    ('public', 'audit_logs', 'user_id'),
    ('public', 'audit_logs', 'action'),
    ('private', 'alumni_invite_provisioning', 'token'),
    ('private', 'alumni_invite_provisioning', 'email')
)
select
  expected.table_schema,
  expected.table_name,
  expected.column_name,
  actual.column_name is not null as present
from required_columns expected
left join information_schema.columns actual
  on actual.table_schema = expected.table_schema
 and actual.table_name = expected.table_name
 and actual.column_name = expected.column_name
order by expected.table_schema, expected.table_name, expected.column_name;

-- RLS state. audit_logs is included because it exists in the base schema but
-- currently has no repository migration that enables or defines its policies.
select
  namespace.nspname as schema_name,
  relation.relname as table_name,
  relation.relrowsecurity as rls_enabled,
  relation.relforcerowsecurity as rls_forced
from pg_class relation
join pg_namespace namespace on namespace.oid = relation.relnamespace
where (namespace.nspname, relation.relname) in (
  ('public', 'profiles'),
  ('public', 'credentials'),
  ('public', 'achievements'),
  ('public', 'batches'),
  ('public', 'events'),
  ('public', 'homepage_content'),
  ('public', 'audit_logs'),
  ('storage', 'objects')
)
and relation.relkind in ('r', 'p')
order by namespace.nspname, relation.relname;

-- Complete policy definitions, including restrictive policies that intersect
-- any older permissive policies.
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as using_expression,
  with_check
from pg_policies
where (schemaname, tablename) in (
  ('public', 'profiles'),
  ('public', 'credentials'),
  ('public', 'achievements'),
  ('public', 'batches'),
  ('public', 'events'),
  ('public', 'homepage_content'),
  ('public', 'audit_logs'),
  ('storage', 'objects')
)
order by schemaname, tablename, policyname;

-- Effective table privileges for browser-facing roles. RLS policies still
-- constrain row access; these grants show only the table-level prerequisite.
select
  table_schema,
  table_name,
  grantee,
  privilege_type
from information_schema.role_table_grants
where (table_schema, table_name) in (
  ('public', 'profiles'),
  ('public', 'credentials'),
  ('public', 'achievements'),
  ('public', 'batches'),
  ('public', 'events'),
  ('public', 'homepage_content'),
  ('public', 'audit_logs'),
  ('storage', 'objects')
)
and grantee in ('anon', 'authenticated', 'service_role')
order by table_schema, table_name, grantee, privilege_type;

-- Invitation provisioning is a private service-role-only table. These checks
-- report access without selecting any provisioning row data.
select
  case when to_regnamespace('private') is null then false
    else has_schema_privilege('anon', to_regnamespace('private'), 'USAGE') end as anon_can_use_private_schema,
  case when to_regnamespace('private') is null then false
    else has_schema_privilege('authenticated', to_regnamespace('private'), 'USAGE') end as authenticated_can_use_private_schema,
  case when to_regnamespace('private') is null then false
    else has_schema_privilege('service_role', to_regnamespace('private'), 'USAGE') end as service_role_can_use_private_schema,
  case when to_regclass('private.alumni_invite_provisioning') is null then false
    else has_table_privilege('anon', to_regclass('private.alumni_invite_provisioning'), 'SELECT') end as anon_can_read_invite_tickets,
  case when to_regclass('private.alumni_invite_provisioning') is null then false
    else has_table_privilege('authenticated', to_regclass('private.alumni_invite_provisioning'), 'SELECT') end as authenticated_can_read_invite_tickets,
  case when to_regclass('private.alumni_invite_provisioning') is null then false
    else has_table_privilege('service_role', to_regclass('private.alumni_invite_provisioning'), 'SELECT') end as service_role_can_read_invite_tickets;

-- RPC presence and execution permissions.
with required_functions(signature) as (
  values
    ('public.get_public_alumni()'),
    ('public.is_active_alumni(uuid)'),
    ('public.is_account_admin(uuid)'),
    ('public.list_active_batch_members(integer)'),
    ('public.set_alumni_account_status(uuid,text)'),
    ('public.is_homepage_admin()'),
    ('public.queue_alumni_invite_profile(uuid,text,text,text,text,text,integer,text,text)'),
    ('public.cancel_alumni_invite_profile(uuid)')
), resolved as (
  select signature, to_regprocedure(signature) as function_oid
  from required_functions
)
select
  signature,
  function_oid is not null as present,
  case when function_oid is null then null
    else has_function_privilege('anon', function_oid, 'EXECUTE') end as anon_can_execute,
  case when function_oid is null then null
    else has_function_privilege('authenticated', function_oid, 'EXECUTE') end as authenticated_can_execute,
  case when function_oid is null then null
    else has_function_privilege('service_role', function_oid, 'EXECUTE') end as service_role_can_execute
from resolved
order by signature;

-- Administrator helpers must be SECURITY DEFINER and executable only by the
-- authenticated application role, not anon. This does not reveal passwords.
select
  procedure.oid::regprocedure as function_signature,
  procedure.prosecdef as security_definer,
  procedure.proconfig as function_settings,
  has_function_privilege('anon', procedure.oid, 'EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated', procedure.oid, 'EXECUTE') as authenticated_can_execute
from pg_proc procedure
join pg_namespace namespace on namespace.oid = procedure.pronamespace
where namespace.nspname = 'public'
  and procedure.proname in (
    'is_active_alumni',
    'is_account_admin',
    'is_homepage_admin',
    'list_active_batch_members',
    'set_alumni_account_status'
  )
order by procedure.proname, procedure.oid::regprocedure::text;

-- Auth profile provisioning trigger wiring.
select
  trigger_row.tgname as trigger_name,
  trigger_row.tgenabled as enabled_state,
  trigger_row.tgfoid::regprocedure as trigger_function
from pg_trigger trigger_row
join pg_class relation on relation.oid = trigger_row.tgrelid
join pg_namespace namespace on namespace.oid = relation.relnamespace
where namespace.nspname = 'auth'
  and relation.relname = 'users'
  and trigger_row.tgname = 'on_auth_user_created_alumni_profile'
  and not trigger_row.tgisinternal;

-- Storage bucket visibility. alumni-credentials must be private; event-images
-- and batch-images are public content referenced by public pages.
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in ('alumni-credentials', 'event-images', 'batch-images')
order by id;

-- Supabase Storage object policies and write restrictions.
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as using_expression,
  with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;

-- Owner-only account inventory: reports email, role, and confirmation state
-- by joining the Auth user to its profile. It never reads password hashes or
-- tokens. Do not run with broader audiences or paste the output into logs.
select
  profile.id,
  auth_user.email as administrator_email,
  profile.role,
  auth_user.email_confirmed_at is not null as email_confirmed
from public.profiles profile
join auth.users auth_user on auth_user.id = profile.id
where profile.role in ('admin', 'head_admin')
order by profile.role, auth_user.email;

rollback;
