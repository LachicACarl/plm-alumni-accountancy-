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
