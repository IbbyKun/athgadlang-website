/**
 * Single source of truth for site chrome: navigation, locations, CTAs.
 * Add or reorder entries here and every nav surface (desktop, mobile,
 * footer) picks the change up — no component edits needed.
 */

import { serviceImages } from "@/lib/images";
import { mapHref, officeForTenant } from "@/lib/offices";
import { type TenantCode } from "@/lib/tenants";

export type NavItem = {
  label: string;
  href: string;
  /** Renders as a nested flyout on desktop and a collapsible group on mobile. */
  items?: NavItem[];
  /** Card copy. Only needed for entries surfaced as cards, e.g. services. */
  description?: string;
  /**
   * Supplied copy for the homepage service card: a one-line promise, then the
   * paragraph beneath it. Reproduced as written, so `{brand}` stands in for the
   * trading name — the Assurance line names the firm, and on the KSA site that
   * has to read Wathiq.
   *
   * Separate from `description`, which is the functional sentence used on the
   * services index, the practice-area hero and in llms.txt. These two say the
   * same thing in different registers and neither reads well in the other's
   * place.
   */
  card?: { tagline: string; body: string };
  image?: { src: string; alt: string };
  /** Include in the homepage services grid. */
  featured?: boolean;
};

export const siteConfig = {
  name: "athGADLANG",
  tagline: "We Bring Difference Differently",
  description:
    "Audit, tax, accounting and advisory services across the UAE, KSA, Bahrain, the UK and Pakistan.",
  cta: { label: "Company Profile", href: "/company-profile" },
} as const;

/**
 * The homepage title and meta description, per region.
 *
 * Both name the practice and the country, because that is what somebody types
 * into a search engine. The tagline does not appear in either: "athGADLANG - We
 * Bring Difference Differently" is 44 characters that tell a search engine
 * nothing about audit or tax, and a homepage title is the strongest signal the
 * site has. The tagline keeps the social card, where it reads as brand rather
 * than as a missed description — see the tenant layout.
 *
 * Lengths are deliberate: titles land at 58-60 characters and descriptions at
 * 158-160 across all five regions, inside the ranges search engines display
 * without truncating. Changing the wording means re-checking that, since the
 * longest region name (Saudi Arabia) sets the ceiling.
 *
 * "and" rather than "&" on purpose. An ampersand is escaped to `&amp;` in the
 * markup, so a tool that measures the raw attribute counts five characters
 * where a reader sees one — enough to report a title as over length when it is
 * not. Nothing here needs the ampersand.
 */
export function homeTitle(brand: string, inRegion: string) {
  return `${brand}: Audit, Tax, Accounting and Advisory in ${inRegion}`;
}

export function homeDescription(brand: string, inRegion: string) {
  return (
    `${brand} is an audit, tax and advisory firm in ${inRegion}. Statutory audit, ` +
    "corporate tax, VAT, company formation and outsourced finance for growing businesses."
  );
}

/**
 * The contact details that are the same wherever you reach the firm.
 *
 * The inbox is shared across the group, and the mobile line is the one number
 * the group answers from — it is also the WhatsApp line below. Everything that
 * differs by region — the address, the landline, the map link — comes from that
 * region's office instead; see `contactFor`.
 */
export const contactDetails = {
  email: "info@athGADLANG.com",
  /** Mobile line, shown in the footer. */
  mobile: "(+971) 50 5136542",
  mobileHref: "tel:+971505136542",
  openHours: "Mon – Fri (8:30 AM to 6:30 PM)",
} as const;

/**
 * Contact details as a visitor in `code` should see them: the shared ones
 * above, plus the address, landline and map link of the office serving that
 * region.
 *
 * Every surface that prints an address takes it from here, so switching region
 * switches the address with it — the whole point of running a site per region.
 */
export function contactFor(code: TenantCode) {
  const office = officeForTenant(code);

  return {
    ...contactDetails,
    office,
    phone: office.phone,
    phoneHref: office.phoneHref,
    address: office.address,
    mapHref: mapHref(office),
  };
}

/**
 * The floating chat button.
 *
 * No API and no account setup: wa.me takes the number as digits only — no plus,
 * no spaces — and opens the chat in the app on a phone, or WhatsApp Web on a
 * desktop. The number is the mobile line above, read from its tel: href so it
 * is written down once.
 */
export const whatsapp = {
  get number() {
    return contactDetails.mobileHref.replace(/\D/g, "");
  },
  /** Prefilled first message. The sender can edit it before sending. */
  greeting: "Hello athGADLANG, I would like to know more about your services.",
  get href() {
    return `https://wa.me/${this.number}?text=${encodeURIComponent(
      this.greeting,
    )}`;
  },
} as const;

/** Recruitment portal — a separate application, on its own subdomain. */
export const careersUrl = "https://recruit.athgadlang.com/";

/**
 * The aG Resources offers are practices in their own right, so each has a
 * top-level page rather than a nested one — even though all three are listed
 * under Resourcing in the navbar. One page, one URL: the nested routes are
 * never generated for them.
 */
export const bpoHref = "/services/business-process-outsourcing";
export const talentAcquisitionHref = "/services/talent-acquisition";
export const remoteWorkforceHref = "/services/remote-workforce-solutions";

/**
 * The downloadable company profile.
 *
 * NOT IN THE REPOSITORY YET — drop the PDF at `public/docs/` under this exact
 * name, or point this at wherever it is hosted. Until then the download button
 * on the about page 404s.
 */
export const companyProfilePdf = "/docs/athgadlang-company-profile.pdf";

export type Award = {
  /** Headline, with `accent` set apart at the end of it. */
  headline: string;
  accent: string;
  /** The qualifying line beneath, e.g. how few firms were ranked. */
  note?: string;
  /** Where this firm placed, e.g. "Silver in Accounting". */
  tier?: string;
  /** Text of the badge itself, used when the artwork is not supplied. */
  badge: { primary: string; year: string; scope?: string };
  /**
   * The official badge artwork. Drop the file in `public/images/` and set it
   * here; until then the badge renders as a typographic plaque, because the
   * awarding body's artwork is theirs and cannot be recreated.
   */
  image?: { src: string; alt: string; width: number; height: number };
};

/** Third-party recognition, cited on the pages it applies to. */
export const awards = {
  topConsultingFirm: {
    headline: "Ranked among top consulting firms in the",
    accent: "Middle East",
    note: "From 500+ Consulting Firms, ONLY 28 were ranked.",
    tier: "Silver in Accounting",
    badge: {
      primary: "Top Consulting Firm",
      year: "2025",
      scope: "Middle East",
    },
  },
} satisfies Record<string, Award>;

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    items: [
      {
        label: "Assurance",
        href: "/services/assurance",
        description:
          "Unbiased financial assessment to help organizations tackle global challenges with confidence.",
        image: serviceImages.assurance,
        card: {
          tagline: "Reliable assurance for a secure tomorrow.",
          body:
            "When it comes to assurance, trust is everything. Our experts bring rigor, insight, and reliability to every engagement, so you can make critical business decisions with unwavering confidence. Redefine trust with {brand}.",
        },
        featured: true,
        items: [
          {
            label: "Agreed Upon Procedures (AUP)",
            href: "/services/assurance#agreed-upon-procedures",
          },
          {
            label: "Statutory and External Audit Support",
            href: "/services/assurance#statutory-external-audit",
          },
        ],
      },
      {
        label: "Accounting",
        href: "/services/accounting",
        description:
          "Precise financial records enabling informed decisions and efficient business operations.",
        image: serviceImages.accounting,
        card: {
          tagline: "Strategic accounting for seamless growth.",
          body:
            "We know numbers tell a story, and we're here to ensure yours is a success. Our Accounting solutions are tailored for seamless financial management. Empowering your business with data-driven insights and ensure every decision counts.",
        },
        featured: true,
        items: [
          {
            label: "Accounting & Bookkeeping",
            href: "/services/accounting#accounting-bookkeeping",
          },
          { label: "Payroll Services", href: "/services/accounting#payroll-services" },
          { label: "Software Setup", href: "/services/accounting#software-setup" },
          {
            label: "Preparation & Review of Financial Statements",
            href: "/services/accounting#financial-statements",
          },
          {
            label: "Management Reporting",
            href: "/services/accounting#management-reporting",
          },
        ],
      },
      {
        label: "Tax",
        href: "/services/tax",
        description:
          "Integrated tax solutions that optimize liabilities, ensure compliance, and support global expansion.",
        image: serviceImages.tax,
        card: {
          tagline: "Smarter tax planning, greater savings.",
          body:
            "As regulations evolve, your strategy should too. Our tax advisory services bring forward-thinking strategies that ensure you stay compliant while driving sustainable growth. Ready for a smarter tax future?",
        },
        featured: true,
        items: [
          { label: "Corporate Income Tax", href: "/services/tax#corporate-tax" },
          { label: "Transfer Pricing", href: "/services/tax#transfer-pricing" },
          { label: "Value Added Tax (VAT)", href: "/services/tax#value-added-tax" },
        ],
      },
      {
        label: "Resourcing",
        href: "/services/resourcing",
        description:
          "Expert-driven staffing that puts the right talent in place at the right time, boosting productivity and success.",
        image: serviceImages.resourcing,
        card: {
          tagline: "Top talent, zero hassle. Hire with us!",
          body:
            "Empower your team with agile talent solutions that grow with you. Our resourcing services connect you with the expertise you need, exactly when you need it. Let's build a team that drives results.",
        },
        featured: true,
        items: [
          { label: "Business Process Outsourcing (BPO)", href: bpoHref },
          { label: "Talent Acquisition", href: talentAcquisitionHref },
          {
            label: "On-site and Off-site Secondments",
            href: "/services/resourcing#secondments",
          },
          {
            label: "C-level Support Services",
            href: "/services/resourcing#c-level-support",
          },
          { label: "Remote Workforce Solutions", href: remoteWorkforceHref },
          {
            label: "Recruitment Process Outsourcing (RPO)",
            href: "/services/resourcing#recruitment-process-outsourcing",
          },
          {
            label: "End-to-end Outsourcing",
            href: "/services/resourcing#end-to-end-outsourcing",
          },
        ],
      },
      {
        label: "Consulting",
        href: "/services/consulting",
        description:
          "Strategic consulting across finance, marketing, economics, and HR to drive sustainable business growth.",
        image: serviceImages.consulting,
        card: {
          tagline: "Expert consulting for impactful results.",
          body:
            "In a world where change is constant, our consulting services bridge the gap between today's challenges and tomorrow's achievements, so you can act with purpose and precision. Let's redefine what's possible!",
        },
        featured: true,
        items: [
          { label: "Business Advisory", href: "/services/consulting#business-advisory" },
          {
            label: "Forensic Investigations",
            href: "/services/consulting#forensic-investigations",
          },
          {
            label: "Transaction Advisory",
            href: "/services/consulting#transaction-advisory",
          },
          { label: "Risk Advisory", href: "/services/consulting#risk-advisory" },
          {
            label: "Financial Accounting & Advisory Services (FAAS)",
            href: "/services/consulting#financial-accounting-advisory",
          },
          { label: "Corporate Finance", href: "/services/consulting#corporate-finance" },
          { label: "Corporate Services", href: "/services/consulting#corporate-services" },
          {
            label: "Technology Advisory",
            href: "/services/consulting#technology-advisory",
          },
          {
            label: "Learning & Development",
            href: "/services/consulting#learning-development",
          },
        ],
      },
      {
        label: "Corporate Services",
        href: "/services/corporate-services",
        description:
          "End-to-end company setup, licensing, and governance support for entering and operating in new markets.",
        image: serviceImages["corporate-services"],
        items: [
          {
            label: "Company Formation",
            href: "/services/corporate-services#company-formation",
          },
          {
            label: "Company Liquidation",
            href: "/services/corporate-services#company-liquidation",
          },
          { label: "PRO Services", href: "/services/corporate-services#pro-services" },
          {
            label: "Golden Visa Services",
            href: "/services/corporate-services#golden-visa-services",
          },
          {
            label: "Bank Account Opening Assistance",
            href: "/services/corporate-services#bank-account-opening-assistance",
          },
          {
            label: "Trademark Registration",
            href: "/services/corporate-services#trademark-registration",
          },
        ],
      },
      {
        label: "Fixed Asset & Inventory Management",
        href: "/services/fixed-asset-inventory-management",
        description:
          "Physical verification, tagging, and reconciliation that keep your fixed asset register audit-ready.",
        image: serviceImages["fixed-asset-inventory-management"],
        items: [
          {
            label: "Fixed Asset Management",
            href: "/services/fixed-asset-inventory-management#fixed-asset-management",
          },
          {
            label: "Inventory Management",
            href: "/services/fixed-asset-inventory-management#inventory-management",
          },
        ],
      },
    ],
  },
  { label: "Events", href: "/events" },
  { label: "Insights", href: "/insights" },
  { label: "Webinars", href: "/webinars" },
  // Careers lives on the recruitment portal, not this site.
  { label: "Careers", href: careersUrl },
];

/**
 * Social profiles, as shown in the footer.
 *
 * The LinkedIn address is the plain company page rather than the posts feed the
 * team works from: `?feedView=all` is a view of their own dashboard, and a
 * visitor following it lands somewhere less useful than the page itself.
 */
export const socialLinks = [
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/athgadlang/",
  },
  {
    platform: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/athGADLANG.FinanceConsultingFirm",
  },
  { platform: "x", label: "X", href: "https://x.com/athGADLANG" },
  {
    platform: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@athGADLANG",
  },
  {
    platform: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/athgadlang/",
  },
] as const;

export type SocialPlatform = (typeof socialLinks)[number]["platform"];

/**
 * Secondary footer column — everything that isn't a service.
 *
 * Industries and Our Leaders are anchors into the homepage rather than routes:
 * both are homepage sections, and there are no separate pages planned for them.
 */
export const companyLinks = [
  { label: "Events", href: "/events" },
  { label: "Insights", href: "/insights" },
  { label: "Webinars", href: "/webinars" },
  { label: "Industries", href: "/#industries" },
  { label: "Our Leaders", href: "/#leaders" },
  { label: "Careers", href: careersUrl },
  { label: "Company Profile", href: "/company-profile" },
];

/** Bottom-bar legal links. */
export const legalLinks = [
  { label: "Terms Of Use", href: "/terms-of-use" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Legal Information", href: "/legal-information" },
];

/* Regions live in lib/tenants.ts — each is served from its own subdomain. */

/** All service categories, in nav order. */
export const services: NavItem[] =
  navigation.find((item) => item.href === "/services")?.items ?? [];

/** Services surfaced as cards on the homepage — flip `featured` to change. */
export const featuredServices = services.filter((service) => service.featured);

/**
 * The footer's Services column: every practice area in nav order, then the
 * three aG Resources offers clients arrive looking for by name.
 *
 * The practice areas used to give up their slots to those three, because only
 * they had pages. All five have pages now, so nothing here stands in for
 * anything else and the column matches the navbar.
 */
export const footerServiceLinks: NavItem[] = [
  ...featuredServices,
  { label: "BPO", href: bpoHref },
  { label: "Talent Acquisition", href: talentAcquisitionHref },
  { label: "Remote Workforce Solutions", href: remoteWorkforceHref },
];
