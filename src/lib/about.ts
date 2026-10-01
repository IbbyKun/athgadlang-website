/**
 * Copy and imagery for the About Us page.
 *
 * Every word on that page lives here rather than in the JSX, because the design
 * team intends to follow the base design with region-specific ones. When that
 * lands, a sibling module keyed `region -> Partial<AboutContent>` can override
 * whichever pieces differ — the same shape `page-meta.ts` and
 * `services-regional.ts` already use — and no component has to change.
 *
 * Note that the page is network-wide, not regional: the hero names six markets,
 * the story covers the whole network and the timeline walks every office. Only
 * the contact block below it varies by region, and that already resolves itself
 * from `contactFor(tenant)`. So this file is deliberately flat, with no region
 * dimension until there is something that actually differs.
 */

export type AboutFigure = {
  /** Kept as a string: the design sets these zero-padded ("06", not 6). */
  value: string;
  label: string;
  /** Alternating red/navy tiles, read left-to-right then wrapping. */
  tone: "brand" | "navy";
};

export type AboutPillar = {
  title: string;
  body: string;
  image: string;
};

export type AboutChapter = {
  /** Stable key for React, and the stem of the photo filenames. */
  slug: string;
  place: string;
  /** The second line of the heading — the chapter's own title. */
  headline: string;
  body: string;
  /**
   * Flag roundel. Omitted for "The Network Widens", which is a moment rather
   * than a place and gets the brand arrow instead.
   */
  flag?: string;
  /** Three photos, or none for a chapter that is not an office. */
  photos?: string[];
};

export type AboutFirm = {
  name: string;
  /** A wordmark that carries its own name, or the shared aG mark plus text. */
  logo: string;
  /** Set when `logo` is the bare mark and the name is typeset beside it. */
  lockup?: boolean;
};

/**
 * The three cards share the design's one stock photograph for now; distinct
 * images per publication are a content ask, not a code change.
 */
export type AboutPublication = {
  name: string;
  cadence: string;
  body: string;
  image: string;
};

export const aboutHero = {
  eyebrow: "We Are",
  title:
    "A Network Of Firms Spanning The Gulf, The Kingdom, Britain, North America And Pakistan",
  description:
    "Offering seven service lines built on one uncompromising idea: difference, properly practiced, is the highest form of trust.",
  image: {
    src: "/images/about/hero.webp",
    alt: "The Dubai skyline at dusk",
  },
};

export const aboutStory = {
  title: "Our Story",
  paragraphs: [
    "A firm's worth is rarely written in its letterhead. It is written in what happens the moment its signature is tested. athGADLANG is a network of firms standing across six markets - the United Arab Emirates, Bahrain, the Kingdom of Saudi Arabia, the United Kingdom, North America and Pakistan - offering seven service lines to organizations that have decided ordinary is no longer good enough.",
    "We were built on a simple refusal: the refusal to be interchangeable. Where much of the profession rewards caution dressed up as prudence, we have chosen rigor without rigidity, and honesty without apology. Every engagement we accept carries the same instruction: verify first, flatter never, and leave the client more certain than we found them.",
    "This is not a firm that grew by chance into ten offices. It is a standard that was carried, deliberately, into each one, so that a signature earned in Karachi means precisely the same thing in London, Dubai, Riyadh and Khobar. Alongside the core practice, three specialist firms - WATHIQ, aG Resources and aG Corporate Services - extend that same signature into executive advisory, outsourced operations and UAE company formation. That consistency, more than any single credential, is the difference we bring.",
  ],
} as const;

/**
 * The four tiles beside the story.
 *
 * "10 Offices" counts the back offices as well; the five on the map are the
 * principal ones, which is why `offices.ts` still holds five and the map button
 * still reads "Explore our 5 offices".
 */
export const aboutFigures: AboutFigure[] = [
  {
    value: "06",
    label: "Markets operating under one uncompromised standard",
    tone: "brand",
  },
  {
    value: "10",
    label: "Offices around the world that operate in their relevant markets",
    tone: "navy",
  },
  {
    value: "07",
    label: "Service lines, from Assurance to Fixed Asset & Inventory Management",
    tone: "navy",
  },
  {
    value: "03",
    label: "Specialist network firms: WATHIQ, aG Resources, aG Corporate Services",
    tone: "brand",
  },
];

export const aboutPillars: AboutPillar[] = [
  {
    title: "Mission",
    body: "To deliver Assurance, Accounting, Tax, Resourcing, Consulting, Corporate Services and Fixed Asset & Inventory Management with unimpeachable rigor, across every market we serve. This is the mandate that travels with us into every office, every engagement, every signature.",
    image: "/images/about/what-we-do-1.webp",
  },
  {
    title: "Vision",
    body: "To be the name a market reaches for when it needs to be certain; the standard against which confidence in this profession is measured, from the Gulf to the Kingdom, from London to North America. Not the largest firm in any market, but the most trusted in every one.",
    image: "/images/about/what-we-do-2.webp",
  },
  {
    title: "Values",
    body: "Integrity, because we sign nothing we would not stand behind in public. Rigor, because we do not estimate where we are able to verify. Courage, because we say the harder true thing before the easier, convenient one. Partnership, because we build for the decade after this one, not the quarter in front of us.",
    image: "/images/about/what-we-do-3.webp",
  },
];

/**
 * The timeline, in the order the design draws it.
 *
 * That order is not chronological — the prose has Bahrain following Pakistan
 * and London before the Emirates, while the design places the UAE second. It is
 * reproduced faithfully here so the review sees what was designed; if the
 * design team confirms the chapters should run in the order the copy implies,
 * reordering this array is the whole fix.
 */
export const aboutTimeline: AboutChapter[] = [
  {
    slug: "pakistan",
    place: "Pakistan · Karachi & Lahore",
    headline: "The Founding One Desk, One Stricter Standard",
    body: "Before there was a network, there was a single practice and a refusal to sign anything it had not personally verified. Two offices, one in each of Pakistan's principal commercial cities, carried that instinct forward.",
    flag: "/images/about/flag-pakistan.webp",
    photos: [
      "/images/about/pakistan-1.webp",
      "/images/about/pakistan-2.webp",
      "/images/about/pakistan-3.webp",
    ],
  },
  {
    slug: "uae",
    place: "United Arab Emirates · Dubai & Abu Dhabi",
    headline: "The Gulf Address The Practice Meets the Region",
    body: "The standard travelled to the Emirates' two centres of gravity - Dubai's markets and Abu Dhabi's capital - and was asked, immediately, to prove itself against the region's own ambition.",
    flag: "/images/about/flag-uae.webp",
    photos: [
      "/images/about/uae-1.webp",
      "/images/about/uae-2.webp",
      "/images/about/uae-3.webp",
    ],
  },
  {
    slug: "bahrain",
    place: "Bahrain · The Island Chapter",
    headline: "A Foothold in the Gulf's Financial Harbour",
    body: "A Bahrain address followed, chosen deliberately, so that clients moving capital across the region would never have to explain the firm twice.",
    flag: "/images/about/flag-bahrain.webp",
    photos: [
      "/images/about/bahrain-1.webp",
      "/images/about/bahrain-2.webp",
      "/images/about/bahrain-3.webp",
    ],
  },
  {
    slug: "ksa",
    place: "Kingdom of Saudi Arabia · Riyadh, Jeddah & Khobar",
    headline: "The Kingdom Scale Meets Scrutiny",
    body: "Entry into the Kingdom, and the discipline to open in three of its major commercial centres, brought the firm its largest test yet, and confirmed that the same rigor built for one desk could hold at any scale.",
    flag: "/images/about/flag-ksa.webp",
    photos: [
      "/images/about/ksa-1.webp",
      "/images/about/ksa-2.webp",
      "/images/about/ksa-3.webp",
    ],
  },
  {
    slug: "uk",
    place: "United Kingdom · London",
    headline: "The London Address Where the Profession Was Written Down First",
    body: "A presence in London placed the firm inside the tradition that literally wrote the rules of the profession and asked to be held to them.",
    flag: "/images/about/flag-uk.webp",
    photos: [
      "/images/about/uk-1.webp",
      "/images/about/uk-2.webp",
      "/images/about/uk-3.webp",
    ],
  },
  {
    slug: "north-america",
    place: "North America · The Atlantic Chapter",
    headline: "A Signature Carried Across the Ocean",
    body: "The furthest address yet from where the firm began, opened to stand beside clients whose ambitions no longer stopped at any one continent.",
    flag: "/images/about/flag-north-america.webp",
    photos: [
      "/images/about/north-america-1.webp",
      "/images/about/north-america-2.webp",
      "/images/about/north-america-3.webp",
    ],
  },
  {
    slug: "network",
    place: "The Network Widens",
    headline: "One Signature, Three Specialist Firms",
    body: "As the mandates grew more specific, so did the network. Wathiq, aG Resources and aG Corporate Services joined athGADLANG under one roof, built to answer the questions a pure audit and tax practice was never meant to carry alone.",
  },
];

/**
 * The closing line under the timeline. Kept out of `aboutTimeline` because the
 * design treats it differently from every chapter: centred, below the point
 * where the spine stops, rather than on one flank of it.
 */
export const aboutTimelineCoda = {
  place: "Today · The Chapter Being Written",
  headline: "6 Markets. 10 Offices. 1 Uninterrupted Signature.",
  body: "The story has not concluded; it has simply reached the point where you are reading it. What comes next is being decided by the engagements we accept this year.",
};

/**
 * The specialist firms row.
 *
 * Only Wathiq has a wordmark of its own. The other two are the shared aG mark
 * with their name typeset beside it — which is exactly how the design composes
 * them, so they are built the same way rather than waiting on logo files that
 * do not exist.
 */
export const aboutFirms: AboutFirm[] = [
  { name: "Wathiq", logo: "/svg/wathiqLogo-navy.svg" },
  { name: "Resources", logo: "/svg/ag-mark.svg", lockup: true },
  { name: "Chartered Accountants", logo: "/svg/ag-mark.svg", lockup: true },
];

export const aboutFirmsIntro = {
  title: "The Network of Specialist Firms",
  description:
    "athGADLANG is not a single practice wearing different letterheads. It is a network built so every specialist question a client raises has a firm built specifically to answer it.",
};

/**
 * The band above the newsletters, with the firm's own film playing in it.
 *
 * The design drew a photograph and no player; the video was supplied after.
 * Stored as an id rather than a URL because the id is all the player needs.
 * Source: https://www.youtube.com/watch?v=p8IVBRW8d4I, on the firm's channel.
 */
export const aboutListen = {
  title: "Hear It, Not Just Read It",
  description:
    "Three minutes with the people who carry the signature - on why difference, done properly, is the only kind of trust worth having.",
  video: {
    id: "p8IVBRW8d4I",
    title: "athGADLANG | Our Story, Our People, Our Difference",
  },
  /** Backdrop only, behind the player; it carries no content of its own. */
  image: "/images/about/listen.webp",
};

export const aboutNewsletters = {
  eyebrow: "Newsletters",
  title: "Insights, On Our Terms",
  description: "Three publications for people who prefer to know things early.",
  publications: [
    {
      name: "Eye On It",
      cadence: "Published Weekly",
      body: "Market signals, regulatory shifts, and the quiet news that becomes loud news three weeks later - spotted first.",
      image: "/images/about/newsletter.webp",
    },
    {
      name: "P³",
      cadence: "Published Weekly",
      body: "Practice, People, Progress - three lenses from inside the firm, sharpened for finance leaders on the outside.",
      image: "/images/about/newsletter.webp",
    },
    {
      name: "The Corporate Compass",
      cadence: "Published Weekly",
      body: "Direction for boards and finance leaders navigating a regulatory landscape that refuses to stay still.",
      image: "/images/about/newsletter.webp",
    },
  ] satisfies AboutPublication[],
};
