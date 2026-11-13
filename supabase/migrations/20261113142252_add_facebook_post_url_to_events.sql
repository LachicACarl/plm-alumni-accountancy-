-- Store the original Facebook post URL for each event.
-- Nullable to preserve existing event records.
alter table public.events
  add column if not exists facebook_post_url text;

comment on column public.events.facebook_post_url is
  'Optional HTTPS URL pointing to the original Facebook event post.';