-- Presenters and running order for managed events.
--
-- Both already existed on the EventItem type and both already render on an
-- event page — only the admin form could not capture them, so every event
-- created in the panel silently omitted those two sections while the built-in
-- ones showed them. This closes that gap.
--
-- jsonb arrays rather than two child tables. They are ordered lists that are
-- only ever read as a whole, alongside the event, and never queried across
-- events or joined to anything: "which events did this person present at" is
-- not a question this site asks. A child table would buy referential integrity
-- we have no use for and cost a second round trip on every event read.
--
-- Shapes, matching EventSpeaker and EventAgendaItem in src/lib/events.ts:
--
--   speakers: [{ "name": "…", "role": "…", "leader": "arshad-gadit" | null }]
--   agenda:   [{ "time": "12:10", "title": "…" }]
--
-- `leader` is a leadership-team slug and is optional. Where it is set the
-- speaker gets their portrait and a link to their profile; where it is not they
-- get their initials. It is deliberately not a foreign key — the leadership
-- roster lives in the codebase, not the database.
--
-- Both default to an empty array rather than null, so a row always holds a list
-- and reading code never has to distinguish "no presenters" from "not set".

alter table public.events
  add column speakers jsonb not null default '[]'::jsonb,
  add column agenda   jsonb not null default '[]'::jsonb;

-- Reject anything that is not an array. The server action validates each entry's
-- shape before writing, but that is application code and this column is reachable
-- with the service role key from anywhere; an object or a string landing here
-- would make the page's .map() throw at render time on every region.
alter table public.events
  add constraint events_speakers_is_array
    check (jsonb_typeof(speakers) = 'array'),
  add constraint events_agenda_is_array
    check (jsonb_typeof(agenda) = 'array');
