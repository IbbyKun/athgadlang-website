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

export type Location = {
  label: string;
  /** ISO-ish slug used in the URL, e.g. /ae, /bh */
  code: string;
  href: string;
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
          { label: "External Audit", href: "/services/assurance/external-audit" },
          { label: "Internal Audit", href: "/services/assurance/internal-audit" },
          { label: "Agreed-Upon Procedures", href: "/services/assurance/agreed-upon-procedures" },
          { label: "Due Diligence", href: "/services/assurance/due-diligence" },
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
          { label: "Bookkeeping", href: "/services/accounting/bookkeeping" },
          { label: "Financial Reporting", href: "/services/accounting/financial-reporting" },
          { label: "Management Accounts", href: "/services/accounting/management-accounts" },
          { label: "Payroll Services", href: "/services/accounting/payroll" },
          { label: "IFRS Advisory", href: "/services/accounting/ifrs-advisory" },
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
          { label: "Corporate Tax", href: "/services/tax/corporate-tax" },
          { label: "VAT", href: "/services/tax/vat" },
          { label: "Excise Tax", href: "/services/tax/excise-tax" },
          { label: "Transfer Pricing", href: "/services/tax/transfer-pricing" },
          { label: "Tax Compliance", href: "/services/tax/compliance" },
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
          { label: "Permanent Recruitment", href: "/services/resourcing/permanent" },
          { label: "Contract Staffing", href: "/services/resourcing/contract-staffing" },
          { label: "Executive Search", href: "/services/resourcing/executive-search" },
          { label: "Secondment", href: "/services/resourcing/secondment" },
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
          { label: "Feasibility Studies", href: "/services/consulting/feasibility-studies" },
          { label: "Risk & Internal Controls", href: "/services/consulting/risk-controls" },
          { label: "ERP & Digital Transformation", href: "/services/consulting/erp-digital" },
          { label: "ESG Advisory", href: "/services/consulting/esg" },
        ],
      },
      {
        label: "Corporate Services",
        href: "/services/corporate-services",
        description:
          "End-to-end company setup, licensing, and governance support for entering and operating in new markets.",
        image: serviceImages["corporate-services"],
        items: [
          { label: "Company Formation", href: "/services/corporate-services/company-formation" },
          { label: "PRO Services", href: "/services/corporate-services/pro-services" },
          { label: "Company Liquidation", href: "/services/corporate-services/liquidation" },
          { label: "Corporate Governance", href: "/services/corporate-services/governance" },
        ],
      },
      {
        label: "Fixed Asset Inventory Management",
        href: "/services/fixed-asset-inventory-management",
        description:
          "Physical verification, tagging, and reconciliation that keep your fixed asset register audit-ready.",
        image: serviceImages["fixed-asset-inventory-management"],
        items: [
          { label: "Physical Verification", href: "/services/fixed-asset-inventory-management/physical-verification" },
          { label: "Asset Tagging & Barcoding", href: "/services/fixed-asset-inventory-management/asset-tagging" },
          { label: "Fixed Asset Register", href: "/services/fixed-asset-inventory-management/asset-register" },
          { label: "Valuation & Reconciliation", href: "/services/fixed-asset-inventory-management/valuation" },
        ],
      },
    ],
  },
  { label: "Insights", href: "/insights" },
  { label: "Webinars", href: "/webinars" },
  { label: "Careers", href: "/careers" },
];

export const locations: Location[] = [
  { label: "UAE", code: "ae", href: "/ae" },
  { label: "Bahrain", code: "bh", href: "/bh" },
  { label: "KSA", code: "sa", href: "/sa" },
  { label: "UK", code: "uk", href: "/uk" },
  { label: "Pakistan", code: "pk", href: "/pk" },
];

export const defaultLocation = locations[0];

/** All service categories, in nav order. */
export const services: NavItem[] =
  navigation.find((item) => item.href === "/services")?.items ?? [];

/** Services surfaced as cards on the homepage — flip `featured` to change. */
export const featuredServices = services.filter((service) => service.featured);
