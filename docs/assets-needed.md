# What we still need from you

Everything on this list is a placeholder in the live code. Nothing here is a bug
to fix — it is content only the firm can supply. Each section says exactly where
it goes, so you can send it back in any format.

Audited 2026-08-04 against the codebase.

---

## 1. LinkedIn profiles — done

All eleven are live on the partner and director pages, opening in a new tab.

| Name | Profile |
| --- | --- |
| Arshad Gadit | `/in/arshadgadit/` |
| Saqib Nisar | `/in/forensics-consultant/` |
| Sikandar Gadit | `/in/sikandergadit/` |
| Usman Alam | `/in/usman-alam-a3434a30/` |
| Yasir Gadit | `/in/yasirgadit/` |
| Arslan Mushtaq | `/in/arslan-mushtaq-73222311/` |
| Abdul Aziz Lang | `/in/abdul-aziz-lang-9814aa23/` |
| Abdullah Taimoor | `/in/abdullahtaimoor/` |
| Haziq Neshat Akhtar | `/in/haziq-neshat-akhtar-a1419121/` |
| Osman Babar | `/in/muhammadosmanbabar/` |
| Khushboo Mushtaq | `/in/khushboo-mushtaq-aca-17b5a057/` |

Ten of the eleven URLs name the person, so the mapping was unambiguous. The
eleventh, `/in/forensics-consultant/`, names a speciality rather than a person —
its own page metadata says **Saqib Nisar**, which is how it was assigned rather
than by position in the list.

## 2. Company social profiles — done

All five are live in the footer and all five resolve:

| Platform | URL |
| --- | --- |
| LinkedIn | `https://www.linkedin.com/company/athgadlang/` |
| Facebook | `https://www.facebook.com/athGADLANG.FinanceConsultingFirm` |
| X | `https://x.com/athGADLANG` |
| YouTube | `https://www.youtube.com/@athGADLANG` |
| Instagram | `https://www.instagram.com/athgadlang/` |

One deliberate change: the LinkedIn URL supplied was the posts feed
(`/posts/?feedView=all`), which is a view of the team's own dashboard. The footer
points at the company page itself, which is where a visitor should land.

## 3. Footer links

### Legal pages — built

Privacy Policy, Terms Of Use and Legal Information are live from the text you
supplied, at `/privacy-policy`, `/terms-of-use` and `/legal-information`. The
wording lives in `src/lib/legal.ts`.

Three bracketed placeholders came with that text. Two are answered from the
firm's own details and are filled in:

- `[insert location]` → **Dubai, United Arab Emirates**, per the head office address
- `[insert contact information]` → the email, phone and office address already on
  the contact section

**The third needs you: `[insert governing law and jurisdiction]`.** Naming a
jurisdiction in a limitation-of-liability clause is a legal decision, and the firm
operates in five. Rather than publish a page with a blank in it, the
governing-law clause is left out until the wording is agreed — set `governingLaw`
in `src/lib/legal.ts` and it appears on both pages that need it.

### Working, listed for confirmation

These resolve today. Worth confirming they go where you expect:

| Label | Goes to |
| --- | --- |
| Events, Insights, Webinars | the listing pages on this site |
| Industries | the homepage industries section |
| Our Leaders | the homepage leaders section |
| Company Profile | `/company-profile` |
| Careers | `https://recruit.athgadlang.com/` — confirm this is the right portal |

### One missing file

- **Company profile PDF** — the download button on the About page 404s. Drop the
  file at `public/docs/athgadlang-company-profile.pdf`, or send it and we will.

---

## 4. Leadership portraits — complete

All eleven partner and director portraits are in place and are the real supplied
photographs. Nothing needed.

**One optional improvement:** they were supplied at 224×299, which is a 1×
asset. The profile pages render them at 320px wide, so on a retina screen the
browser upscales them and they look softer than they should. **Re-exported at
448×598 they would be sharp** — same filenames, no code change:

```
arshad-gadit.png      saqib-nisar.png       sikandar-gadit.png
usman-alam.png        yasir-gadit.png       arslan-mushtaq.png
abdul-aziz-lang.png   abdullah-taimoor.png  haziq-neshat-akhtar.png
osman-babar.png       khushboo-mushtaq.png
```

---

## 5. Team member photographs — 12 needed

Service pages name 29 team members. **17 have a photograph; 12 render as their
initials in a coloured circle.** That looks deliberate rather than broken, so
there is no rush — but a photograph is better.

Needed, grouped by the page they appear on:

**Accounting**
- Muhammad Zia ul Haq
- Waseem Yaseen
- Omair Tahir
- Saddam Mushtaq

**Other service pages**
- Ammar Hussain
- Laiba *(first name only in the data — full name would help)*
- Suhail Memon
- Rahul Manwni
- Ghulam Ashraf
- Mohd Furqan
- Numair Kulkarni
- Wardah Siddiquie

Same treatment as the existing ones: a head-and-shoulders photograph on a plain
white background. **224×299 or larger**, PNG or JPEG. Name each file after the
person and we will wire them up.

Already on file, for reference: Ammar Kagdhi, Syed Ali Hassan, Usman Hussain,
Ramesh Lama, Ali Ahmad Zahid, Bilal Shehbaz, Ateeb Khan, Nisarg Sheth, Farrukh
Fayyaz, Adil Askari, Tariq Islam, Altaf Bhutta, Hira Sikander, Khushboo Mushtaq,
Sneha Mehta, Masood Ahmed.

---

## 6. Client logos for the portfolio — 15 needed, and one design decision first

The portfolio roster renders every client as a typographic wordmark. That is
deliberate: no logo files exist in the repository, and `LogoTile` falls back to
type rather than showing a stand-in, because a wrong or redrawn mark
misrepresents someone else's trademark.

### The design decision that comes first

The tiles are **brand red, inverting to white on hover** (`bg-brand` →
`hover:bg-white` in `src/components/portfolio/logo-tile.tsx`). No single logo
file works on both: a colour logo disappears on red, a white knockout disappears
when the tile turns white. Before any logo is added, one of these has to happen:

1. **Make the tiles white** and use full-colour logos on transparent
   backgrounds. This is what the current live site does, and it is what brand
   guidelines almost always permit. Recommended.
2. **Keep the red tiles**, use white knockout logos, and drop the hover
   inversion. Consistent, but flattens fifteen brands to one colour.
3. Two files per client, light and dark. Thirty files. Not realistic.

### What an automated search could and could not find

Asked to source these from the web, checking only official company sources — not
logo aggregator sites, which are where outdated and redrawn marks come from:

| Client | Result |
| --- | --- |
| **TCL** | Official SVG found on tcl.com — correct red wordmark |
| **Bloom Energy** | Official SVG found on bloomenergy.com — correct |
| **GymNation** | Official SVG found, but it is the **white** variant for dark headers; on a white tile only the yellow mark would show |
| **Al Habtoor** | Only a white PNG (`AHG-logo-white.png`), wrong variant and not vector |
| Linde, Alshaya, CitrussTV, Masdar | Sites are JavaScript-rendered or refuse automated requests; no asset path to find |
| AKI, Jetstream, Spotii, Footprint, Kishmish, Pink Camel, Chai and Co. | Not reachable, or the official domain could not be confirmed |

So: **3 of 15 cleanly, and one of those three is the wrong colour variant.**
Wiring up three logos beside twelve wordmarks would look less deliberate than
fifteen wordmarks do now.

### One roster entry worth questioning

**Masdar Institute has not existed as a brand since February 2017**, when it
merged with KUSTAR and the Petroleum Institute to become Khalifa University; the
site is now the Masdar City campus. The work may well have been done for them, but
there is no current official mark to source, and the name may want revisiting.

### What would actually settle it

Ask each client for their logo. It is the only way to get the current, approved
mark, and for a client roster it is the normal request. **SVG** — vector solves
the quality problem permanently rather than moving it to a bigger PNG. Failing
that, PNG at twice the display size (**at least 480 × 200**) on a transparent
background. Name each file after the client and they can be wired up in one pass:
`logo: "/images/logos/<file>.svg"` on each entry in `src/lib/clients.ts`.

---

## 6. Two things needing a decision, not a file

- **"DCC" auditor logo.** The approved-auditors strip includes a logo that is a
  bare three-letter wordmark. We cannot tell whether it is **Dubai CommerCity**
  or the **Dubai Chamber of Commerce** — tell us which and we will label it.
- **Conflicting figures.** The Consulting and Resourcing statistics bands differ
  between the copy documents originally supplied and the finished graphics.
  The site follows the graphics:
  - Consulting — documents said 2778 / 15 / 5 / 2683; graphic says 2000+ / 30+ / 1000+
  - Resourcing — documents said 200,000 / 20,000 / 400 / 100 / 20 / 13; graphic says 2K+ / 150+ / 5+ / 10+

  The documents have since been deleted, so these numbers exist only here. Please
  confirm which set is correct before launch.

---

## 7. Article content worth a read

Not blocking, but these came out of the newsletter archive import and need a
human eye. Full detail in [`TODO.md`](../TODO.md).

- **7 article titles are working filenames**, not headlines — e.g.
  `Article-Bahrain-Basma`, `UAE-BasmaMalik(1)`, `Britian Sleepy weepy dreepy`,
  `Saudi Arabia`, `Is the Four`.
- **7 articles were never imported** because the tracking sheet has the same
  Google Doc linked on more than one row. Fix the links in the sheet and we can
  re-run the import.
- **All 154 cover images are stock photography** from a pool of 13, assigned
  automatically. Replaceable one at a time in `/admin/insights`.
