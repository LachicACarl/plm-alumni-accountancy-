# Supabase Database Setup

## 1. Create the database tables

Run:
src/lib/database.sql

## 2. Add initial batch data

Run:
src/lib/seed.sql

## 3. Apply Supabase migrations in timestamp order

After creating the base schema and loading the batch seed data, apply every
migration in `supabase/migrations/` in ascending filename order:

1. `20261030090000_add_alumni_account_status.sql`
2. `20261031120000_create_alumni_profile_on_invite.sql`
3. `20261031130000_add_homepage_content_management.sql`
4. `20261031140000_enforce_active_alumni_status.sql`
5. `20261031150000_enforce_active_alumni_resource_access.sql`

The admin invitation Edge Function depends on the private provisioning RPC
created by migration 2. Do not deploy the function until this migration has
been applied.

Apply and validate migrations in an isolated staging project before using
them in production. SQL regression tests under `supabase/tests/` are designed
for disposable PostgreSQL databases and must never be run against production.

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

The reset page accepts a password change only after the Supabase client emits
the `PASSWORD_RECOVERY` auth event with an active session. A normal existing
login session is not treated as a recovery authorization.
