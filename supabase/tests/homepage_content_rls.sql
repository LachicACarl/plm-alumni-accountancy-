-- Runs only against the disposable PostgreSQL service in GitHub Actions.
\set ON_ERROR_STOP on

do $$
declare visible_rows integer;
begin
  select count(*) into visible_rows from public.homepage_content where id = 'main';
  if visible_rows <> 1 then raise exception 'Expected one seeded homepage row, got %', visible_rows; end if;
end $$;

set role anon;
do $$
declare visible_rows integer;
begin
  select count(*) into visible_rows from public.homepage_content where id = 'main';
  if visible_rows <> 1 then raise exception 'Anonymous visitor should read the homepage'; end if;
end $$;
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', false);
do $$
declare affected integer;
begin
  update public.homepage_content set content = content || '{"hero":{"title":"HACKED"}}'::jsonb where id = 'main';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Non-admin user unexpectedly updated homepage'; end if;
end $$;
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', false);
do $$
declare affected integer; editor uuid;
begin
  update public.homepage_content
    set content = jsonb_set(content, '{hero,title}', '"RLS TEST PASSED"'::jsonb)
    where id = 'main';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Admin should update exactly one homepage row, got %', affected; end if;
  select updated_by into editor from public.homepage_content where id = 'main';
  if editor <> '00000000-0000-0000-0000-000000000001'::uuid then
    raise exception 'updated_by trigger did not record the admin';
  end if;
end $$;
reset role;

do $$
declare title_value text;
begin
  select content #>> '{hero,title}' into title_value from public.homepage_content where id = 'main';
  if title_value <> 'RLS TEST PASSED' then raise exception 'Admin update was not persisted'; end if;
end $$;

set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', false);
do $$
declare affected integer;
begin
  update public.homepage_content set is_published = false where id = 'main';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Non-admin user unexpectedly unpublished the homepage'; end if;
end $$;
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', false);
do $$
declare affected integer;
begin
  update public.homepage_content set is_published = false where id = 'main';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Admin should unpublish exactly one homepage row, got %', affected; end if;
end $$;
reset role;

set role anon;
do $$
declare visible_rows integer;
begin
  select count(*) into visible_rows from public.homepage_content where id = 'main';
  if visible_rows <> 0 then raise exception 'Anonymous visitor must not read unpublished homepage content'; end if;
end $$;
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', false);
do $$
declare visible_rows integer;
begin
  select count(*) into visible_rows from public.homepage_content where id = 'main';
  if visible_rows <> 0 then raise exception 'Alumni must not read unpublished homepage content'; end if;
end $$;
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', false);
do $$
declare visible_rows integer;
begin
  select count(*) into visible_rows from public.homepage_content where id = 'main';
  if visible_rows <> 1 then raise exception 'Admin must retain access to unpublished homepage content'; end if;
end $$;
do $$
declare affected integer;
begin
  update public.homepage_content set is_published = true where id = 'main';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Admin should republish exactly one homepage row, got %', affected; end if;
end $$;
reset role;

set role anon;
do $$
declare visible_rows integer;
begin
  select count(*) into visible_rows from public.homepage_content where id = 'main';
  if visible_rows <> 1 then raise exception 'Anonymous visitor should read republished homepage content'; end if;
end $$;
reset role;

\echo 'Homepage content publishing and RLS tests passed.'
