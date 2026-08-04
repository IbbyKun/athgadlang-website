-- Take write privileges away from the public API roles.
--
-- Supabase grants anon and authenticated all of select/insert/update/delete on
-- every new table in the public schema, and relies on row level security to
-- stop them being used. That works — an insert with the anon key is refused,
-- because the previous migration created select policies and nothing else — but
-- it leaves RLS as the only thing standing between a published-content database
-- and an anonymous writer. Disable RLS on a table by accident, or add a broad
-- policy later without thinking about the verbs it covers, and the grant is
-- already there waiting.
--
-- Nothing loses anything. Every write in this app goes through the service role
-- key, held only by server-side code, and service_role keeps its own full
-- grants. The anon key reads.
--
-- If a table ever does need to accept writes from the public API — a form that
-- inserts a lead, say — grant exactly that verb on exactly that table here, and
-- write the policy alongside it.

revoke insert, update, delete, truncate
  on public.insights, public.webinars, public.events
  from anon, authenticated;
