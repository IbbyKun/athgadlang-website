-- Newsletter subscribers.
--
-- The sign-up form in the footer validated an address and then threw it away:
-- the route logged it and returned success. This is where those addresses go
-- now, so a campaign can be sent to the people who asked for one.
--
-- Written with the service role key from the API route, the same as every
-- other write in this app — see the restrict_anon_writes migration for why the
-- public API roles are not given insert here.

create table public.newsletter_subscribers (
  id           uuid primary key default gen_random_uuid(),
  -- Lowercased before it is written, so one person cannot subscribe twice by
  -- capitalising differently. Unique: re-subscribing updates the row instead
  -- of adding another one.
  email        text not null unique,
  -- Which regional site they signed up on. Useful for sending regionally
  -- relevant campaigns, and for knowing which site is doing the converting.
  region       public.region_code,
  -- Set once the address has been handed to the email platform. Null means it
  -- is still only here, which is what every row will be until that
  -- integration is connected.
  synced_at    timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- The one query anyone will run: who has not been pushed to the platform yet.
create index newsletter_subscribers_synced_at_idx
  on public.newsletter_subscribers (synced_at, created_at desc);

-- Row level security with no policies: the anon key can neither read nor write
-- this table, which is right for a list of people's email addresses. The
-- service role bypasses RLS and is what the API route uses.
alter table public.newsletter_subscribers enable row level security;

revoke select, insert, update, delete, truncate
  on public.newsletter_subscribers
  from anon, authenticated;
