# Content admin

`/admin` is a small CMS for the two parts of the site that change often:
**insights** (articles, written in a rich text editor) and **webinars**
(recorded sessions linked to YouTube). Everything else on the site is still
content in `src/lib`, edited in code.

---

## Setting it up

### 1. Create the database

In the Supabase dashboard, open **SQL Editor → New query**, paste the whole of
[`supabase/schema.sql`](../supabase/schema.sql), and run it. It creates:

- the `insights` and `webinars` tables,
- row level security policies that let the anon key read **published rows only**,
- a public `content` storage bucket for uploaded cover images.

It is safe to run again — every statement is guarded, and re-running does not
drop data.

### 2. Fill in the environment

Copy `.env.example` to `.env.local` and complete it. The Supabase values are in
**Project Settings → API**.

| Variable | Where it comes from | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Also tells `next.config.ts` to allow images from the storage host |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key | Safe to expose; RLS limits it to published rows |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role / secret key | **Server only.** Bypasses RLS |
| `ADMIN_PASSWORD` | you choose | The shared password for `/admin` |
| `ADMIN_SESSION_SECRET` | generate one | Signs the session cookie; changing it signs everyone out |

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Restart the dev server afterwards — `next.config.ts` reads the Supabase URL at
startup, so a running server will not pick it up.

### 3. Deploying

Set the same five variables in the Vercel project (all environments). The
`NEXT_PUBLIC_` ones are baked into the build, so changing them needs a redeploy,
not just a restart.

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

### Adding a webinar

Paste the YouTube address straight from the browser — `watch?v=`, `youtu.be/`,
`/embed/`, `/live/` and `/shorts/` are all understood, as is a bare video id.
Cards open the recording on YouTube in a new tab, so a session cannot go live
without a link.

---

## How it fits together

The site keeps **two sources of content**, on purpose:

- the articles and sessions written into `src/lib/insights.ts` and
  `src/lib/webinars.ts`, which predate the database
- the rows published from this panel

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
  `src/lib/admin/queries.ts`. Free text would fragment the set.
