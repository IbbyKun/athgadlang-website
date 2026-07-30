/**
 * Single source of truth for site chrome: navigation, locations, CTAs.
 * Add or reorder entries here and every nav surface (desktop, mobile,
 * footer) picks the change up — no component edits needed.
 */

import { serviceImages } from "@/lib/images";

export type NavItem = {
  label: string;
  href: string;
  /** Renders as a nested flyout on desktop and a collapsible group on mobile. */
  items?: NavItem[];
  /** Card copy. Only needed for entries surfaced as cards, e.g. services. */
  description?: string;
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

/** Head-office contact details, as shown on the contact section and footer. */
export const contactDetails = {
  email: "info@athGADLANG.com",
  phone: "(+971) 4 878 7025",
  /** Digits only, for the tel: link. */
  phoneHref: "tel:+97148787025",
  /** Mobile line, shown in the footer. */
  mobile: "(+971) 50 5136542",
  mobileHref: "tel:+971505136542",
  openHours: "Mon – Fri (8:30 AM to 6:30 PM)",
  address: "Office # 2804, API World Tower, Sheikh Zayed Road, Dubai - UAE",
  /** Geocodes more reliably than the full address with its unit number. */
  mapQuery: "API World Tower, Sheikh Zayed Road, Dubai",
  get mapHref() {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      this.mapQuery,
    )}`;
  },
  /**
   * Keyless Google Maps embed, used as the tinted backdrop on the contact
   * section. Swap for a Google My Maps share URL to show several pins.
   */
  get mapEmbedUrl() {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      this.mapQuery,
    )}&z=15&output=embed`;
  },
} as const;

/** Recruitment portal — a separate application, on its own subdomain. */
export const careersUrl = "https://recruit.athgadlang.com/";

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
        featured: true,
        items: [
          {
            label: "Agreed Upon Procedures (AUP)",
            href: "/services/assurance/agreed-upon-procedures",
          },
          {
            label: "Statutory and External Audit Support",
            href: "/services/assurance/statutory-external-audit-support",
          },
        ],
      },
      {
        label: "Accounting",
        href: "/services/accounting",
        description:
          "Precise financial records enabling informed decisions and efficient business operations.",
        image: serviceImages.accounting,
        featured: true,
        items: [
          {
            label: "Accounting & Bookkeeping",
            href: "/services/accounting/accounting-bookkeeping",
          },
          { label: "Payroll Services", href: "/services/accounting/payroll-services" },
          { label: "Software Setup", href: "/services/accounting/software-setup" },
          {
            label: "Preparation & Review of Financial Statements",
            href: "/services/accounting/financial-statements",
          },
          {
            label: "Management Reporting",
            href: "/services/accounting/management-reporting",
          },
        ],
      },
      {
        label: "Tax",
        href: "/services/tax",
        description:
          "Integrated tax solutions that optimize liabilities, ensure compliance, and support global expansion.",
        image: serviceImages.tax,
        featured: true,
        items: [
          { label: "Corporate Income Tax", href: "/services/tax/corporate-income-tax" },
          { label: "Transfer Pricing", href: "/services/tax/transfer-pricing" },
          { label: "Value Added Tax (VAT)", href: "/services/tax/vat" },
        ],
      },
      {
        label: "Resourcing",
        href: "/services/resourcing",
        description:
          "Expert-driven staffing that puts the right talent in place at the right time, boosting productivity and success.",
        image: serviceImages.resourcing,
        featured: true,
        items: [
          {
            label: "Business Process Outsourcing (BPO)",
            href: "/services/resourcing/business-process-outsourcing",
          },
          { label: "Talent Acquisition", href: "/services/resourcing/talent-acquisition" },
          {
            label: "On-site and Off-site Secondments",
            href: "/services/resourcing/secondments",
          },
          {
            label: "C-level Support Services",
            href: "/services/resourcing/c-level-support-services",
          },
          {
            label: "Remote Work Solutions",
            href: "/services/resourcing/remote-work-solutions",
          },
          {
            label: "Recruitment Process Outsourcing (RPO)",
            href: "/services/resourcing/recruitment-process-outsourcing",
          },
          {
            label: "End-to-end Outsourcing",
            href: "/services/resourcing/end-to-end-outsourcing",
          },
        ],
      },
      {
        label: "Consulting",
        href: "/services/consulting",
        description:
          "Strategic consulting across finance, marketing, economics, and HR to drive sustainable business growth.",
        image: serviceImages.consulting,
        featured: true,
        items: [
          { label: "Business Advisory", href: "/services/consulting/business-advisory" },
          {
            label: "Forensic Investigations",
            href: "/services/consulting/forensic-investigations",
          },
          {
            label: "Transaction Advisory",
            href: "/services/consulting/transaction-advisory",
          },
          { label: "Risk Advisory", href: "/services/consulting/risk-advisory" },
          {
            label: "Financial Accounting & Advisory Services (FAAS)",
            href: "/services/consulting/financial-accounting-advisory-services",
          },
          { label: "Corporate Finance", href: "/services/consulting/corporate-finance" },
          { label: "Corporate Services", href: "/services/consulting/corporate-services" },
          {
            label: "Technology Advisory",
            href: "/services/consulting/technology-advisory",
          },
          {
            label: "Learning & Development",
            href: "/services/consulting/learning-development",
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
            href: "/services/corporate-services/company-formation",
          },
          {
            label: "Company Liquidation",
            href: "/services/corporate-services/company-liquidation",
          },
          { label: "PRO Services", href: "/services/corporate-services/pro-services" },
          {
            label: "Golden Visa Services",
            href: "/services/corporate-services/golden-visa-services",
          },
          {
            label: "Bank Account Opening Assistance",
            href: "/services/corporate-services/bank-account-opening-assistance",
          },
          {
            label: "Trademark Registration",
            href: "/services/corporate-services/trademark-registration",
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
            href: "/services/fixed-asset-inventory-management/fixed-asset-management",
          },
          {
            label: "Inventory Management",
            href: "/services/fixed-asset-inventory-management/inventory-management",
          },
        ],
      },
    ],
  },
  { label: "Insights", href: "/insights" },
  { label: "Webinars", href: "/webinars" },
  // Careers lives on the recruitment portal, not this site.
  { label: "Careers", href: careersUrl },
];

/**
 * Social profiles. Hrefs are placeholders — replace each "#" with the real
 * profile URL; the icon is hidden for any entry left unset.
 */
export const socialLinks = [
  { platform: "facebook", label: "Facebook", href: "#" },
  { platform: "x", label: "X", href: "#" },
  { platform: "youtube", label: "YouTube", href: "#" },
  { platform: "linkedin", label: "LinkedIn", href: "#" },
  { platform: "instagram", label: "Instagram", href: "#" },
] as const;

export type SocialPlatform = (typeof socialLinks)[number]["platform"];

/** Secondary footer column — everything that isn't a service. */
export const companyLinks = [
  { label: "Insights", href: "/insights" },
  { label: "Webinars", href: "/webinars" },
  { label: "Industries", href: "/industries" },
  { label: "Our Leaders", href: "/about/leadership" },
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
