create policy "Alumni can read own credentials"
on public.credentials
for select
to authenticated
using (profile_id = auth.uid());
