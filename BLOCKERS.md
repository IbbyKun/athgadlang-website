# Blocked on you

Everything from *athGADLANG Website Changes* that could be built has been built
on the `website-changes-round-1` branch. This is the remainder: the items that
need something only you or the team can supply, and the handful where the
instruction has two readings and guessing would be worse than asking.

Each item says what is needed, where it goes, and what the site does in the
meantime. Nothing here is broken while it waits.

---

## 1. Assets we do not have

### 1.1 Hero slider content and images

> *"the hero banner was actually a slider. I will try to provide you with the
> slider content and images"*

**Needed:** for each slide, a heading, a supporting sentence, the button label
and where it goes, plus the image at 2400px wide or more.

**Meanwhile:** the homepage keeps its single static hero. The slider is not
built yet, because how many slides there are and whether they auto-advance
changes how it should be built, and both are decided by the content.

### 1.2 Replacement images

> *"The images will also be changed."*

**Needed:** the new photography, and which section each image belongs to. The
current set is licensed stock; the service cards, the hero and the About page
photos are all replaceable in one place once the files exist.

**Meanwhile:** the current images stay.

### 1.3 Testimonial headshots

> *"The testimonials should include the profile pictures of the people. I will
> provide the pictures"*

**Needed:** one square photo per person, at least 200x200, named for the person.
The people currently quoted are listed in `src/lib/testimonials.ts`.

**Meanwhile:** the card shows the person's initials in a circle. The code to
show a photo instead is already in place, so this is a matter of dropping the
files in `public/images/testimonials/` and adding one line per person; no
further development.

### 1.4 A proper reversed (white) logo

> *"The athGADLANG logo is appearing pixelated here."*

It is not pixelation. The footer uses `public/svg/logo-white.svg`, which is a
half-finished knockout: "ath" was flipped to white, but "GADLANG", the tagline
and the mark's "G" are still brand red. Brand red on the navy footer measures
about **2.2:1**, so at the size it was rendering, the red half of the wordmark
turned to mush and read as a blurry blob.

**Needed:** the official reversed logo from the brand guidelines, the one meant
for dark backgrounds. If there isn't one, we need a decision on how the mark
should look in white, because the "aG" mark relies on three tones (navy, red,
grey) to separate its shapes and cannot simply be flattened to white.

**Meanwhile:** the footer logo has been enlarged so the current asset is
legible. This is a mitigation, not a fix.

### 1.5 KSA / Wathiq logo

> *"The logo looks too bright, and the colors do not match the actual logo."*

**Needed:** the correct Wathiq artwork. We hold `wathiqLogo.svg` and a navy
recolour of it; if those are wrong, the source files from the designer will
replace them directly.

**Also worth checking:** in the KSA screenshot on page 16 of the PDF, the hero
image is a black rectangle. That may be the PDF capture rather than the site,
but it is worth someone loading ksa.athgadlang.com and confirming the hero
photo actually appears.

### 1.6 Codec PRO

> *"Font: Codec PRO"*

**Needed:** the licensed webfont files (`.woff2`), plus confirmation the licence
covers web use and roughly what monthly traffic it is licensed for. A font this
one cannot be self-served from a CDN without the licence.

**Meanwhile:** the site uses its current sans stack. Swapping it is a
half-hour change once the files land.

### 1.7 Wathiq testimonials

> *"The Wathiq testimonials from KSA clients will be added here."*

**Needed:** for each: the quote, the person's name, their role, their company,
and whether they are happy to be named.

**Meanwhile:** the KSA site shows the group testimonials.

---

## 2. Accounts and credentials

### 2.1 Zoho, for the newsletter

> *"if possible, we should link it with Zoho, which we use to send our email
> campaigns"*

**Done already:** sign-ups are now stored. They used to be validated and thrown
away; they now go into a `newsletter_subscribers` table, tagged with which
regional site the person signed up on.

**Needed to finish it:** Zoho Campaigns API credentials (client ID, client
secret, refresh token) and the name of the list new subscribers should join.
Every stored row carries a `synced_at` column that stays empty until the address
has been handed to Zoho, so nobody signed up in the meantime gets lost, they
are simply queued.

### 2.2 The welcome email

> *"Anyone who signs up here should receive an email that will have an image
> showing our three newsletters... We will share the email content with you"*

**Needed:** the email content, the image of the three newsletters, and the
sign-up link for each one.

### 2.3 YouTube, for automatic video fetching

> *"The latest videos should be automatically fetched from YouTube"*
> *"there is no need to add them manually. Right now this doesn't show all our
> YT videos."*

**Needed:** a decision, then possibly a key.

Two ways to do this, and they behave differently:

| | Channel RSS feed | YouTube Data API |
|---|---|---|
| Credentials | none | API key, Google Cloud project |
| How many videos | **the latest 15 only** | all of them |
| Cost | free | free within quota |

The RSS feed needs nothing from you but will never show more than the 15 most
recent uploads. If "all our YT videos" means the full back catalogue, it has to
be the Data API and we need a key.

**Also needs deciding:** what happens to the editing you can do today. Right
now a webinar has a title, a region, and a publish toggle set in the admin
panel. If the list comes straight from YouTube, all of that goes: every video
on the channel appears, on every regional site, titled whatever it is titled on
YouTube. If you want to keep choosing which videos appear where, we should fetch
from YouTube *into* the admin panel rather than instead of it.

---

## 3. Copy we cannot write for you

### 3.1 Regional service copy

> *"In the [Bahrain / UK / PK / KSA] region, wherever UAE is mentioned, it
> should be changed to [region]... if the same tax applies."*

This is the largest item on the list, and it is not a find-and-replace. The
service copy contains **31 UAE references**, and most are substantive rather
than cosmetic:

- "UAE Corporate Tax now live at **9%** (0% for qualifying free zone entities)"
- registration and filings with the **Federal Tax Authority (FTA)**
- transfer pricing documentation "mandatory under **UAE CT rules**"
- the **Golden Visa**, a 10-year UAE residency
- **Mainland / Free Zone / Offshore** company formation, and UAE trade licences
- **PRO services**, which exist because of how UAE government departments work

Swapping "UAE" for "UK" in the first of those produces a false statement about
UK tax law, published on an accountancy firm's website. Your own note already
allows for this ("if the same tax applies"), and for most of these the answer is
that it does not.

**Built:** the site can now serve different service copy per region. A region
overrides only the passages it has its own wording for and inherits the rest, so
this can be filled in a page at a time rather than as one large rewrite.

**Needed:** for each region, replacement wording for the passages above, written
by whoever advises in that region. Concretely, the pages that need regional
versions first are:

1. **Tax** (`/services/tax`) — every region. The most wrong, and the most
   visited.
2. **Corporate Services** (`/services/corporate-services`) — company formation,
   Golden Visa, PRO services are UAE-specific end to end.
3. **Assurance** (`/services/assurance`) — mentions UAE FTA and KSA ZATCA
   together; needs the local mandate named per region.

**Meanwhile:** every region shows the UAE copy, exactly as it did before.

### 3.2 The Insights archive

> *"Most of the images, headings and articles under the Insights section are not
> correct... Some headings are not correct, and some images are repeated. Also,
> the author's name is appearing in the title."*

Confirmed, and it is the **data**, not the page. Examples visible in your own
screenshots: an article titled *"Dubai Nostalgia- Basma Malik"* with the author
in the title, another titled *"What Do WhatsApp"*, and the same photograph on
several cards.

These came in through the newsletter-tracker import, so the fix is to correct
the records, not the template. Two ways:

- **You**, in `/admin/insights` — every field is editable there, and this is the
  better option if the corrections need editorial judgement.
- **Us**, in bulk — but we would need to know the correct title for each article,
  which is exactly the judgement above.

**Needed:** a decision on which, and if it is us, a list of the corrections.

The repeated images are a separate problem: the import had no artwork for many
articles and fell back to a small set. That is fixed by supplying images, or by
accepting a category-based fallback so at least the repetition looks deliberate.

---

## 4. Two readings, needs a decision

### 4.1 "aG Studio" — how far does the rename go?

> *"The webinar heading will be changed. The updated heading is 'aG Studio'."*

**Done:** the homepage section now reads *aG Studio*.

**Not done, because the instruction points at one heading:** the navbar item,
the footer link, the `/webinars` page title and its hero still say "Webinars".
Should those change too? If yes, say whether the **URL** should change as well
(`/webinars` to `/ag-studio`). Changing it costs the existing links their
ranking unless we add redirects, which we would.

### 4.2 "Change the icon colors to yellow and white"

> *"Also, please change the icon colors to yellow and white. The current red and
> blue colors do not match the design."*

The arrow on page 4 points at the area below the leadership grid, where the only
icon is the one inside the **Consult Today** button, which was brand red on a
navy button.

**Done on that reading:** the icon is now amber on the navy button.

If you meant a different set of icons — the social icons in the footer, the
value icons on the About page, the contact icons — say which and it is a small
change. The contact icons *were* changed to white separately, since that was its
own bullet.

### 4.3 The brand colours are Wathiq's, so they went on KSA only

> *"the color branding will be updated across the entire website: Red #c23546,
> Blue #0c1a3f"*

That bullet sits in the **KSA section**, directly under a note about the Wathiq
logo's colours being wrong. And the colours are Wathiq's: `#c23546` is the red
in the Wathiq mark (`#C13649` in the file). athGADLANG's own mark is `#A71F25`,
which is what the site's red was already set to.

Applied site-wide, it repainted all five regions in Wathiq's palette, so
athGADLANG's four sites stopped looking like athGADLANG. It is now **per region**:
KSA renders in `#c23546` / `#0c1a3f`, and the other four keep athGADLANG's
`#9c2226` / `#1b3a63`.

**Confirm this is what you meant.** If the group really is adopting these
colours everywhere, it is a one-line change to make them the default again, but
it would mean athGADLANG's sites no longer matching the athGADLANG logo.

### 4.4 Em dashes

> *"Please remove all em dashes (—) from the entire website"*

**Done:** 86 of them, across every heading, description, meta description,
button label and body sentence that renders. Each was rewritten rather than
swapped for a comma, because a comma in place of an em dash often leaves a
sentence that reads wrong; some became full stops, some colons, a couple were
rephrased.

**Worth knowing:** em dashes remain in the code comments, which never reach a
page or a search result. Say the word if you want those too.

**One conflict to flag:** the same page also says *"please change the double
dashes in the headings to a single dash"*. Those are not dashes in the text,
they are the decorative brand rules either side of a section title, and there
were two stacked bars. That is now one bar. Both instructions are done, they
were just about different things.

---

## 5. Not started, and why

### 5.1 "This section has too much padding"

Applied to the **contact section**, which is what the bullet follows and what
the regional pages repeat four more times.

Most other homepage sections are also a full screen tall each, which is the real
reason the page is long. Shortening them all is a bigger design decision than
the note asks for, so it has not been done. Worth a conversation if the page
still feels too long.

### 5.2 Region-specific phone numbers

Not in your list, but it turned up while doing the contact details and you
should know: **the UK office is listed with the Bahrain landline**
(+973 17701230) and **the Pakistan office with a UAE mobile** (+971 58 123 0671).

Now that each regional site shows its own number prominently, a visitor in
London sees a Bahrain number. If real local lines exist, send them.
