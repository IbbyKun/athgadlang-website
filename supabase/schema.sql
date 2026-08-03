-- athGADLANG content schema.
--
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New
-- query -> paste -> Run). It is written to be re-runnable: every statement is
-- guarded, so applying it twice does not error and does not drop data.
--
-- Two tables and one storage bucket back the admin panel:
--   insights  editorial articles, body stored as Tiptap JSON
--   webinars  recorded sessions, linked out to YouTube
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

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
-- The public site reads with the anon key and must only ever see published
-- rows. The admin panel writes with the service role key, which bypasses RLS
-- entirely — so there is deliberately no insert/update/delete policy here.
-- Anything that can write is server-side code holding the service role key.

alter table public.insights enable row level security;
alter table public.webinars enable row level security;

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
