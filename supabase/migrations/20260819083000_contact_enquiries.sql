-- Contact enquiries.
--
-- The contact form validated an enquiry properly and then dropped it: the
-- route logged a line and returned "we'll be in touch". Every lead the site
-- has taken so far exists only in a server log that rotates. This is where
-- they go now.
--
-- Storing them is deliberately separate from mailing them. Delivery needs
-- credentials we do not have yet, and whichever way it is eventually sent, a
-- provider that is down or misconfigured should not be the only copy of
-- somebody's name and number. The table is the record; mail is a notification
-- about it.
--
-- Written with the service role key from the API route, as with every other
-- write here — see restrict_anon_writes for why the public roles get nothing.

create table public.contact_enquiries (
  id           uuid primary key default gen_random_uuid(),
  first_name   text not null,
  last_name    text not null,
  -- Lowercased before writing, as in newsletter_subscribers. Not unique: the
  -- same person asking twice about two different things is two enquiries, and
  -- collapsing them would lose the second question.
  email        text not null,
  phone        text not null,
  -- Optional on the form, so optional here. Stored as given, whitespace
  -- trimmed and nothing else.
  message      text not null default '',
  -- Which regional site it came from, taken from the request host rather than
  -- the form. Decides who picks it up.
  region       public.region_code,
  -- The page they were on, from the Referer header — the contact form sits on
  -- the homepage and on every service page, and "which service were they
  -- reading" is the most useful thing about a lead after their number.
  -- Path only; nullable because a browser need not send a referer.
  source_path  text,
  -- Ticked off in the admin panel once somebody has replied. Null is the
  -- queue, which is the list anyone opening this page actually wants.
  handled_at   timestamptz,
  created_at   timestamptz not null default now()
);

-- The panel's only ordering, and what its pagination pages through.
create index contact_enquiries_created_at_idx
  on public.contact_enquiries (created_at desc);

-- Row level security with no policies: the anon key can neither read nor write
-- a table of people's names, numbers and questions. The service role bypasses
-- RLS and is what the API route and the admin panel use.
alter table public.contact_enquiries enable row level security;

revoke select, insert, update, delete, truncate
  on public.contact_enquiries
  from anon, authenticated;
