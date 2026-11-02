# Supabase release readiness runbook

This runbook covers the production Supabase project referenced by the frontend.
The local `.env` contains only browser-facing configuration; it cannot list Auth
users, inspect migration history, or verify private RLS and Storage policy state.
Do not treat disposable PostgreSQL CI as evidence that production matches these
migrations.

## Repository migration order versus live migration history

The repository contains eight intended migrations, but their filenames are
not a guarantee that the production migration ledger uses the same timestamps.
The live project currently reports these five recorded versions:

- `20261101190132 add_alumni_account_status`
- `20261101190135 create_alumni_profile_on_invite`
- `20261101190137 add_homepage_content_management`
- `20261101190139 enforce_active_alumni_status`
- `20261101190145 public_directory_and_batch_content`

The repository sequence is represented by the files in
`supabase/migrations/`; the live ledger is the authoritative record of what
the project says was applied. Do **not** map versions by filename order alone,
repair the ledger, or run `supabase db push` until the project owner reconciles
the name/version differences and confirms the exact SQL already represented
by each live migration.

Repository migrations relevant to release:

1. `20261030090000_add_alumni_account_status.sql`
2. `20261031120000_create_alumni_profile_on_invite.sql`
3. `20261031130000_add_homepage_content_management.sql`
4. `20261031140000_enforce_active_alumni_status.sql`
5. `20261031150000_enforce_active_alumni_resource_access.sql`
6. `20261031160000_public_directory_and_batch_content.sql`
7. `20261102100000_enforce_admin_event_and_image_access.sql`
8. `20261103120000_harden_is_admin_function.sql`

Live inspection found that the following objects from repository migration 5
are currently missing: `public.list_active_batch_members(integer)` and
`public.set_alumni_account_status(uuid,text)`. Existing Storage credential
policies do not match migration 5's definitions. The Storage buckets exist
with the intended visibility (`alumni-credentials` private; `event-images`
and `batch-images` public), but this does not prove migrations 5 or 7 were
applied.

Migration 5 depends on the base `profiles`, `credentials`, and `achievements`
tables; the `alumni-credentials` bucket; `storage.objects`; Supabase's
`storage.foldername(text)` and `auth.uid()` functions; and the authorization
helpers from migration 4. It modifies Supabase-managed Storage policies and
requires an authorized database owner.

Migration 7 depends on the base `events` table, the existing `event-images`
and `batch-images` buckets, `storage.objects`, the batch policies from
migration 6, and `public.is_account_admin()` from migration 4. Live inspection
found no `events` SELECT policy. Migration 7 adds one and constrains event,
batch, and managed-image writes to administrators. Do not treat matching bucket
visibility alone as evidence that its policies were applied.

Migration 8 hardens the existing `public.is_admin()` function by pinning its
search path, declaring it `STABLE`, and restricting execution to
`authenticated`. It depends on `public.profiles` and `auth.uid()`. It does not
resolve the missing migration 5 functions or the Storage-policy mismatch; the
owner must reconcile and test it with the rest of the live migration history.
The recorded live-ledger snapshot above has no row for migration 8's filename
timestamp, so its production application status remains unverified.

The production migration ledger and actual schema differ from the repository's
expected sequence. The owner must reconcile those differences against exact SQL
before applying, manually repairing, or marking any migration as applied.

## Before applying anything

1. Confirm you are targeting the intended project (`tthysazhswsmgcebeubg`).
2. Confirm there is a recent recoverable backup and an isolated staging project.
3. Confirm these buckets exist: `alumni-credentials`, `event-images`, and
   `batch-images`.
4. Run `docs/supabase-release-verification.sql` in the Supabase SQL Editor as
   an authorized project owner. Review migration notices, missing columns,
   RLS status, policy expressions, grants, bucket visibility, and admin rows.
5. Do not share the administrator inventory query output broadly. It displays
   Auth email addresses but never reads password hashes or tokens.
6. Review the pending migration list and dry-run output with the project owner.

## Apply missing migrations

Use the Supabase CLI from this repository, linked to the intended project and
authenticated with the database-owner connection. The owner connection must
be the PostgreSQL owner capable of altering `storage.objects` and updating
`storage.buckets`; a project API key or lower-privilege SQL role is not enough.
Do not change ownership of managed Storage tables or turn RLS off.

First inspect the remote migration ledger and proposed changes:

```powershell
supabase migration list
supabase db push --dry-run
```

If the dry run contains only reviewed migrations that are missing remotely,
the authorized owner can apply them in timestamp order:

```powershell
supabase db push
```

`db push` applies all pending local migrations, so stop if the dry run shows an
unexpected migration or migration-history mismatch. In particular, do not
mark migration 5 as applied merely because part of its SQL was attempted. The
previous `must be owner of table objects` failure should have rolled the
transaction back; verify that the version is absent and its objects are absent
before retrying as the owner.

If a project owner must execute a reviewed migration manually in SQL Editor,
the SQL Editor bypasses normal migration tracking. After verifying every
statement in the migration committed successfully, reconcile the migration
ledger using the Supabase CLI `migration repair --status applied` command for
that exact timestamp. `migration repair` only edits history; it does not apply
SQL. Never use it to conceal a failed or partially applied migration. See the
[Supabase migration deployment guide](https://supabase.com/docs/guides/deployment/database-migrations)
and [CLI migration repair reference](https://supabase.com/docs/reference/cli/supabase-migration-repair).

## Verify after applying

1. Run `supabase migration list` and confirm the owner-reconciled versions
   appear as applied. Do not assume repository migration numbers map to live
   ledger timestamps.
2. Re-run `docs/supabase-release-verification.sql` and confirm:
   - all required tables and columns are present;
   - `profiles`, `credentials`, `achievements`, `batches`, `events`,
     `homepage_content`, and `storage.objects` have RLS enabled;
  - `alumni-credentials` is private while `event-images` and `batch-images`
    are public, and anon cannot read credential objects;
   - the public alumni RPC returns only its approved columns;
   - admin write policies are restricted to admin/head-admin roles;
   - `public.is_admin()` is present, `SECURITY DEFINER`, `STABLE`, has a pinned
     search path, and is executable by `authenticated` but not `anon`;
   - credential rows and files are limited to their active owner or an admin;
   - active-alumni policies reject inactive accounts;
   - no unintended anon table write grants or permissive legacy policies remain.
3. Review `events`, `achievements`, and `audit_logs`: live inspection found
   RLS enabled with no policies on those tables. `events` requires public
   SELECT for the public Events page and admin-only writes (covered in
   migration 7). `achievements` and `audit_logs` are currently inaccessible
   through normal API roles because they have no policies; decide their intended
   owner/admin access model before designing a separate policy migration.
   Do not add broad policies simply to clear the advisor.
4. Run the disposable PostgreSQL SQL checks in CI; never run those fixture
   scripts against production.
5. In staging, test public directory, batches, events, credential upload and
   signed reads as an active alumnus; verify an inactive alumnus is denied;
   verify an ordinary alumnus cannot write events or public image buckets;
   verify an admin can manage content and credentials.

## Rollback and recovery

These migrations are additive security changes and have no automatic down
migration. If a migration fails inside a transaction, fix the cause and rerun
the complete migration as the owner; do not disable RLS or transfer ownership.
Prefer a forward corrective migration over dropping policies or restoring
table-wide grants.

Migration 7 changes `alumni-credentials` to private. Do not roll this back to
public: doing so can expose submitted identity documents. If a migration was
executed manually but its history row is absent, verify the final database
state first, then repair only the matching history version. If policies are
wrong after application, pause release and prepare a reviewed corrective
migration; do not make ad hoc production changes.

## Administrator account recovery

No initial administrator email or password is seeded or documented in the
repository. The `create-alumni` invitation flow creates alumni accounts only.
Use the account inventory query at the end of the verification SQL to see
which Auth users have an `admin` or `head_admin` profile role and whether the
email is confirmed. If it returns no rows, do not promote an alumnus or create
an administrator without explicit owner authorization.

If the project owner confirms that no administrator exists and approves
creating one, the authorized process is:

1. Create or invite the named person in Supabase Auth using the owner's
   verified identity and the institution's account-approval procedure.
2. Confirm the Auth email before granting access.
3. As database owner, create the matching `profiles` row using that Auth user's
   UUID, approved name/email, role `head_admin`, and status `active`.
4. Verify the row joins to exactly one confirmed `auth.users` record and that
   `public.is_account_admin(<that-user-uuid>)` is true in an authenticated
   session for that user.
5. Have the account owner set their password through the Supabase invitation
   or recovery email. Never set, share, or log a password in SQL or chat.

Do not alter an existing alumni profile to `head_admin` without separate,
explicit authorization. This runbook does not create an administrator.

For an existing admin, use **Admin Login → Forgot Password?**, enter the
verified Auth email, follow the email link to `/reset-password`, set a new
password, then return to Admin Login. Supabase Auth must allow the exact
`<site-origin>/reset-password` redirect and have email delivery configured.
The reset page changes only the Auth password; it does not change the profile
role. Never reset a live password as part of unattended testing.
