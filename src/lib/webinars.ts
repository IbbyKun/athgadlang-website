import { webinarImages } from "@/lib/images";

export type Webinar = {
  slug: keyof typeof webinarImages;
  title: string;
  /** ISO date the session aired. */
  date: string;
  /** Runtime, e.g. "42 min". */
  duration: string;
  image: { src: string; alt: string };
  /**
   * YouTube video id. Not used for playback yet — the card links to the
   * webinar page — but kept so an embed or lightbox can be added later.
   */
  youtubeId?: string;
};

/**
 * Placeholder catalogue. The live site has 15 sessions; swap this array for a
 * CMS or YouTube playlist query and the components carry on unchanged.
 */
export const webinars: Webinar[] = [
  {
    slug: "agtalks-outsource-the-ordinary",
    title: "#aGTalks | OUTSOURCE THE ORDINARY — Episode 1 — Full Podcast",
    date: "2026-06-11",
    duration: "48 min",
    image: webinarImages["agtalks-outsource-the-ordinary"],
  },
  {
    slug: "understanding-the-vat-impact",
    title: "Understanding the VAT Impact | athGADLANG | UAE",
    date: "2026-05-28",
    duration: "36 min",
    image: webinarImages["understanding-the-vat-impact"],
  },
  {
    slug: "uae-corporate-tax-how-to-prepare",
    title: "UAE Corporate Tax | How to Get Prepared",
    date: "2026-05-14",
    duration: "52 min",
    image: webinarImages["uae-corporate-tax-how-to-prepare"],
  },
  {
    slug: "recap-uae-vat-law-amendments",
    title: "Recap of UAE VAT Law Amendments",
    date: "2026-04-30",
    duration: "41 min",
    image: webinarImages["recap-uae-vat-law-amendments"],
  },
  {
    slug: "transfer-pricing-in-the-gcc",
    title: "Transfer Pricing in the GCC | Practical Compliance",
    date: "2026-04-16",
    duration: "45 min",
    image: webinarImages["transfer-pricing-in-the-gcc"],
  },
  {
    slug: "corporate-tax-registration-mistakes",
    title: "Corporate Tax Registration | Common Mistakes to Avoid",
    date: "2026-03-26",
    duration: "33 min",
    image: webinarImages["corporate-tax-registration-mistakes"],
  },
  {
    slug: "ksa-e-invoicing-walkthrough",
    title: "E-Invoicing in Saudi Arabia | ZATCA Phase 2 Walkthrough",
    date: "2026-03-12",
    duration: "39 min",
    image: webinarImages["ksa-e-invoicing-walkthrough"],
  },
  {
    slug: "internal-audit-for-growing-businesses",
    title: "Internal Audit for Growing Businesses | aGTalks",
    date: "2026-02-26",
    duration: "44 min",
    image: webinarImages["internal-audit-for-growing-businesses"],
  },
  {
    slug: "ifrs-annual-update",
    title: "IFRS Update | What Changed This Year",
    date: "2026-02-12",
    duration: "37 min",
    image: webinarImages["ifrs-annual-update"],
  },
  {
    slug: "building-a-finance-function-that-scales",
    title: "Building a Finance Function That Scales",
    date: "2026-01-29",
    duration: "50 min",
    image: webinarImages["building-a-finance-function-that-scales"],
  },
];

/**
 * Where a session opens.
 *
 * A webinar is a recording, so it opens on YouTube — in a new tab, since that
 * leaves the site. Until a session has its `youtubeId`, there is nothing to
 * open and the link falls back to the listing rather than to a page that does
 * not exist. Filling in the ids is all that is needed to make them play.
 */
export function webinarLink(webinar: Webinar) {
  return webinar.youtubeId
    ? {
        href: `https://www.youtube.com/watch?v=${webinar.youtubeId}`,
        external: true as const,
      }
    : { href: "/webinars", external: false as const };
}

export function webinarHref(webinar: Webinar) {
  return webinarLink(webinar).href;
}
