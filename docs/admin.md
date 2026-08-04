# Content admin

`/admin` is a small CMS for the three parts of the site that change often:

- **events** — sessions that have not happened yet, with a date, a place, a cost
  and a registration link
- **insights** — articles, written in a rich text editor
- **webinars** — recordings of sessions that already ran, linked to YouTube

Everything else on the site is still content in `src/lib`, edited in code.

---

## Setting it up

### 1. Create the database

The schema lives in [`supabase/migrations/`](../supabase/migrations/) as
timestamped SQL files, applied in order. Point `SUPABASE_DB_URL` at the database
(step 2) and run:

```bash
npm run db:push          # apply everything the database has not seen
npm run db:status        # what is applied, what is pending
npm run db:push -- --dry-run
```

Between them the migrations create:

- the `events`, `insights` and `webinars` tables,
- row level security policies that let the anon key read **published rows only**,
  and no privileges at all to write,
- a public `content` storage bucket for uploaded cover images.

**Changing the schema.** Never edit an applied migration — a database that has
already run it will not run it again, so the file and the database would drift.
Add a new one instead:

```bash
npm run db:new -- add_webinar_presenters   # writes an empty timestamped file
```

Fill it in, `npm run db:push`, and commit it. That is what makes a fresh database
— a staging project, a colleague's, a restored backup — come out identical to
production.

`npm run db:*` shell out to the Supabase CLI via `npx`, so there is nothing to
install globally.

### 2. Fill in the environment

Copy `.env.example` to `.env.local` and complete it. The Supabase keys are in
**Project Settings → API Keys**, the connection string in **Database**.

| Variable | Where it comes from | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Also tells `next.config.ts` to allow images from the storage host |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key | Safe to expose; RLS limits it to published rows |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role / secret key | **Server only.** Bypasses RLS |
| `SUPABASE_DB_URL` | Project Settings → Database → Connection string | Migrations only. Port **5432** (session mode), not 6543 |
| `ADMIN_PASSWORD` | you choose | The shared password for `/admin` |
| `ADMIN_SESSION_SECRET` | generate one | Signs the session cookie; changing it signs everyone out |

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Restart the dev server afterwards — `next.config.ts` reads the Supabase URL at
startup, so a running server will not pick it up.

### 3. Deploying

Set the five **app** variables in the Vercel project (all environments) —
everything above except `SUPABASE_DB_URL`, which is only for the local command
line and is not read at runtime. The `NEXT_PUBLIC_` ones are baked into the
build, so changing them needs a redeploy, not just a restart.

---

## Using it

Sign in at `/admin`. The password is shared, so there is no per-author
attribution — see *Limits* below.

**Draft or live.** Everything saves as a draft by default. A draft is invisible
to the public site: it is not on the listing, has no page, and is not in the
sitemap. The switch at the bottom of the form makes it live.

**Regions.** Each item names the regional sites it appears on — UAE, Bahrain,
KSA, UK, Pakistan. Every region is ticked by default. A UK-only article never
renders on `ksa.athgadlang.com`.

**Publishing is immediate.** Saving invalidates the cached pages, so the change
is live on the next request. There is no rebuild and no wait.

### Writing an article

The editor supports headings (H2/H3), bold, italic, underline, strikethrough,
bulleted and numbered lists, quotes, and links. H1 is not offered because the
article title is already the page's H1.

The **first paragraph becomes the standfirst** — set larger and ruled off from
the rest, matching the existing articles.

Publishing an article requires a cover image and a body; a draft does not, so
you can save unfinished work.

### Adding an event

**Format** decides the rest of the "where": choose *Online* and there is nothing
more to say; choose *At a venue* and the venue field appears and is required.
Switching an event back to online clears any venue it was carrying, so a page can
never say "Online" while holding an address.

**Cost** works the same way — *Paid* reveals the price field. There is no stored
"is it paid" flag: an empty price *is* free, so a paid event with no price and a
free event cannot end up as the same row with different booleans.

**Timings are text, and nothing is converted.** Enter them as they appear on the
invitation — "12:00 – 13:00" — and state the timezone alongside. The page shows
exactly that. The group runs sessions across five regions, and a stated local
time that cannot drift beats a timestamp rendered in whoever's timezone the
server happens to be in.

**Registration link** is where the Register button goes. Leave it blank while
registration is not open and the page says so rather than showing a dead button.

**Upcoming or past is decided by the date**, not by a switch. Once the date
passes, the event moves itself into the "Previous Events" shelf and its page
offers the recording instead of registration — so add a **recording link** after
the session has run.

Two things the form does not capture yet: **presenters** and the **running
order**. The built-in test events have both, and their pages render those
sections; an event created here simply omits them.

### Adding a webinar

Paste the YouTube address straight from the browser — `watch?v=`, `youtu.be/`,
`/embed/`, `/live/` and `/shorts/` are all understood, as is a bare video id.
Cards open the recording on YouTube in a new tab, so a session cannot go live
without a link.

**The thumbnail comes with the link.** As soon as a valid address is in the
field, the video's own still appears in the Thumbnail panel and that is what the
card will use — there is nothing to upload. Uploading an image overrides it, for
when the still YouTube picked is a bad frame.

The still is fetched from `i.ytimg.com` at its largest available size: 1280×720
where the video has it, falling back to 480×360, which every video has. That
fallback is not cosmetic — YouTube answers **404** for a 1280×720 still that does
not exist, and `next/image` cannot optimise what it cannot fetch, so the card
would show a broken image. `src/lib/content.ts` checks before pointing a card at
the larger one.

Runtime is optional. Left blank, the card shows no duration badge.

---

## How it fits together

The site keeps **two sources of content**, on purpose:

- the events and articles written into `src/lib/events.ts` and
  `src/lib/insights.ts`, which predate the database
- the rows published from this panel, which is now every webinar: the built-in
  array in `src/lib/webinars.ts` is deliberately empty

`src/lib/content.ts` merges them per region, newest first. The built-in items
do not appear in the admin lists and cannot be edited there. **Publishing
something with the same URL slug replaces the built-in version** — which is the
migration path when the original article files arrive: re-enter one, and the
hardcoded copy stops being used without anyone having to delete the TypeScript.

Article bodies are stored as ProseMirror JSON rather than HTML. The document is
re-serialised through a fixed schema on the way out
(`src/lib/rich-text.ts`), so only the elements the editor can produce can ever
reach the page — that is what makes rendering it safe.

Caching is tag-based. Saving calls `revalidateTag`, which expires the merged
lists and, with them, every page that read one: the homepage, the two indexes,
the article pages, and the related rails on service pages. There is a 5-minute
time-based revalidate behind that as a backstop.

---

## Limits worth knowing

- **One shared password.** No per-author attribution, and rotating it signs
  everybody out at once. `src/lib/admin/session.ts` is the only module that
  knows how sessions work — swapping in Supabase Auth means replacing that file
  and nothing else.
- **Site search does not index admin content.** The navbar search is built from
  the `src/lib` arrays at build time, so newly published articles and sessions
  are not findable through it yet. Making it live would mean either fetching the
  index at runtime or tying every page's cache to the content tag.
- **Deleting leaves the image behind.** Removing an article does not remove its
  uploaded cover from storage. Deliberate: items are often deleted and
  re-created, and an orphaned file costs less than a broken image.
- **Categories are a fixed list**, in `insightCategories` in
  `src/lib/admin/queries.ts`. Free text would fragment the set. Event timezones
  are a suggestion list in the same file — that field stays free text, since a
  session can be run from anywhere.
- **Events have no presenter or agenda editor.** The fields exist on the type and
  render on the page; only the admin form is missing them.
