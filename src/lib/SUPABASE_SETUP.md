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
