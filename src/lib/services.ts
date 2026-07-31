import { serviceCapabilityImages, serviceHeroImages, serviceImages } from "@/lib/images";
import { featuredServices, type NavItem } from "@/lib/site-config";

/** Last path segment of a nav href: "/services/accounting" -> "accounting". */
function slugOf(href: string) {
  return href.split("/").filter(Boolean).pop() ?? "";
}

/**
 * The practice areas with detail pages: Assurance, Accounting, Tax,
 * Resourcing and Consulting. Corporate Services and Fixed Asset & Inventory
 * Management are deliberately out of scope for now — flip `featured` on them
 * in site-config to bring their pages in.
 */
export const serviceCategories = featuredServices;

/** Every practice-area slug, for `generateStaticParams`. */
export function categoryRoutes() {
  return serviceCategories.map((category) => ({
    category: slugOf(category.href),
  }));
}

/** The practice area behind a URL, or undefined so the route can 404. */
export function findCategory(category: string) {
  return serviceCategories.find((item) => slugOf(item.href) === category);
}

/** Practice areas other than this one, for cross-linking. */
export function otherCategories(category: NavItem) {
  return serviceCategories.filter((item) => item.href !== category.href);
}

/** Every `[category]/[service]` pair, for `generateStaticParams`. */
export function serviceRoutes() {
  return serviceCategories.flatMap((category) =>
    (category.items ?? [])
      // A service pointing outside its category has a page of its own — BPO —
      // so it must not also be generated here, or it would exist at two URLs.
      .filter((service) => service.href.startsWith(`${category.href}/`))
      .map((service) => ({
        category: slugOf(category.href),
        service: slugOf(service.href),
      })),
  );
}

/** The nav entries behind a URL, or undefined so the route can 404. */
export function findService(category: string, service: string) {
  const parent = serviceCategories.find(
    (item) => slugOf(item.href) === category,
  );
  const child = parent?.items?.find((item) => slugOf(item.href) === service);

  if (!parent || !child) return undefined;

  return { category: parent, service: child };
}

/** Sibling services within the same practice area, for the "also" rail. */
export function siblingServices(category: NavItem, service: NavItem) {
  return (category.items ?? []).filter((item) => item.href !== service.href);
}

export type ServiceCapability = {
  slug: keyof typeof serviceCapabilityImages;
  title: string;
  description: string;
};

export type ServiceContent = {
  /**
   * The page this copy belongs to: a practice area (`"accounting"`) or a
   * single service within one (`"accounting/payroll-services"`).
   */
  path: string;
  /** Section heading above the introduction. */
  heading: string;
  intro: string;
  hero?: { src: string; alt: string };
  capabilities?: ServiceCapability[];
  /** Leader slugs, shown with their biographies. */
  leaders?: string[];
  /** Named team members without profiles yet — rendered as monograms. */
  keyTeam?: string[];
  /** Insight categories to surface under "What We Think". */
  insightCategories?: string[];
};

/**
 * Page copy, keyed by route — practice areas and individual services alike.
 *
 * Only the pages signed off so far appear here. Anything absent still gets a
 * page: the hero, the introduction and the shared closing sections render, and
 * the capability panels are simply omitted until the copy lands. Add an entry
 * to fill a page in — no component changes needed.
 *
 * Copy is reproduced as supplied, including the "aG Resources" brand name in
 * the accounting text — that wording is deliberate, so leave it as it is.
 */
export const serviceContent: ServiceContent[] = [
  {
    path: "accounting",
    heading: "Accounting & Bookkeeping Services",
    intro:
      "Accurate financial records are the backbone of any successful business. At aG Resources, we take the complexity out of accounting, ensuring your books are up to date, compliant, and insightful for decision-making. Whether you need day-to-day bookkeeping or strategic financial reporting, our expert team is here to support your growth with precision and diligence.",
    hero: serviceHeroImages.accounting,
    capabilities: [
      {
        slug: "accounts-payable-receivable",
        title: "Accounts Payable & Receivable",
        description:
          "Managing cash flow effectively starts with organized payables and receivables. We ensure your invoices are processed accurately and on time, helping you maintain healthy vendor relationships and steady cash flow. Our team keeps track of outstanding payments, prevents delays, and reduces the risk of financial discrepancies.",
      },
      {
        slug: "bank-reconciliation",
        title: "Bank Reconciliation",
        description:
          "Eliminate errors and maintain financial accuracy with our bank reconciliation services. We match your records with bank statements to identify discrepancies, detect fraud, and ensure your accounts reflect the true financial position of your business. With aG Resources, you can trust that your finances are always aligned and error-free.",
      },
      {
        slug: "financial-statement-preparation",
        title: "Financial Statement Preparation",
        description:
          "Gain clarity on your financial standing with precise, compliant financial statements. We prepare income statements, balance sheets, and cash flow statements that adhere to IFRS and regulatory standards, ensuring you have accurate reports for investors, stakeholders, and decision-making.",
      },
      {
        slug: "tax-compliance",
        title: "Tax Compliance",
        description:
          "Navigating tax regulations can be overwhelming, but we make it seamless. Our tax compliance services ensure your business meets all local and international tax requirements, minimizing risks and maximizing deductions. From VAT to corporate tax filings, we handle everything so you can stay focused on growth.",
      },
      {
        slug: "payroll-management",
        title: "Payroll Management",
        description:
          "Payroll is more than just salaries — it's about accuracy, compliance, and employee satisfaction. We streamline payroll processing, tax deductions, and statutory contributions, ensuring your employees are paid correctly and on time. Whether you have a small team or a large workforce, we make payroll stress-free.",
      },
      {
        slug: "budgeting-forecasting",
        title: "Budgeting & Forecasting",
        description:
          "Plan with confidence using our budgeting and forecasting services. We help you develop realistic financial projections, control costs, and identify growth opportunities. Our insights empower you to make informed decisions and maintain financial stability, even in fluctuating market conditions.",
      },
      {
        slug: "audit-support",
        title: "Audit Support",
        description:
          "Preparing for an audit can be time-consuming, but we simplify the process. Our audit support services ensure your records are organized, compliant, and ready for external review. Whether it's internal audits or statutory audits, we provide the documentation and guidance needed for a smooth audit experience.",
      },
      {
        slug: "custom-reporting",
        title: "Custom Reporting",
        description:
          "Every business has unique financial needs. Our custom reporting services provide tailored financial insights to help you track performance, analyze trends, and make strategic decisions. We design reports that align with your business objectives, offering you a clear and comprehensive financial overview.",
      },
    ],
    leaders: ["usman-alam", "abdullah-taimoor"],
    keyTeam: ["Ammar Kaghdi", "Awais Ranjha", "Mariam Abdul Ahad"],
    insightCategories: ["Accounting", "Tax", "Compliance"],
  },
  {
    path: "business-process-outsourcing",
    heading: "Business Process Outsourcing (BPO)",
    intro:
      "Optimize your operations, reduce costs, and enhance efficiency with our Business Process Outsourcing (BPO) solutions. At aG Resources, we provide industry-specific outsourcing services, allowing businesses to delegate non-core functions while maintaining control and quality. Whether you need financial experts, customer support teams, or back-office specialists, our tailored BPO solutions help you scale faster and operate smarter.",
    hero: serviceHeroImages["business-process-outsourcing"],
    capabilities: [
      {
        slug: "property-management-bpo",
        title: "Property Management BPO",
        description:
          "Streamline property operations with our end-to-end property management solutions. We handle accounting, lease administration, tenant communication, and maintenance coordination, ensuring smooth operations while you focus on growth.",
      },
      {
        slug: "financial-services-bpo",
        title: "Financial Services & Accounting Firms BPO",
        description:
          "Strengthen your finance team with our remote bookkeepers, tax professionals, and compliance experts. We provide outsourced support for auditing, financial reporting, and regulatory compliance — helping firms optimize efficiency and reduce costs.",
      },
      {
        slug: "ecommerce-retail-bpo",
        title: "E-Commerce & Retail BPO",
        description:
          "Enhance your e-commerce and retail operations with order processing, inventory management, and customer support specialists. Our outsourcing teams ensure seamless transaction handling, product listings, and real-time financial reporting.",
      },
      {
        slug: "technology-saas-bpo",
        title: "Technology & SaaS BPO",
        description:
          "Support your tech-driven business with our customer success teams, IT support specialists, and software testing experts. We provide data processing, technical troubleshooting, and backend teams to improve your service efficiency.",
      },
      {
        slug: "call-support-bpo",
        title: "Call Centers & Customer Support BPO",
        description:
          "Deliver exceptional customer experiences with our multilingual remote agents. We provide 24/7 inbound/outbound call handling, live chat, and email support teams, ensuring your customers receive timely and professional assistance.",
      },
      {
        slug: "healthcare-billing-bpo",
        title: "Healthcare & Medical Billing BPO",
        description:
          "Optimize healthcare administration with our claims processing, medical transcription, and patient data management teams. We help medical providers and healthcare firms reduce paperwork, ensure compliance, and focus on patient care.",
      },
      {
        slug: "marketing-creative-bpo",
        title: "Marketing & Creative Agencies BPO",
        description:
          "Scale your marketing efforts with our outsourced social media managers, content writers, graphic designers, and digital marketing experts. We help agencies execute campaigns, manage online presence, and create high-impact content efficiently.",
      },
    ],
    leaders: ["yasir-gadit"],
    keyTeam: ["Bilal Shehbaz", "Waseem Yaseen", "Ateeb Khan", "Saddam Mushtaq"],
    insightCategories: ["Advisory", "Accounting"],
  },
  {
    path: "talent-acquisition",
    heading: "Talent Acquisition",
    intro:
      "Finding the right talent is more than just filling positions — it's about securing professionals who drive success. At aG Resources, we act as your dedicated offsite recruitment partner, connecting you with top-tier candidates across industries. Whether you need junior staff or C-suite executives, our strategic hiring solutions ensure you find the perfect fit for your organization.",
    hero: serviceHeroImages["talent-acquisition"],
    capabilities: [
      {
        slug: "executive-search-hiring",
        title: "Executive Search & Leadership Hiring",
        description:
          "Secure top-level professionals who can lead with vision and expertise. We specialize in sourcing C-suite executives, senior managers, and leadership roles, ensuring your business has the right minds to navigate challenges and drive growth.",
      },
      {
        slug: "permanent-contract-staffing",
        title: "Permanent & Contract Staffing",
        description:
          "Whether you need full-time employees or temporary talent for specific projects, we provide customized staffing solutions. Our extensive network and thorough screening process ensure that you get skilled professionals who align with your business needs.",
      },
      {
        slug: "industry-specific-recruitment",
        title: "Industry-Specific Recruitment",
        description:
          "Every industry has unique hiring challenges. Our recruitment specialists understand the nuances of different sectors, from finance and technology to healthcare and engineering, ensuring you get candidates with the right expertise.",
      },
      {
        slug: "end-to-end-recruitment",
        title: "End-to-End Recruitment Support",
        description:
          "We handle the entire hiring process, from job profiling and candidate sourcing to interviews, assessments, and final onboarding. Our streamlined approach reduces hiring time and ensures a seamless experience for both employers and candidates.",
      },
      {
        slug: "employer-branding-strategy",
        title: "Employer Branding & Talent Strategy",
        description:
          "Attract top talent with a strong employer brand. We help businesses refine their hiring strategies, craft compelling job descriptions, and position themselves as desirable workplaces to attract and retain high-quality candidates.",
      },
      {
        slug: "bulk-volume-hiring",
        title: "Bulk Hiring & Volume Recruitment",
        description:
          "Need to scale your workforce quickly? Our bulk hiring solutions help businesses efficiently recruit large numbers of employees without compromising on quality. From screening to onboarding, we manage the entire process.",
      },
      {
        slug: "remote-global-hiring",
        title: "Remote & Global Hiring Solutions",
        description:
          "Expand your talent pool beyond borders. We assist businesses in sourcing and hiring remote professionals or international candidates, ensuring you have access to the best talent, no matter where they are.",
      },
    ],
    leaders: ["arslan-mushtaq"],
    keyTeam: [
      "Suhail Memon",
      "Muhammad Farrukh Fayyaz",
      "Rahul Manwni",
      "Ghulam Ashraf",
      "Mohd Furqan",
    ],
    insightCategories: ["Advisory", "Accounting"],
  },
  {
    path: "remote-workforce-solutions",
    heading: "Remote Workforce Solutions",
    intro:
      "Access top talent without overhead. At aG Resources, we provide dedicated remote professionals under a secondment model, ensuring you get the expertise you need while we manage payroll, administration, and infrastructure. Whether you require short-term specialists or long-term dedicated resources, our remote workforce solutions help you scale efficiently without compromising on quality.",
    hero: serviceHeroImages["remote-workforce-solutions"],
    capabilities: [
      {
        slug: "dedicated-remote-professionals",
        title: "Dedicated Remote Professionals",
        description:
          "Gain access to highly skilled remote talent tailored to your business needs. Our seconded professionals work exclusively for your company giving you flexibility without the operational burden.",
      },
      {
        slug: "payroll-compliance-management",
        title: "Payroll & Compliance Management",
        description:
          "Forget the complexities of remote payroll and labor laws. We manage salary processing, tax compliance, and benefits administration, ensuring full legal and financial adherence while keeping your remote workforce engaged.",
      },
      {
        slug: "it-infrastructure-support",
        title: "IT & Infrastructure Support",
        description:
          "Equip your remote team with the right tools and secure digital workspaces. We provide the necessary IT support, software setups, and cybersecurity measures to ensure seamless operations and data protection.",
      },
      {
        slug: "on-demand-workforce-scaling",
        title: "On-Demand Workforce Scaling",
        description:
          "Expand or downsize your team with ease. Whether you need temporary specialists for short-term projects or long-term remote employees, our flexible secondment model allows you to scale your workforce as your business evolves.",
      },
      {
        slug: "performance-management-reporting",
        title: "Performance Management & Reporting",
        description:
          "Maintain productivity and efficiency with structured performance tracking. We provide regular reports, KPIs, and dedicated account managers to ensure your remote workforce aligns with your business goals.",
      },
      {
        slug: "seamless-onboarding-integration",
        title: "Seamless Onboarding & Integration",
        description:
          "We take care of the entire onboarding process, ensuring your remote employees integrate smoothly into your team. From setting up communication channels to aligning them with company culture, we ensure a seamless transition.",
      },
    ],
    leaders: [
      "saqib-nisar",
      "yasir-gadit",
      "haziq-neshat-akhtar",
      "osman-babar",
    ],
    keyTeam: ["Khushboo Mushtaq", "Numair Kulkarni", "Wardah Siddiquie"],
    insightCategories: ["Advisory", "Accounting", "Compliance"],
  },
];

/** Copy for a route, e.g. `"accounting"` or `"accounting/payroll-services"`. */
export function getServiceContent(path: string) {
  return serviceContent.find((item) => item.path === path);
}

/** Panel artwork for a capability. */
export function capabilityImage(capability: ServiceCapability) {
  return serviceCapabilityImages[capability.slug];
}

/**
 * Hero artwork for a service page: its own if set, otherwise the practice
 * area's card image, so every page has a hero even without signed-off copy.
 */
export function serviceHero(category: NavItem, content?: ServiceContent) {
  const fallbackKey = slugOf(category.href) as keyof typeof serviceImages;

  return content?.hero ?? category.image ?? serviceImages[fallbackKey];
}
