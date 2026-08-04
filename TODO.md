# Outstanding work

Measured on 2026-08-04 against a production build (`npm run build && npm start`),
with Lighthouse 12.8.2 and a crawl of every internal link reachable from the
homepage. Numbers here are from that run, not estimates — re-run the commands at
the bottom to refresh them.

## Scores

| Page | SEO | Accessibility | Best practices |
| --- | --- | --- | --- |
| `/` | 100 | 97 | 100 |
| `/insights` | 100 | 96 | 100 |
| `/insights/<article>` | 100 | 96 | 100 |
| `/webinars` | 100 | 96 | 100 |
| `/services/tax` | 100 | 93 | 100 |

Lighthouse against `localhost` reports SEO 69, not 100. That is not a finding:
`robots.txt` returns `Disallow: /` for any host that is not one of ours, which is
deliberate so preview deployments stay out of search. To measure honestly, build
with `NEXT_PUBLIC_SITE_DOMAIN=localhost` so localhost counts as a site host.

---

## 1. Dead links — 15, all on pages that exist

These are the highest priority: three of them are in the footer, so **every page
on the site links to three 404s**.

- [ ] **`/privacy-policy`, `/terms-of-use`, `/legal-information`** — linked from
      the footer sitewide, no page exists. Either write them or remove them from
      `legalLinks` in `src/lib/site-config.ts`. A law firm's site linking to a
      missing privacy policy is worse than not linking to one.
- [ ] **12 × `/industries/<slug>`** — the homepage industry cards link to pages
      that were never built: aviation, financial-services, food-and-beverages,
      logistics, manufacturing, media, non-profit, oil-and-gas, real-estate,
      retail, technology, telecommunication. `industryHref` in
      `src/lib/industries.ts` builds the URL. Either build the pages or make the
      cards non-links.
- [ ] **`/docs/athgadlang-company-profile.pdf`** — the About page's download
      button 404s. `companyProfilePdf` in `src/lib/site-config.ts` names the path;
      drop the PDF at `public/docs/` under that name.

## 2. Accessibility — the three things Lighthouse flags

- [ ] **Contrast on `text-neutral-400`** (every page). Used for eyebrow labels and
      muted metadata on light backgrounds; fails 4.5:1. `text-neutral-500` passes
      and is a one-token change, but check it against the design first.
- [ ] **Imported article tables have no header row** (`/insights/<article>`).
      Google Docs exports every cell as `<td>`, so tables converted from the
      archive have no `<th>`. Fixable in the editor per article, or by promoting
      each table's first row during import — but only if the first row really is a
      header, which is not guaranteed.
- [ ] **`aria-hidden` element contains focusable descendants** (`/services/*`).
      A decorative `bg-brand-navy` overlay is hiding something reachable by
      keyboard. Add `pointer-events-none` plus `tabindex="-1"` on the descendant,
      or move it out of the hidden container.

## 3. Content the team owns

- [ ] **Four Accounting portraits missing** — Muhammad Zia ul Haq, Waseem Yaseen,
      Omair Tahir, Saddam Mushtaq render as monograms. Not in the partner folder.
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
- [ ] **All five social links are `#`** in `socialLinks`. The icons render and go
      nowhere.
- [ ] **Conflicting statistics.** The Consulting and Resourcing `.docx` copy gave
      different figures from the supplied Special Section graphics (Consulting
      2778/15/5/2683 against 2000+/30+/1000+; Resourcing 200,000/20,000/400/100/20/13
      against 2K+/150+/5+/10+). The site follows the graphics. The `.docx` files
      have been deleted, so **this conversation is the only remaining record** —
      needs practice sign-off.
- [ ] **"DCC" auditor logo unidentified** — a bare three-letter wordmark. Could be
      Dubai CommerCity or Dubai Chamber of Commerce.

## 4. SEO opportunities beyond the audit

Lighthouse scores 100 already; these are things it does not measure.

- [ ] **Webinars have no pages of their own.** They play in a dialog on one
      listing, so 27 recordings share a single URL. A page each would add ~135
      indexable URLs across the five regions, each with its own `VideoObject`,
      title and description. Probably the single largest remaining SEO gain.
- [ ] **Event pages have no `Event` schema** — what produces date, venue and
      ticket rich results.
- [ ] **Leader portraits are 1× assets** (224×299). Profile pages render them at
      320px, so 640px on a retina screen. Re-export at 448×598 and replace the
      files; no code change needed.
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
