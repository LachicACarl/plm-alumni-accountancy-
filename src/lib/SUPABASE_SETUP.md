# Supabase Database Setup

## 1. Create the database tables

Run:
src/lib/database.sql

## 2. Add initial batch data

Run:
src/lib/seed.sql

## Tables

- profiles
- batches
- events
- achievements
- credentials
- audit_logs

## Authentication

Supabase Authentication will be used for alumni, admin, and head-admin accounts.

### Password recovery

The login page sends reset emails with a redirect to:

```text
https://your-frontend-host/reset-password
```

In Supabase Dashboard, open **Authentication > URL Configuration** and add
the deployed URL above to **Redirect URLs**. For local testing, also add:

```text
http://localhost:5173/reset-password
```

If the development server uses another origin or port, add that exact URL
instead. The frontend does not require a service-role key for this flow.
Confirm that an email provider is enabled and that the reset-email template
uses the Supabase recovery link. These dashboard settings must be applied
manually; the application does not change production Auth configuration.

## Frontend environment variables

Create a local `.env` file by copying `.env.example`, then set:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
```

These variables are read by Vite during the build. They must be configured in
the hosting platform's project settings as build-time environment variables
before starting a new production deployment. After saving them, trigger a
fresh deployment so the values are embedded in the new frontend build.

Use only the Supabase publishable/anon key in frontend variables. Never add
`SUPABASE_SERVICE_ROLE_KEY` or any other server secret to `.env`, hosting
frontend variables, or source code.

## Administrator-created alumni invitations

The admin invitation endpoint requires the database provisioning migration and a
server-side Edge Function secret. The setup SQL files above do **not** create
these objects by themselves.

### Required database migration

Before enabling the updated `create-alumni` Edge Function, apply:

```text
supabase/migrations/20261031120000_create_alumni_profile_on_invite.sql
```

This migration creates a private one-time provisioning-ticket table, service-role-only
RPCs, and the Auth trigger that creates the alumni profile in the same database
transaction as the invited Auth user. It must be applied once per environment.

If the frontend change that reads `profiles.account_status` is also being deployed,
apply the account-status migration from PR #5 first:

```text
supabase/migrations/20261030090000_add_alumni_account_status.sql
```

For a fresh isolated development database, link the Supabase CLI to that
development project and run `supabase db push` only after reviewing the pending
migration list. Do not run it against the production project as a test. This
repository intentionally does not auto-apply migrations or mutate a connected
project during CI.

### Edge Function secret and deployment

Set the function's allowed frontend origin as a server-side secret (never a
`VITE_*` variable):

```bash
supabase secrets set FRONTEND_ORIGIN=https://plm-alumni-accountancy.onrender.com
```

For local development, use the exact local frontend origin instead, for example
`http://localhost:5173`.

The function verifies the caller's Bearer token with Supabase Auth and checks
the caller's administrator role itself. The function config therefore keeps
platform JWT verification disabled; do not remove the in-function
authentication checks:

```toml
[functions.create-alumni]
verify_jwt = false
```

After the migration and secret are configured in the intended environment,
deploy the function explicitly:

```bash
supabase functions deploy create-alumni --no-verify-jwt
```

### Auth invitation redirect and email

In **Supabase Dashboard → Authentication → URL Configuration**, add the exact
invitation callback URL:

```text
https://plm-alumni-accountancy.onrender.com/reset-password
```

For local development, add the exact local callback URL as well. Ensure the
Auth email provider is enabled and test actual invite delivery, the invite
callback, initial password setup, and subsequent sign-in in an isolated
environment before production deployment.

**Production safety:** the connected Supabase project is production. Do not
apply these migrations, change Auth URL/email settings, set secrets, or deploy
the function there until a reviewed production release is explicitly approved.
Never create a paid Supabase branch or project for this workflow.

## Security

Row Level Security (RLS) should be enabled before production deployment.

Never expose the Supabase service_role key in the frontend.


## Password recovery

The login page sends password recovery requests through Supabase Auth using
`resetPasswordForEmail()`. The recovery email redirects to the public
`/reset-password` route, where a user can set a new password through
`updateUser({ password })`.

In **Supabase Dashboard → Authentication → URL Configuration**:

1. Set the production Site URL to the deployed application origin.
2. Add the exact production redirect URL:
   `https://YOUR-DEPLOYED-DOMAIN/reset-password`
3. Add the local development redirect URL:
   `http://localhost:5173/reset-password`

Replace the production placeholder with the actual Render domain. Do not add
wildcard redirects unless they are required and appropriately restricted.

Ensure the Supabase Auth email provider is enabled and the password recovery
email template uses the Supabase recovery link. For reliable production
delivery, configure a verified custom SMTP provider and check its delivery
logs. Supabase Auth logs and SMTP provider logs should be used to diagnose
missing recovery emails.

The reset page accepts password changes after a `PASSWORD_RECOVERY` event with
an active session, or after a `SIGNED_IN` event when the callback URL explicitly
identifies a Supabase invitation (`type=invite`). A normal existing login
session is not treated as proof of a recovery or invitation authorization.
