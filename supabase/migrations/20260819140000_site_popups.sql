-- Announcement popups.
--
-- One overlay shown on arrival, for the thing the firm most wants a visitor to
-- see this week: an upcoming event, or a recording worth watching. Written and
-- scheduled from the admin panel so a seminar can be promoted without a deploy.
--
-- Deliberately not tied to a page. A popup is a property of the region and the
-- date, not of the article somebody happened to land on, so there is nowhere
-- here to say "only on /insights" — and adding one would turn a small feature
-- into a targeting engine.

create table public.site_popups (
  id           uuid primary key default gen_random_uuid(),
  -- The bright line on the dim background. The whole message, usually.
  title        text not null,
  -- One supporting sentence. Optional: a good headline rarely needs one.
  body         text not null default '',
  -- What the popup is about, and where clicking it goes. At most one of these
  -- is set — enforced below, because "a video and an event" has no answer to
  -- the question of what the button does.
  youtube_id   text,
  event_slug   text,
  -- The button's wording. Empty falls back to something the site derives from
  -- whichever of the two above is set.
  cta_label    text not null default '',
  regions      public.region_code[] not null default '{ae,bh,sa,uk,pk}',
  -- How long it runs. Both optional and inclusive: no start means "from now",
  -- no end means "until it is unpublished". Dates rather than timestamps —
  -- this is scheduled by whoever is running the campaign, in days.
  starts_on    date,
  ends_on      date,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- A popup points at one thing or at nothing at all. A popup with neither is
-- valid and is simply an announcement with no button.
alter table public.site_popups
  add constraint site_popups_one_target
  check (youtube_id is null or event_slug is null);

-- An end date that precedes its start would never show, silently. Better
-- refused at the point somebody types it.
alter table public.site_popups
  add constraint site_popups_dates_ordered
  check (starts_on is null or ends_on is null or starts_on <= ends_on);

-- The one query the public site runs: the newest live popup for a region.
create index site_popups_published_idx
  on public.site_popups (published, starts_on, ends_on);

-- Read by the anon key, like the rest of the published content, and written
-- only by the service role. Unpublished popups stay invisible: without the
-- `published` clause a draft announcement would be readable by anyone with the
-- anon key, which is in the browser.
alter table public.site_popups enable row level security;

create policy "published popups are public"
  on public.site_popups for select
  to anon, authenticated
  using (published = true);

revoke insert, update, delete, truncate
  on public.site_popups
  from anon, authenticated;
