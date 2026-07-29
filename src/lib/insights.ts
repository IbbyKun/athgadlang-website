import { insightImages } from "@/lib/images";

export type Insight = {
  slug: keyof typeof insightImages;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date — formatted at render time via `formatInsightDate`. */
  date: string;
  image: { src: string; alt: string };
};

/**
 * Placeholder editorial content. Replace with a CMS query or MDX collection
 * when the Insights section is wired to real articles — the components only
 * depend on the `Insight` shape.
 */
export const insights: Insight[] = [
  {
    slug: "ubo-regulations-uae",
    title:
      "Ultimate Beneficial Owner (UBO) Regulations in the UAE: Everything Businesses Need to Know",
    excerpt:
      "The UAE has significantly strengthened its corporate transparency framework by implementing robust Ultimate Beneficial Owner regulations. Here is what every entity must file, and when.",
    category: "Corporate Services",
    date: "2026-07-14",
    image: insightImages["ubo-regulations-uae"],
  },
  {
    slug: "commercial-vs-professional-licence",
    title:
      "UAE Commercial Licence vs Professional Licence: What Is the Difference?",
    excerpt:
      "Choosing the right business licence is one of the first and most important decisions when establishing a company in the UAE. We break down ownership, activity scope and cost.",
    category: "Company Formation",
    date: "2026-06-30",
    image: insightImages["commercial-vs-professional-licence"],
  },
  {
    slug: "register-trademark-uae",
    title:
      "How to Register a Trademark in the UAE: A Complete Guide to Protecting Your Brand",
    excerpt:
      "Building a strong brand takes time, investment and consistency. Protecting that brand is just as important — this guide walks through the full registration process.",
    category: "Advisory",
    date: "2026-06-18",
    image: insightImages["register-trademark-uae"],
  },
  {
    slug: "jebel-ali-free-zone",
    title:
      "Why Jebel Ali Free Zone Is the Preferred Choice for Businesses in the UAE",
    excerpt:
      "Jebel Ali Free Zone is one of the UAE's most established business destinations. It combines modern infrastructure, port access and a mature regulatory environment.",
    category: "Free Zones",
    date: "2026-06-02",
    image: insightImages["jebel-ali-free-zone"],
  },
  {
    slug: "corporate-tax-small-business-relief",
    title: "UAE Corporate Tax: Small Business Relief Explained",
    excerpt:
      "Businesses under the revenue threshold can elect to be treated as having no taxable income. We cover eligibility, the election mechanics and the record-keeping that still applies.",
    category: "Tax",
    date: "2026-05-21",
    image: insightImages["corporate-tax-small-business-relief"],
  },
  {
    slug: "transfer-pricing-documentation-gcc",
    title: "Transfer Pricing Documentation: What GCC Groups Must Prepare",
    excerpt:
      "Master file, local file and disclosure form requirements are now firmly in force. Here is a practical timeline for getting intercompany documentation audit-ready.",
    category: "Tax",
    date: "2026-05-07",
    image: insightImages["transfer-pricing-documentation-gcc"],
  },
  {
    slug: "ksa-e-invoicing-phase-two",
    title: "E-Invoicing in Saudi Arabia: A Phase 2 Readiness Checklist",
    excerpt:
      "ZATCA integration brings clearance, cryptographic stamps and API onboarding. Use this checklist to confirm your ERP and invoicing flows will pass validation.",
    category: "Compliance",
    date: "2026-04-23",
    image: insightImages["ksa-e-invoicing-phase-two"],
  },
  {
    slug: "ifrs-18-financial-statements",
    title: "IFRS 18 Is Coming: How Your Financial Statements Will Change",
    excerpt:
      "New categories in the income statement, defined subtotals and disclosure of management-defined performance measures. What to start changing in your reporting now.",
    category: "Accounting",
    date: "2026-04-09",
    image: insightImages["ifrs-18-financial-statements"],
  },
];

export function insightHref(insight: Insight) {
  return `/insights/${insight.slug}`;
}
