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

/** Article artwork for the insights carousel, keyed by article slug. */
export const insightImages = {
  "ubo-regulations-uae": {
    src: unsplash("photo-1521791136064-7986c2920216", 1200),
    alt: "Business advisers reviewing ownership documentation",
  },
  "commercial-vs-professional-licence": {
    src: unsplash("photo-1589829545856-d10d557cf95f", 1200),
    alt: "Legal gavel and notes on a meeting table",
  },
  "register-trademark-uae": {
    src: unsplash("photo-1507679799987-c73779587ccf", 1200),
    alt: "Professional working on brand documentation",
  },
  "jebel-ali-free-zone": {
    src: unsplash("photo-1512453979798-5ea266f8880c", 1200),
    alt: "Dubai skyline seen from the coast",
  },
  "corporate-tax-small-business-relief": {
    src: unsplash("photo-1554774853-aae0a22c8aa4", 1200),
    alt: "Tax paperwork and a calculator on a desk",
  },
  "transfer-pricing-documentation-gcc": {
    src: unsplash("photo-1552581234-26160f608093", 1200),
    alt: "Finance team discussing intercompany reporting",
  },
  "ksa-e-invoicing-phase-two": {
    src: unsplash("photo-1497366811353-6870744d04b2", 1200),
    alt: "Modern office where invoicing systems are managed",
  },
  "ifrs-18-financial-statements": {
    src: unsplash("photo-1486406146926-c627a92ad1ab", 1200),
    alt: "Corporate towers viewed from below",
  },
} as const;

/**
 * Placeholder webinar thumbnails. Once the YouTube IDs are known these should
 * come from `https://img.youtube.com/vi/<id>/maxresdefault.jpg` instead — add
 * `img.youtube.com` to `images.remotePatterns` in next.config.ts when you do.
 */
export const webinarImages = {
  "agtalks-outsource-the-ordinary": {
    src: unsplash("photo-1587825140708-dfaf72ae4b04", 1200),
    alt: "Podcast microphone in a recording studio",
  },
  "understanding-the-vat-impact": {
    src: unsplash("photo-1591115765373-5207764f72e7", 1200),
    alt: "Presenter delivering an online session",
  },
  "uae-corporate-tax-how-to-prepare": {
    src: unsplash("photo-1531482615713-2afd69097998", 1200),
    alt: "Laptop showing a presentation deck",
  },
  "recap-uae-vat-law-amendments": {
    src: unsplash("photo-1516321318423-f06f85e504b3", 1200),
    alt: "Team reviewing legislation on a laptop",
  },
  "transfer-pricing-in-the-gcc": {
    src: unsplash("photo-1543269865-cbf427effbad", 1200),
    alt: "Colleagues working through figures together",
  },
  "corporate-tax-registration-mistakes": {
    src: unsplash("photo-1573164713988-8665fc963095", 1200),
    alt: "Adviser presenting to camera from a desk",
  },
  "ksa-e-invoicing-walkthrough": {
    src: unsplash("photo-1560472354-b33ff0c44a43", 1200),
    alt: "Video call in progress on a laptop",
  },
  "internal-audit-for-growing-businesses": {
    src: unsplash("photo-1560439514-4e9645039924", 1200),
    alt: "Speaker addressing a conference audience",
  },
  "ifrs-annual-update": {
    src: unsplash("photo-1505373877841-8d25f7d46678", 1200),
    alt: "Reporting documents laid out on a desk",
  },
  "building-a-finance-function-that-scales": {
    src: unsplash("photo-1522202176988-66273c2fd55f", 1200),
    alt: "Finance team collaborating around a table",
  },
} as const;

/**
 * Placeholder headshots. Replace every one of these with the leader's real
 * photograph — these are stock images of unrelated people.
 */
export const leaderImages = {
  "arshad-gadit": {
    src: unsplash("photo-1560250097-0b93528c311a", 800),
    alt: "Portrait placeholder",
  },
  "usman-alam": {
    src: unsplash("photo-1507003211169-0a1dd7228f2d", 800),
    alt: "Portrait placeholder",
  },
  "yasir-gadit": {
    src: unsplash("photo-1472099645785-5658abf4ff4e", 800),
    alt: "Portrait placeholder",
  },
  "abdullah-taimoor": {
    src: unsplash("photo-1519085360753-af0119f7cbe7", 800),
    alt: "Portrait placeholder",
  },
  "leader-five": {
    src: unsplash("photo-1573496359142-b8d87734a5a2", 800),
    alt: "Portrait placeholder",
  },
  "leader-six": {
    src: unsplash("photo-1568602471122-7832951cc4c5", 800),
    alt: "Portrait placeholder",
  },
  "leader-seven": {
    src: unsplash("photo-1580489944761-15a19d654956", 800),
    alt: "Portrait placeholder",
  },
  "leader-eight": {
    src: unsplash("photo-1531427186611-ecfd6d936c79", 800),
    alt: "Portrait placeholder",
  },
  "leader-nine": {
    src: unsplash("photo-1544005313-94ddf0286df2", 800),
    alt: "Portrait placeholder",
  },
  "leader-ten": {
    src: unsplash("photo-1500648767791-00dcc994a43e", 800),
    alt: "Portrait placeholder",
  },
} as const;

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

export const images = {
  hero: {
    home: {
      src: unsplash("photo-1521737604893-d14cc237f11d"),
      alt: "Advisory team reviewing financial reports together in a meeting room",
    },
    services: {
      src: unsplash("photo-1497366754035-f200968a6e72"),
      alt: "Open-plan professional office",
    },
    careers: {
      src: unsplash("photo-1600880292203-757bb62b4baf"),
      alt: "Two colleagues shaking hands after a meeting",
    },
  },
} as const;
