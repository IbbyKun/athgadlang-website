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

## 6. Client logos — 14 of 15 live

Fourteen are on the site. The tiles changed from brand red to **white** to make
that possible: a client's logo is not ours to recolour, the supplied marks are
full colour on white, and the old red-inverting-to-white hover meant no single
file could survive both states.

What was done to the supplied files:

- **Normalised onto one 768 × 224 canvas**, four times the display size. Capping
  height alone had let the wide marks — Al Habtoor, CitrussTV, Pink Camel, Spotii
  — run past the edges of the card. Sharing a canvas is also what makes the row
  read as a set rather than as fifteen marks each as large as its aspect ratio
  allowed.
- **`alkhayat_logo.avif` converted** — the local ImageMagick has no AVIF decoder,
  so `sips` did it.
- **TCL and Bloom Energy** were not in the folder; both came from official SVGs on
  the companies' own sites.

### Still outstanding: Footprint Real Estate

The only artwork supplied was a **marketing banner** — the mark set in white over
a photograph of the Dubai skyline under an orange wash. White type cannot be
lifted off a photograph cleanly, so Footprint keeps its typographic wordmark. A
logo file on a transparent or white background would finish the set.

### Two notes

- **`Linde-Logo-old.png`** is what the filename says. It renders correctly, but if
  Linde has rebranded since, the current mark would be better.
- **The Masdar file is Masdar's, not the Masdar Institute's.** The roster entry has
  been renamed to match the mark, since Masdar Institute has not existed under
  that name since it merged into Khalifa University in 2017.

### Why these are PNG and not SVG

At the size they display — 56 pixels tall — a PNG at four times that is
indistinguishable from the real vector: rendering TCL's official SVG and the PNG
side by side at display size differs by 6% RMSE, all of it sub-pixel
antialiasing. Tracing the supplied rasters into vectors would not add detail that
is not there; it would produce a redrawn approximation of someone else's
trademark, with wobbly curves and altered letterforms. That is the same problem
the typographic fallback exists to avoid, and worse, because it looks
authoritative while being subtly wrong.

Originals are kept out of the deployed bundle in `Client Logos - source/`, which
is gitignored — they were 608 KB of files nothing references.

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
