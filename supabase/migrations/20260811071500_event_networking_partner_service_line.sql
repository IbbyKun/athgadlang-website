-- Networking events, and the two facts the events tracker records that this
-- table had nowhere to put.
--
-- All three come from importing the spreadsheet the team keeps at
-- "Events Tracker for Website", which is the first real inventory of events this
-- table has held.
--
-- `networking` is not a nicety. One of the six rows is the Agile Auditing
-- Breakfast in Riyadh — an informal gathering with no agenda and no
-- presentation. Filing that as a seminar would put a wrong answer in the
-- database to avoid a migration, and the events page shows the kind on every
-- card, so the wrong answer would be on screen.
--
-- `partner` is who an event was co-hosted with: MECA CFO Academy, IFA, or an
-- external speaker. The tracker distinguishes co-hosted events from aG-led ones,
-- and the partner is the interesting half of that distinction — "aG Led" is
-- simply the absence of a partner, so one column carries both.
--
-- `service_line` is the practice the event belongs to: Resourcing, Advisory,
-- ESG, Tax & Audit. The same idea as an article's category, and eventually the
-- join that could show a service page its own past events.
--
-- Both are plain text, not enums or foreign keys. The tracker is maintained by
-- hand and its vocabulary is still settling — "Tax & Audit" is not one of the
-- seven service slugs in src/lib/services.ts, and an enum would have rejected
-- the import rather than recorded what the business actually wrote down.
--
-- Neither column appears on the public site yet. They are populated and editable
-- in the admin panel, so the import loses nothing, and what shows them is a
-- separate decision about the events page.

-- Postgres will not let a new enum value be used in the transaction that adds
-- it, which is why nothing below writes one. The import runs afterwards.
alter type public.event_kind add value if not exists 'networking';

alter table public.events
  add column if not exists partner      text not null default '',
  add column if not exists service_line text not null default '';

comment on column public.events.partner is
  'Co-host, e.g. "IFA". Empty for an aG-led event.';
comment on column public.events.service_line is
  'Practice the event belongs to, as the events tracker words it.';
