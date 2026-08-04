# Outstanding work

Measured on 2026-08-04 against a production build (`npm run build && npm start`),
with Lighthouse 12.8.2 and a crawl of every internal link reachable from the
homepage. Numbers here are from that run, not estimates — re-run the commands at
the bottom to refresh them.

## Scores

Lighthouse 12.8.2 against a production build. **100 across the board.**

| Page | SEO | Accessibility | Best practices |
| --- | --- | --- | --- |
| `/` | 100 | 100 | 100 |
| `/insights` | 100 | 100 | 100 |
| `/webinars` | 100 | 100 | 100 |
| `/services/tax` | 100 | 100 | 100 |
| `/events/<event>` | 100 | 100 | 100 |
| `/privacy-policy` | 100 | 100 | 100 |

A crawl of every internal link reachable from the homepage finds **no broken
links**.

Lighthouse against `localhost` reports SEO 69, not 100. That is not a finding:
`robots.txt` returns `Disallow: /` for any host that is not one of ours, which is
deliberate so preview deployments stay out of search. To measure honestly, build
with `NEXT_PUBLIC_SITE_DOMAIN=localhost` so localhost counts as a site host.

--- | --- | --- | --- |
| `/` | 100 | 97 | 100 |
| `/insights` | 100 | 96 | 100 |
| `/insights/<article>` | 100 | 96 | 100 |
| `/webinars` | 100 | 96 | 100 |
| `/services/tax` | 100 | 96 | 100 |

Re-measure after the contrast change: it was the only remaining failure on every
page, so accessibility should now be at or near 100 throughout.

Lighthouse against `localhost` reports SEO 69, not 100. That is not a finding:
`robots.txt` returns `Disallow: /` for any host that is not one of ours, which is
deliberate so preview deployments stay out of search. To measure honestly, build
with `NEXT_PUBLIC_SITE_DOMAIN=localhost` so localhost counts as a site host.

---

## 1. Dead links — none left (was 15)

A crawl of 85 internal pages reachable from the homepage now finds **no broken
links**. Both original problems are fixed.

- [x] ~~`/privacy-policy`, `/terms-of-use`, `/legal-information`~~ — **built**
      from the supplied text, in `src/lib/legal.ts`, and listed in the sitemap.
      **One thing outstanding inside them:** see the governing-law note below.
- [x] ~~12 × `/industries/<slug>`~~ — **done.** No per-industry pages are
      planned, so the tiles are labels rather than links and `industryHref` is
      gone. The dead focus-within states went with it, since nothing inside a
      tile can take focus now.
- [ ] **`/docs/athgadlang-company-profile.pdf`** — the About page's download
      button 404s. `companyProfilePdf` in `src/lib/site-config.ts` names the path;
      drop the PDF at `public/docs/` under that name. (Not caught by the crawl,
      which skips file links.)
- [ ] **Governing law and jurisdiction is unset**, so the governing-law clause is
      omitted from Terms of Use and Legal Information rather than published with a
      blank in it. The supplied copy had `[insert governing law and jurisdiction]`;
      naming a jurisdiction in a liability clause is a legal decision and the firm
      operates in five of them. Set `governingLaw` in `src/lib/legal.ts` to the
      agreed wording and the clause appears on both pages.

## 2. Accessibility — none left (was three)

- [x] ~~Contrast on `text-neutral-400`~~ — **done.** All 17 uses moved to
      `text-neutral-500`. Checked first that none sat on a dark background, where
      the change would have made contrast worse rather than better.
- [x] ~~Imported article tables have no header row~~ — no longer reported by
      Lighthouse. Worth knowing it is still true of the data: Google Docs exports
      every cell as `<td>`, so tables from the archive have no `<th>`. Promoting a
      first row automatically would be a guess, so it is left to the editor.
- [x] ~~Contrast~~ — **all clear.** Beyond the `text-neutral-400` pass, three more
      turned up once that one was out of the way: the footer's column headings at
      `text-white/45` (3.65:1), the "Ended" event pill (4.34:1), and the footer's
      "HQ" badge in brand red on navy — 1.45:1, which no weight or size could fix,
      so it is now a filled red pill with white text.
- [x] ~~`aria-hidden` element contains focusable descendants~~ — **done.** It was
      the office map: Leaflet builds real anchors for its zoom controls and
      attribution, and while the map is a decorative backdrop `aria-hidden` hid
      them from screen readers without removing them from the tab order, so
      tabbing landed on invisible buttons. `pointer-events-none` does not help —
      it stops the mouse, not the keyboard. Now `inert`, which removes the subtree
      from both at once and reverts when the reader chooses to explore the map.
      `/services/tax` accessibility 93 → 96.

## 3. Content the team owns

Written up for handing over, with names and file paths, in
[`docs/assets-needed.md`](docs/assets-needed.md).

- [ ] **Twelve team photographs missing** of 29 named across service pages — they
      render as initials. Four are on Accounting (Muhammad Zia ul Haq, Waseem
      Yaseen, Omair Tahir, Saddam Mushtaq); the rest are listed in
      `docs/assets-needed.md`.
- [x] ~~11 leader LinkedIn URLs and 5 company social URLs~~ — **done.** All
      sixteen are live and open in a new tab; the `LINKEDIN_TBC` stub is gone.
- [ ] **Seven article titles are working filenames**, not headlines:
      `Article-Bahrain-Basma`, `UAE-BasmaMalik(1)`,
      `Britian Sleepy weepy dreepy`, `Saudi Arabia`, `Is the Four`,
      `What Do WhatsApp`, `Dropping Out Is Becoming a`. Titles came from the
      sheet because that is what the team curated; these need a human.
- [ ] **54 article categories worth checking** — inferred from the writing, since
      the tracker has no category column. One dropdown each in `/admin/insights`.
- [ ] **8 articles had no website version** in their document, only the LinkedIn
      item, so that text became the article. Worth reading before they matter.
- [ ] **7 sheet rows reuse another row's document link**, so those articles were
      never imported: *Why We Need Road Trips*, *Europe Is Heating Up*, *The
      Psychology of Skyscrapers*, *Why Britons Never Tire of Old Buildings*,
      *Kingdom's UNESCO Legacy*, *Before the Silk Road*, *Rediscovering Pakistan*.
      Verified as a sheet error, not a parsing one. Fix the links and re-import.
- [x] ~~All five social links are `#`~~ — **done**, and all five verified live.
- [ ] **Conflicting statistics.** The Consulting and Resourcing `.docx` copy gave
      different figures from the supplied Special Section graphics (Consulting
      2778/15/5/2683 against 2000+/30+/1000+; Resourcing 200,000/20,000/400/100/20/13
      against 2K+/150+/5+/10+). The site follows the graphics. The `.docx` files
      have been deleted, so **this conversation is the only remaining record** —
      needs practice sign-off.
- [x] ~~"DCC" auditor logo unidentified~~ — **DCC Energy** (dccenergy.com),
      confirmed by the firm. Labelled accordingly.

- [x] ~~Portfolio logos~~ — **all 15 live**, tiles white, served unoptimised at
      twice display size. See `docs/assets-needed.md` for what each file needed.
      Two worth revisiting: the Linde file is named "old", and the Masdar mark is
      Masdar's rather than the Masdar Institute's.

## 4. SEO opportunities beyond the audit

Lighthouse scores 100 already; these are things it does not measure.

- ~~Webinars have no pages of their own~~ — **not wanted.** They stay as a
      dialog on the listing; the `VideoObject` markup already makes them eligible
      for video results from there.
- [x] ~~Event pages have no `Event` schema~~ — **done.** Date, attendance mode,
      place or virtual location, organiser and offers. Two things it deliberately
      does not claim: `startDate` carries the day with no time, because the stored
      time is the string an invitation states ("12:00 – 13:00 GST") and turning
      that into an instant would mean guessing at daylight saving; and a
      registration link is only emitted when it is a real http URL, since several
      are still `#` and a crawler offered that rejects the whole block.
- ~~Leader portraits are 1× assets~~ — **fine as they are** on the frontend.
- [ ] **`Person` schema on leader profiles**, which is what feeds a knowledge
      panel for named partners.

## 5. Admin panel

- [ ] **Events have no presenters or agenda editor.** Both exist on the type and
      render on the page; only the form is missing them, so an event created in
      the panel omits those sections.
- [ ] **`ADMIN_PASSWORD` is `ath/admin`** — one shared password, no per-author
      attribution, and changing it signs everybody out.
      `src/lib/admin/session.ts` is the only module that knows how sessions work,
      so swapping in Supabase Auth means replacing that file and nothing else.

## 6. Before deploying

- [ ] Set the five app variables in Vercel (all environments):
      `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
      `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
      `SUPABASE_DB_URL` is for the command line only and is not read at runtime.
- [ ] Point the five hosts at the deployment: `athgadlang.com`, `bh.`, `ksa.`,
      `uk.`, `pk.` — the subdomain is what selects the region, and an unrecognised
      host falls back to the UAE.
- [ ] The database is temporary and will be replaced; `supabase/migrations/` is
      what makes the next one come out identical.

---

## Re-running the measurements

```bash
# Lighthouse needs localhost to count as a site host, or robots.txt blocks it.
NEXT_PUBLIC_SITE_DOMAIN=localhost npm run build
NEXT_PUBLIC_SITE_DOMAIN=localhost PORT=3100 npm start

CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  npx lighthouse@12 http://localhost:3100/ \
  --only-categories=seo,accessibility,best-practices \
  --chrome-flags="--headless=new" --view
```

Per-region content counts, and what each region's sitemap should list:

```bash
curl -s -H "Host: bh.athgadlang.com" http://localhost:3100/sitemap.xml | grep -c "<loc>"
```
