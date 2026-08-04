# What we still need from you

Everything on this list is a placeholder in the live code. Nothing here is a bug
to fix — it is content only the firm can supply. Each section says exactly where
it goes, so you can send it back in any format.

Audited 2026-08-04 against the codebase.

---

## 1. LinkedIn profiles — 11 needed

Every partner and director page shows a LinkedIn button, and **all eleven
currently point at `#`**, so clicking does nothing. They are set from a single
stub, `LINKEDIN_TBC`, in `src/lib/leaders.ts`.

Send a profile URL for each, or tell me to hide the button for anyone without one:

| # | Name | Role |
| --- | --- | --- |
| 1 | Arshad Gadit | Partner & Global CEO |
| 2 | Saqib Nisar | Managing Partner |
| 3 | Sikandar Gadit | Partner & Chief Operating Officer |
| 4 | Usman Alam | Partner — Assurance & Compliance |
| 5 | Yasir Gadit | Partner — Consulting |
| 6 | Arslan Mushtaq | Partner — Tax |
| 7 | Abdul Aziz Lang | Partner — Strategy |
| 8 | Abdullah Taimoor | Partner — Fixed Asset & Inventory Management |
| 9 | Haziq Neshat Akhtar | Partner — Risk, Financial Crimes & Transaction Advisory |
| 10 | Osman Babar | Partner — BPO Services |
| 11 | Khushboo Mushtaq | Director — Financial Accounting & Advisory Services |

---

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

### Missing pages — 3, and they are on every page

These are in the bottom bar sitewide and **all three return 404**. For an audit
and advisory firm a dead privacy policy link is the worst of the three.

| Label | URL it points at | Needs |
| --- | --- | --- |
| **Terms Of Use** | `/terms-of-use` | The text, and we build the page |
| **Privacy Policy** | `/privacy-policy` | The text, and we build the page |
| **Legal Information** | `/legal-information` | The text, and we build the page |

If any of these live elsewhere already — a group site, a PDF — send the URL and
we point at it instead.

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
