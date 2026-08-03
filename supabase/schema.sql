-- athGADLANG content schema.
--
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New
-- query -> paste -> Run). It is written to be re-runnable: every statement is
-- guarded, so applying it twice does not error and does not drop data.
--
-- Three tables and one storage bucket back the admin panel:
--   insights  editorial articles, body stored as Tiptap JSON
--   webinars  recorded sessions, linked out to YouTube
--   events    sessions that have not happened yet, with a date and a place
--   content   public storage bucket holding uploaded cover images

-- ---------------------------------------------------------------------------
-- Regions
-- ---------------------------------------------------------------------------
-- Mirrors TenantCode in src/lib/tenants.ts. An item is shown on a regional
-- site when that site's code appears in its `regions` array, so the default
-- below publishes to every region.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'region_code') then
    create type public.region_code as enum ('ae', 'bh', 'sa', 'uk', 'pk');
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Insights
-- ---------------------------------------------------------------------------

create table if not exists public.insights (
  id           uuid primary key default gen_random_uuid(),
  -- URL segment: /insights/<slug>. Unique because it addresses the article.
  slug         text not null unique,
  title        text not null,
  excerpt      text not null default '',
  category     text not null default '',
  -- Null falls back to the house byline (see insightByline).
  author       text,
  -- Publication date shown on the card and article. Date, not timestamp: the
  -- site never displays a time, and a date avoids timezone drift in the label.
  published_at date not null default current_date,
  image_url    text not null default '',
  image_alt    text not null default '',
  -- Tiptap/ProseMirror document. Sanitised in the server action before it
  -- lands here; see sanitizeRichDoc in src/lib/rich-text.ts.
  body         jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  regions      public.region_code[] not null default '{ae,bh,sa,uk,pk}',
  -- Drafts are invisible to the public site; only the admin panel lists them.
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- The public list query is "published, for this region, newest first".
create index if not exists insights_published_at_idx
  on public.insights (published, published_at desc);

-- ---------------------------------------------------------------------------
-- Webinars
-- ---------------------------------------------------------------------------

create table if not exists public.webinars (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  published_at date not null default current_date,
  -- Free text runtime, e.g. "42 min" — matches the existing card label.
  duration     text not null default '',
  -- Bare YouTube id, not a URL. Empty means the card has nothing to open yet.
  youtube_id   text,
  image_url    text not null default '',
  image_alt    text not null default '',
  regions      public.region_code[] not null default '{ae,bh,sa,uk,pk}',
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists webinars_published_at_idx
  on public.webinars (published, published_at desc);

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------
-- Sessions that have not happened yet — distinct from `webinars`, which are
-- recordings of ones that have. Whether an event is upcoming or past is decided
-- by comparing `event_date` to today, not by a column: a stored flag would need
-- something to come along and flip it.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_kind') then
    create type public.event_kind as enum ('webinar', 'seminar');
  end if;
  if not exists (select 1 from pg_type where typname = 'event_mode') then
    create type public.event_mode as enum ('online', 'venue');
  end if;
end
$$;

create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  kind         public.event_kind not null default 'webinar',
  -- The day it runs. Named event_date rather than date to avoid colliding with
  -- the type name in queries.
  event_date   date not null default current_date,
  -- Clock time exactly as it should be shown, e.g. "12:00 – 13:00". Text, not a
  -- pair of timestamps: this is what an invitation states, and stored as text it
  -- cannot drift when rendered in another timezone.
  start_time   text not null default '',
  -- The timezone that time is stated in, e.g. "GST (UTC+4)".
  timezone     text not null default '',
  mode         public.event_mode not null default 'online',
  -- Expected when mode = 'venue', ignored otherwise.
  venue        text not null default '',
  -- Empty means free. No separate boolean: a paid event with no price and a
  -- free event would otherwise be the same row with different flags.
  price        text not null default '',
  access       text not null default '',
  excerpt      text not null default '',
  image_url    text not null default '',
  image_alt    text not null default '',
  -- Where registration happens. Empty means it is not open yet, and the page
  -- says so rather than offering a dead button.
  register_url text not null default '',
  -- For a past session, where the recording lives.
  recording_url text not null default '',
  -- Tiptap document, sanitised in the server action before it lands here.
  body         jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  regions      public.region_code[] not null default '{ae,bh,sa,uk,pk}',
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists events_event_date_idx
  on public.events (published, event_date desc);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
-- Maintained by the database rather than the application, so a row edited
-- directly in the Supabase dashboard still gets an accurate timestamp.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists insights_touch_updated_at on public.insights;
create trigger insights_touch_updated_at
  before update on public.insights
  for each row execute function public.touch_updated_at();

drop trigger if exists webinars_touch_updated_at on public.webinars;
create trigger webinars_touch_updated_at
  before update on public.webinars
  for each row execute function public.touch_updated_at();

drop trigger if exists events_touch_updated_at on public.events;
create trigger events_touch_updated_at
  before update on public.events
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
-- The public site reads with the anon key and must only ever see published
-- rows. The admin panel writes with the service role key, which bypasses RLS
-- entirely — so there is deliberately no insert/update/delete policy here.
-- Anything that can write is server-side code holding the service role key.

alter table public.insights enable row level security;
alter table public.webinars enable row level security;
alter table public.events enable row level security;

drop policy if exists "published insights are public" on public.insights;
create policy "published insights are public"
  on public.insights for select
  to anon, authenticated
  using (published = true);

drop policy if exists "published webinars are public" on public.webinars;
create policy "published webinars are public"
  on public.webinars for select
  to anon, authenticated
  using (published = true);

drop policy if exists "published events are public" on public.events;
create policy "published events are public"
  on public.events for select
  to anon, authenticated
  using (published = true);

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------
-- Cover images uploaded from the admin panel. Public-read: the URLs are
-- embedded in <Image> tags on a public website, so there is nothing to hide,
-- and it keeps the rendered markup free of signed-URL expiry.

insert into storage.buckets (id, name, public)
values ('content', 'content', true)
on conflict (id) do update set public = true;

drop policy if exists "content images are public" on storage.objects;
create policy "content images are public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'content');
