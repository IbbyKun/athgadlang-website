/**
 * Every image reference on the site lives here, so artwork can be swapped
 * without touching components.
 *
 * Conventions for /public:
 *   public/images/  raster artwork (png, jpg, webp)
 *   public/svg/     vector artwork and icons
 */

/**
 * Builds an Unsplash CDN URL. Used for development/placeholder photography —
 * replace with licensed brand photography before launch.
 */
function unsplash(id: string, width = 2400) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${width}`;
}

/** Intrinsic dimensions matter here: they prevent layout shift in the header. */
export const brand = {
  logo: {
    src: "/images/weblogo.png",
    width: 800,
    height: 262,
    alt: "athGADLANG",
  },
  /**
   * Knockout variant for dark backgrounds, generated from /svg/logo.svg: the
   * slate background box removed and the navy wordmark flipped to white.
   */
  logoLight: {
    src: "/svg/logo-white.svg",
    width: 800,
    height: 262,
    alt: "athGADLANG",
  },
} as const;

/** Card artwork for the service grid, keyed by service slug. */
export const serviceImages = {
  accounting: {
    src: unsplash("photo-1554224155-6726b3ff858f", 1400),
    alt: "Accountant reviewing figures at a desk with a calculator",
  },
  assurance: {
    src: unsplash("photo-1460925895917-afdab827c52f", 1400),
    alt: "Financial dashboards and analytics on a laptop screen",
  },
  consulting: {
    src: unsplash("photo-1552664730-d307ca884978", 1400),
    alt: "Consultants working through a strategy session together",
  },
  resourcing: {
    src: unsplash("photo-1573497019940-1c28c88b4f3e", 1400),
    alt: "Interview between a recruiter and a candidate",
  },
  tax: {
    src: unsplash("photo-1450101499163-c8848c66ca85", 1400),
    alt: "Professional signing tax documentation",
  },
  "corporate-services": {
    src: unsplash("photo-1454165804606-c3d57bc86b40", 1400),
    alt: "Business team reviewing corporate documents",
  },
  "fixed-asset-inventory-management": {
    src: unsplash("photo-1556742049-0cfed4f6a45d", 1400),
    alt: "Warehouse inventory being catalogued",
  },
} as const;

/**
 * Hero artwork for a services page, keyed by its route slug — a practice area
 * or a single service. Anything without an entry falls back to the practice
 * area's card image.
 */
export const serviceHeroImages = {
  accounting: {
    src: unsplash("photo-1460925895917-afdab827c52f"),
    alt: "Laptop showing financial dashboards on a desk",
  },
  "business-process-outsourcing": {
    src: unsplash("photo-1604328698692-f76ea9498e76"),
    alt: "Bright open workspace with a team meeting in the background",
  },
  "talent-acquisition": {
    src: unsplash("photo-1541746972996-4e0b0f43e02a"),
    alt: "Evening office with a meeting under way in a glass room",
  },
  "remote-workforce-solutions": {
    src: unsplash("photo-1517336714731-489689fd1ca8"),
    alt: "Laptop on a desk lit in blue and violet",
  },
  /*
    The practice-area card art is a close portrait, and the hero's letterbox
    crop slices it across the face. This handshake sits centred, so the wide
    crop keeps the whole subject — and it reads as the firm taking work on.
  */
  resourcing: {
    src: unsplash("photo-1521791136064-7986c2920216"),
    alt: "Two people shaking hands in an office",
  },
} as const;

/**
 * Supplied full-width band artwork, keyed by service path.
 *
 * These are finished graphics rather than photography — a designed section
 * complete with its own background, type and margins — so they are rendered
 * edge to edge and replace the coded band they supersede. Intrinsic dimensions
 * are carried here because the band sizes from its own aspect ratio.
 */
export const serviceSpecialImages = {
  accounting: {
    src: "/images/sections/accounting-recognition.png",
    alt: "Ranked among top consulting firms in the Middle East — Top Consulting Firm 2025, Silver in Accounting. From 500+ consulting firms, only 28 were ranked.",
    width: 1920,
    height: 1080,
  },
} as const;

/**
 * Panel artwork for the capabilities on a service detail page, keyed by
 * capability slug.
 *
 * These panels crop to roughly a square on wide screens, so every image here
 * is a flat-lay, document or screen shot — nothing where a face or a pair of
 * hands can be sliced by the crop.
 */
export const serviceCapabilityImages = {
  "accounting-bookkeeping": {
    src: unsplash("photo-1499750310107-5fef28a66643", 1600),
    alt: "Laptop, notepad and coffee on a wooden desk",
  },
  "payroll-services": {
    src: unsplash("photo-1568992687947-868a62a9f521", 1600),
    alt: "Team working together in an open-plan office",
  },
  "software-setup": {
    src: unsplash("photo-1461749280684-dccba630e2f6", 1600),
    alt: "Source code on a screen",
  },
  "financial-statements": {
    src: unsplash("photo-1526628953301-3e589a6a8b74", 1600),
    alt: "Reporting dashboard on a computer display",
  },
  "management-reporting": {
    src: unsplash("photo-1551288049-bebda4e38f71", 1600),
    alt: "Analytics dashboard on a monitor",
  },
  "accounts-payable-receivable": {
    src: unsplash("photo-1526304640581-d334cdbbf45e", 1600),
    alt: "Banknotes spread across a surface",
  },
  "bank-reconciliation": {
    src: unsplash("photo-1591696205602-2f950c417cb9", 1600),
    alt: "Line chart on a laptop screen",
  },
  "financial-statement-preparation": {
    src: unsplash("photo-1526628953301-3e589a6a8b74", 1600),
    alt: "Reporting dashboard on a computer display",
  },
  "tax-compliance": {
    src: unsplash("photo-1554224154-26032ffc0d07", 1600),
    alt: "Tax forms, a calculator and a cup of coffee on a desk",
  },
  "payroll-management": {
    src: unsplash("photo-1568992687947-868a62a9f521", 1600),
    alt: "Team working together in an open-plan office",
  },
  "budgeting-forecasting": {
    src: unsplash("photo-1543286386-713bdd548da4", 1600),
    alt: "Growth chart drawn on paper beside a pen and ruler",
  },
  "audit-support": {
    src: unsplash("photo-1583521214690-73421a1829a9", 1600),
    alt: "Stacks of document files in an office",
  },
  "custom-reporting": {
    src: unsplash("photo-1551288049-bebda4e38f71", 1600),
    alt: "Analytics dashboard on a monitor",
  },
  "property-management-bpo": {
    src: unsplash("photo-1560518883-ce09059eeffa", 1600),
    alt: "Residential development under a clear sky",
  },
  "financial-services-bpo": {
    src: unsplash("photo-1590283603385-17ffb3a7f29f", 1600),
    alt: "Price chart on a trading screen",
  },
  "ecommerce-retail-bpo": {
    src: unsplash("photo-1441986300917-64674bd600d8", 1600),
    alt: "Retail store interior",
  },
  "technology-saas-bpo": {
    src: unsplash("photo-1461749280684-dccba630e2f6", 1600),
    alt: "Source code on a screen",
  },
  "call-support-bpo": {
    src: unsplash("photo-1587560699334-cc4ff634909a", 1600),
    alt: "Laptop and desk telephone on an office desk",
  },
  "healthcare-billing-bpo": {
    src: unsplash("photo-1519494026892-80bbd2d6fd0d", 1600),
    alt: "Reception desk in a medical clinic",
  },
  "marketing-creative-bpo": {
    src: unsplash("photo-1533750349088-cd871a92f312", 1600),
    alt: "Marketing strategy notes and pens on a desk",
  },
  "executive-search-hiring": {
    src: unsplash("photo-1497366858526-0766cadbe8fa", 1600),
    alt: "Meeting room set for interviews",
  },
  "permanent-contract-staffing": {
    src: unsplash("photo-1586281380117-5a60ae2050cc", 1600),
    alt: "Clipboard, pen and laptop on a desk",
  },
  "industry-specific-recruitment": {
    src: unsplash("photo-1521737711867-e3b97375f902", 1600),
    alt: "Team working together at a long table",
  },
  "end-to-end-recruitment": {
    src: unsplash("photo-1542744173-8e7e53415bb0", 1600),
    alt: "Colleagues being briefed in a boardroom",
  },
  "employer-branding-strategy": {
    src: unsplash("photo-1497366216548-37526070297c", 1600),
    alt: "Interior of a modern workplace",
  },
  "bulk-volume-hiring": {
    src: unsplash("photo-1560439514-4e9645039924", 1600),
    alt: "Crowded exhibition hall seen from above",
  },
  "remote-global-hiring": {
    src: unsplash("photo-1451187580459-43490279c0fa", 1600),
    alt: "The earth at night, seen from orbit",
  },
  "dedicated-remote-professionals": {
    src: unsplash("photo-1551434678-e076c223a692", 1600),
    alt: "Two colleagues working at their desks",
  },
  "payroll-compliance-management": {
    src: unsplash("photo-1554224154-26032ffc0d07", 1600),
    alt: "Forms, a calculator and a cup of coffee on a desk",
  },
  "it-infrastructure-support": {
    src: unsplash("photo-1526374965328-7f61d4dc18c5", 1600),
    alt: "Columns of code on a dark screen",
  },
  "on-demand-workforce-scaling": {
    src: unsplash("photo-1593642532973-d31b6557fa68", 1600),
    alt: "Open laptop on a meeting room table",
  },
  "performance-management-reporting": {
    src: unsplash("photo-1551288049-bebda4e38f71", 1600),
    alt: "Performance dashboard on a monitor",
  },
  "seamless-onboarding-integration": {
    src: unsplash("photo-1600880292203-757bb62b4baf", 1600),
    alt: "Two colleagues celebrating at a desk",
  },

  /* Fixed assets and inventory. */
  "fixed-asset-management": {
    src: unsplash("photo-1583521214690-73421a1829a9", 1600),
    alt: "Stacks of asset records in an office",
  },
  "inventory-management": {
    src: unsplash("photo-1553413077-190dd305871c", 1600),
    alt: "Stocked racking down a warehouse aisle",
  },

  /* Corporate services. */
  "company-formation": {
    src: unsplash("photo-1512453979798-5ea266f8880c", 1600),
    alt: "Dubai skyline seen from the coast",
  },
  "company-liquidation": {
    src: unsplash("photo-1583521214690-73421a1829a9", 1600),
    alt: "Stacks of document files in an office",
  },
  "pro-services": {
    src: unsplash("photo-1589829545856-d10d557cf95f", 1600),
    alt: "Legal gavel and notes on a meeting table",
  },
  "golden-visa-services": {
    src: unsplash("photo-1573497620053-ea5300f94f21", 1600),
    alt: "Adviser in conversation with a client across a table",
  },
  "bank-account-opening-assistance": {
    src: unsplash("photo-1526304640581-d334cdbbf45e", 1600),
    alt: "Banknotes spread across a surface",
  },
  "trademark-registration": {
    src: unsplash("photo-1507679799987-c73779587ccf", 1600),
    alt: "Professional working on brand documentation",
  },

  /* Tax. */
  "corporate-tax": {
    src: unsplash("photo-1554224154-26032ffc0d07", 1600),
    alt: "Tax forms, a calculator and a cup of coffee on a desk",
  },
  "transfer-pricing": {
    src: unsplash("photo-1590283603385-17ffb3a7f29f", 1600),
    alt: "Price chart on a trading screen",
  },
  "value-added-tax": {
    src: unsplash("photo-1526304640581-d334cdbbf45e", 1600),
    alt: "Banknotes spread across a surface",
  },

  /* Resourcing. Shares artwork with the pages beneath it — same subjects. */
  "business-process-outsourcing": {
    src: unsplash("photo-1497366216548-37526070297c", 1600),
    alt: "Interior of a modern workplace",
  },
  "talent-acquisition": {
    src: unsplash("photo-1497366858526-0766cadbe8fa", 1600),
    alt: "Meeting room set for interviews",
  },
  secondments: {
    src: unsplash("photo-1521737711867-e3b97375f902", 1600),
    alt: "Team working together at a long table",
  },
  "c-level-support": {
    src: unsplash("photo-1542744173-8e7e53415bb0", 1600),
    alt: "Colleagues being briefed in a boardroom",
  },
  "remote-work-solutions": {
    src: unsplash("photo-1593642532973-d31b6557fa68", 1600),
    alt: "Open laptop on a meeting room table",
  },
  "recruitment-process-outsourcing": {
    src: unsplash("photo-1586281380117-5a60ae2050cc", 1600),
    alt: "Clipboard, pen and laptop on a desk",
  },
  "end-to-end-outsourcing": {
    src: unsplash("photo-1583521214690-73421a1829a9", 1600),
    alt: "Stacks of document files in an office",
  },

  /* Assurance. */
  "agreed-upon-procedures": {
    src: unsplash("photo-1586281380117-5a60ae2050cc", 1600),
    alt: "Clipboard, pen and laptop on a desk",
  },
  "statutory-external-audit": {
    src: unsplash("photo-1583521214690-73421a1829a9", 1600),
    alt: "Stacks of document files in an office",
  },

  /* Consulting. Artwork is reused across pages while it is placeholder. */
  "business-advisory": {
    src: unsplash("photo-1542744173-8e7e53415bb0", 1600),
    alt: "Colleagues being briefed in a boardroom",
  },
  "forensic-investigations": {
    src: unsplash("photo-1541746972996-4e0b0f43e02a", 1600),
    alt: "Evening office with a meeting under way in a glass room",
  },
  "transaction-advisory": {
    src: unsplash("photo-1591696205602-2f950c417cb9", 1600),
    alt: "Line chart on a laptop screen",
  },
  "risk-advisory": {
    src: unsplash("photo-1521737711867-e3b97375f902", 1600),
    alt: "Team working together at a long table",
  },
  "financial-accounting-advisory": {
    src: unsplash("photo-1526628953301-3e589a6a8b74", 1600),
    alt: "Reporting dashboard on a computer display",
  },
  "corporate-finance": {
    src: unsplash("photo-1526304640581-d334cdbbf45e", 1600),
    alt: "Banknotes spread across a surface",
  },
  "corporate-services": {
    src: unsplash("photo-1554224154-26032ffc0d07", 1600),
    alt: "Forms, a calculator and a cup of coffee on a desk",
  },
  "technology-advisory": {
    src: unsplash("photo-1461749280684-dccba630e2f6", 1600),
    alt: "Source code on a screen",
  },
  "learning-development": {
    src: unsplash("photo-1531058020387-3be344556be6", 1600),
    alt: "Audience at a conference facing a presentation screen",
  },
} as const;

/**
 * Leadership portraits — all eleven, all real.
 *
 * Supplied as 224x299 PNGs, which is exactly the card's 3:4 box at its widest
 * (14rem), so nothing is cropped and `object-top` has nothing to save. Three
 * arrived as cut-outs with transparent backgrounds; those were flattened onto
 * white on the way into /public, because the card sits on `bg-neutral-900` and
 * a transparent background would have shown through as black.
 *
 * Now 448x598, because 224 was a 1x asset and the card is 224 CSS px: the
 * `sizes` string carries vw entries, so the srcset offers 384 and 640, a 2x
 * screen asks for 640, and the optimiser never upscales past the source — so a
 * 224px file was being stretched 2.9x. 448 is what a 2x screen actually needs.
 *
 * The extra pixels are resampled, not recovered. These arrived already softened
 * (halving and restoring one costs 1.3-3.1% RMSE, well under what a crisply
 * sampled photograph loses), so enlargement plus a restrained unsharp presents
 * what is there properly rather than adding detail. Heavier settings and
 * sigmoidal-space resizing were tried and rejected: both haloed the scalp edge
 * and pushed skin tone ruddy. Real camera files would still be better, and no
 * code change is needed if they arrive at this size.
 */
export const leaderImages = {
  "arshad-gadit": {
    src: "/images/leaders/arshad-gadit.png",
    alt: "Portrait of Arshad Gadit",
  },
  "usman-alam": {
    src: "/images/leaders/usman-alam.png",
    alt: "Portrait of Usman Alam",
  },
  "yasir-gadit": {
    src: "/images/leaders/yasir-gadit.png",
    alt: "Portrait of Yasir Gadit",
  },
  "abdullah-taimoor": {
    src: "/images/leaders/abdullah-taimoor.png",
    alt: "Portrait of Abdullah Taimoor",
  },
  "arslan-mushtaq": {
    src: "/images/leaders/arslan-mushtaq.png",
    alt: "Portrait of Arslan Mushtaq",
  },
  "haziq-neshat-akhtar": {
    src: "/images/leaders/haziq-neshat-akhtar.png",
    alt: "Portrait of Haziq Neshat Akhtar",
  },
  "osman-babar": {
    src: "/images/leaders/osman-babar.png",
    alt: "Portrait of Osman Babar",
  },
  "saqib-nisar": {
    src: "/images/leaders/saqib-nisar.png",
    alt: "Portrait of Saqib Nisar",
  },
  "abdul-aziz-lang": {
    src: "/images/leaders/abdul-aziz-lang.png",
    alt: "Portrait of Abdul Aziz Lang",
  },
  "khushboo-mushtaq": {
    src: "/images/leaders/khushboo-mushtaq.png",
    alt: "Portrait of Khushboo Mushtaq",
  },
  "sikandar-gadit": {
    src: "/images/leaders/sikandar-gadit.png",
    alt: "Portrait of Sikandar Gadit",
  },
} as const;

/**
 * Portraits for the named team members listed on service pages, keyed by the
 * name exactly as `keyTeam` writes it in lib/services.ts.
 *
 * Keyed by name rather than by a slug because `keyTeam` is a list of names with
 * no identifiers behind it. A name with no entry here gets a monogram card
 * instead — see <KeyTeam> — so this map only ever needs the people whose
 * photographs have actually been supplied.
 *
 * These are not plain headshots. Each one is a brand composition — the person
 * cut out inside the red aG chevron, on a transparent background with wide
 * margins. That dictates how they have to be rendered: `object-contain` rather
 * than `object-cover`, no circular clip (it would slice the chevron), and a
 * container large enough that the margins do not leave the face tiny.
 */
export const teamImages: Record<string, { src: string; alt: string }> = {
  "Adil Askari": { src: "/images/team/adil-askari.png", alt: "Portrait of Adil Askari" },
  "Ali Ahmad Zahid": {
    src: "/images/team/ali-ahmad-zahid.png",
    alt: "Portrait of Ali Ahmad Zahid",
  },
  "Altaf Bhutta": { src: "/images/team/altaf-bhutta.png", alt: "Portrait of Altaf Bhutta" },
  "Ammar Kagdhi": {
    src: "/images/team/ammar-kagdhi.png",
    alt: "Portrait of Ammar Kagdhi",
  },
  "Ateeb Khan": { src: "/images/team/ateeb-khan.png", alt: "Portrait of Ateeb Khan" },
  "Bilal Shehbaz": {
    src: "/images/team/bilal-shehbaz.png",
    alt: "Portrait of Bilal Shehbaz",
  },
  // Listed under both names in lib/services.ts; the same person either way.
  "Farrukh Fayyaz": {
    src: "/images/team/farrukh-fayyaz.png",
    alt: "Portrait of Farrukh Fayyaz",
  },
  "Muhammad Farrukh Fayyaz": {
    src: "/images/team/farrukh-fayyaz.png",
    alt: "Portrait of Farrukh Fayyaz",
  },
  "Hira Sikander": {
    src: "/images/team/hira-sikander.png",
    alt: "Portrait of Hira Sikander",
  },
  "Khushboo Mushtaq": {
    src: "/images/team/khushboo-mushtaq.png",
    alt: "Portrait of Khushboo Mushtaq",
  },
  Laiba: { src: "/images/team/laiba-aamir.png", alt: "Portrait of Laiba Aamir" },
  "Masood Ahmed": {
    src: "/images/team/masood-ahmed.png",
    alt: "Portrait of Masood Ahmed",
  },
  "Nisarg Sheth": { src: "/images/team/nisarg-sheth.png", alt: "Portrait of Nisarg Sheth" },
  "Ramesh Lama": { src: "/images/team/ramesh-lama.png", alt: "Portrait of Ramesh Lama" },
  "Sneha Mehta": { src: "/images/team/sneha-mehta.png", alt: "Portrait of Sneha Mehta" },
  "Syed Ali Hassan": {
    src: "/images/team/syed-ali-hassan.png",
    alt: "Portrait of Syed Ali Hassan",
  },
  "Tariq Islam": { src: "/images/team/tariq-islam.png", alt: "Portrait of Tariq Islam" },
  "Usman Hussain": {
    src: "/images/team/usman-hussain.png",
    alt: "Portrait of Usman Hussain",
  },
};

/** Revealed behind each industry tile on hover, keyed by industry slug. */
export const industryImages = {
  "financial-services": {
    src: unsplash("photo-1611974789855-9c2a0a7236a3", 1000),
    alt: "Trading screens in a financial dealing room",
  },
  technology: {
    src: unsplash("photo-1518770660439-4636190af475", 1000),
    alt: "Circuit board close-up",
  },
  aviation: {
    src: unsplash("photo-1436491865332-7a61a109cc05", 1000),
    alt: "Aircraft wing above the clouds",
  },
  "food-and-beverages": {
    src: unsplash("photo-1556909212-d5b604d0c90d", 1000),
    alt: "Commercial kitchen in service",
  },
  logistics: {
    src: unsplash("photo-1601584115197-04ecc0da31d7", 1000),
    alt: "Freight containers stacked at a port",
  },
  manufacturing: {
    src: unsplash("photo-1565043666747-69f6646db940", 1000),
    alt: "Automated production line",
  },
  "non-profit": {
    src: unsplash("photo-1497435334941-8c899ee9e8e9", 1000),
    alt: "Volunteers working together",
  },
  retail: {
    src: unsplash("photo-1441986300917-64674bd600d8", 1000),
    alt: "Retail store interior",
  },
  "oil-and-gas": {
    src: unsplash("photo-1466611653911-95081537e5b7", 1000),
    alt: "Refinery infrastructure at dusk",
  },
  "real-estate": {
    src: unsplash("photo-1560518883-ce09059eeffa", 1000),
    alt: "Residential development under a clear sky",
  },
  media: {
    src: unsplash("photo-1524253482453-3fed8d2fe12b", 1000),
    alt: "Broadcast studio camera",
  },
  telecommunication: {
    src: unsplash("photo-1516110833967-0b5716ca1387", 1000),
    alt: "Communications tower against the sky",
  },
} as const;

/**
 * Team and workplace photography for the about page.
 *
 * Placeholders, and stock rather than our own offices — replace with real
 * photography of the firm. Wide scenes were chosen deliberately: they survive
 * the collage crops without slicing anyone in half.
 */
export const aboutImages = {
  team: {
    src: unsplash("photo-1556761175-b413da4baf72", 1600),
    alt: "Colleagues talking across a desk in an open-plan office",
  },
  workshop: {
    src: unsplash("photo-1522071820081-009f0129c71c", 1400),
    alt: "Team working together around a table",
  },
  office: {
    src: unsplash("photo-1497215728101-856f4ea42174", 1400),
    alt: "Meeting counter beside the windows of a city office",
  },
} as const;

export const images = {
  hero: {
    /*
      A working floor rather than a posed meeting: people at their own desks,
      mid-task, across the depth of the room. The photograph it replaced was one
      of the most-used business stock images there is — a team arranged around a
      table looking at a report — and it read as a stock photograph first and a
      firm second.

      Still a placeholder, and the weakest one left on the site: nothing on
      Unsplash reads as a UAE office, so this could be anywhere. A photograph of
      the actual Dubai floor would do more for this page than any stock choice.
    */
    home: {
      src: unsplash("photo-1560264280-88b68371db39"),
      alt: "Open-plan office floor with the team at work at their desks",
    },
    services: {
      src: unsplash("photo-1497366754035-f200968a6e72"),
      alt: "Open-plan professional office",
    },
    insights: {
      src: unsplash("photo-1504711434969-e33886168f5c"),
      alt: "Stack of business newspapers",
    },
    webinars: {
      src: unsplash("photo-1531058020387-3be344556be6"),
      alt: "Audience at a conference facing a presentation screen",
    },
    events: {
      src: unsplash("photo-1540575467063-178a50c2df87"),
      alt: "Speaker addressing a seated audience at a business event",
    },
    careers: {
      src: unsplash("photo-1600880292203-757bb62b4baf"),
      alt: "Two colleagues shaking hands after a meeting",
    },
  },
} as const;
