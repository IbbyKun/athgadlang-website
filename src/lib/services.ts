import { serviceCapabilityImages, serviceHeroImages, serviceImages } from "@/lib/images";
import { awards, featuredServices, type Award, type NavItem } from "@/lib/site-config";

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
  /** One paragraph, or several. */
  description: string | string[];
  /** Named sub-services, listed under the copy. */
  items?: string[];
};

/** A figure in the "trusted by numbers" band. */
export type ServiceStat = { value: string; label: string };

export type ServiceFaq = { question: string; answer: string };

export type ServiceContent = {
  /**
   * The page this copy belongs to: a practice area (`"accounting"`) or a
   * single service within one (`"accounting/payroll-services"`).
   */
  path: string;
  /** Section heading above the introduction. */
  heading: string;
  /** Opening paragraph. Also used as the page's meta description. */
  intro: string;
  /** A second introductory paragraph, where the practice runs to two. */
  introMore?: string;
  hero?: { src: string; alt: string };
  capabilities?: ServiceCapability[];
  /** Leader slugs, shown with their biographies. */
  leaders?: string[];
  /** Named team members without profiles yet — rendered as monograms. */
  keyTeam?: string[];
  /** Insight categories to surface under "What We Think". */
  insightCategories?: string[];
  /** Webinar slugs to lead the "Webinars" rail, topped up with the latest. */
  webinarSlugs?: string[];
  /** Recognition to cite on this page, shown ahead of the partners. */
  award?: Award;
  /** Figures band: the heading, then the figures themselves. */
  stats?: { title: string; description?: string; items: ServiceStat[] };
  /** Testimonial ids from `lib/testimonials`. */
  testimonials?: string[];
  faqs?: ServiceFaq[];
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
    path: "assurance",
    heading: "Assurance Services",
    intro:
      "At athGADLANG, we offer strategic assurance solutions that go beyond traditional audits to provide actionable insights, strengthen controls, and mitigate risks in a complex business landscape. Our services deliver confidence in your financials, operations, and compliance, positioning you for sustainable growth and resilience.",
    introMore:
      "Whether navigating statutory requirements, assessing enterprise risks, or optimizing processes, we combine deep expertise with forward-thinking methodologies to enhance governance and performance. By partnering with your teams, we transform assurance into a value driver, ensuring robust internal controls and strategic alignment without diverting your core resources.",
    capabilities: [
      {
        slug: "agreed-upon-procedures",
        title: "Agreed Upon Procedures",
        description:
          "Flexible, objective assurance tailored to your exact needs. Our Agreed-Upon Procedures (AUP) engagements focus on specific assertions — such as balance verifications, transaction testing, or control walkthroughs — performed precisely as per your agreed criteria and international standards (AICPA/ISA). We issue a clear practitioner's report with findings only, enabling efficient validation for scenarios like acquisition due diligence, loan covenants, royalty disputes, regulatory filings, or internal certifications. No opinions, just facts — delivered fast and cost-effectively.",
      },
      {
        slug: "statutory-external-audit",
        title: "Statutory and External Audit Support",
        description:
          "Comprehensive support for regulatory compliance and financial transparency. We conduct full statutory audits compliant with IFRS/GAAP and local mandates (e.g., UAE FTA, KSA ZATCA), while facilitating external audits through organized PBC lists, walkthroughs, and data rooms. Our experts handle complex areas like consolidations, provisions, and disclosures, minimizing disruptions, accelerating timelines, and providing actionable insights to strengthen controls, optimize reporting, and satisfy stakeholders, boards, and authorities with unqualified opinions.",
      },
    ],
    leaders: ["usman-alam", "saqib-nisar"],
    keyTeam: [
      "Ammar Kagdhi",
      "Syed Ali Hassan",
      "Usman Hussain",
      "Ramesh Lama",
      "Ali Ahmad Zahid",
    ],
    insightCategories: ["Compliance", "Accounting", "Corporate Services"],
    testimonials: ["mohammed-al-suwaidi", "laura-chen", "ravi-patel"],
    faqs: [
      {
        question: "How does your assurance differ from traditional audit firms?",
        answer:
          "We emphasize strategic value with risk-focused, tech-enabled reviews that deliver insights for growth, not just compliance checklists.",
      },
      {
        question:
          "What is the timeline for a statutory audit or internal controls assessment?",
        answer:
          "Standard audits wrap in 4-6 weeks; assessments in 2-4 weeks. We scale resources for urgency while maintaining quality.",
      },
      {
        question: "Do you handle multi-jurisdiction or group consolidations?",
        answer:
          "Yes, with expertise in IFRS/GAAP across regions, ensuring seamless group audits and harmonized reporting.",
      },
      {
        question: "How do you incorporate data analytics and IT in assurance?",
        answer:
          "We use advanced tools for continuous monitoring, anomaly detection, and IT controls testing, providing proactive, real-time assurance.",
      },
      {
        question: "Can we retain control over the assurance process?",
        answer:
          "Fully. We align with your SLAs, involve your teams, and provide transparent reporting for oversight and ownership.",
      },
      {
        question: "Is assurance cost-effective for mid-sized businesses?",
        answer:
          "Yes, our flexible model avoids fixed overheads, targeting high-impact areas to deliver superior ROI compared to in-house teams.",
      },
    ],
  },
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
    award: awards.topConsultingFirm,
  },
  {
    path: "tax",
    heading: "Tax Services",
    intro:
      "At athGADLANG, we provide specialized tax services tailored to the UAE's evolving landscape, including the new Corporate Tax regime, ensuring compliance, optimization, and strategic tax planning for businesses operating in this dynamic hub. Our expert-driven solutions help you navigate federal and emirate-specific requirements with precision and foresight.",
    introMore:
      "Whether you're preparing for Corporate Tax registration, managing VAT returns, or structuring transfer pricing policies, we deliver end-to-end support that minimizes liabilities, maximizes deductions, and aligns with FTA guidelines. By combining local regulatory knowledge with global best practices, we empower your business to thrive amid rapid changes like the 9% CT rate and economic substance rules, without the complexity of building an in-house tax function.",
    capabilities: [
      {
        slug: "corporate-tax",
        title: "Corporate Tax",
        description: [
          "With UAE Corporate Tax now live at 9% (0% for qualifying free zone entities), compliance is critical. Our services cover registration, tax computations, return filings, advance pricing agreements, and audits with the Federal Tax Authority (FTA).",
          "We assist with qualifying free zone determinations, loss carryforwards, and nexus rules, ensuring accurate reporting and defensible positions.",
        ],
      },
      {
        slug: "transfer-pricing",
        title: "Transfer Pricing",
        description: [
          "Robust transfer pricing documentation is mandatory under UAE CT rules. We develop master files, local files, and country-by-country reports aligned with OECD guidelines and FTA requirements.",
          "Our benchmarking studies, functional analyses, and policy designs help substantiate arm's-length pricing, reducing adjustment risks for intra-group transactions.",
        ],
      },
      {
        slug: "value-added-tax",
        title: "Value Added Tax",
        description: [
          "VAT at 5% requires ongoing compliance. We handle registrations, returns, reconciliations, partial exemption calculations, and FTA audits.",
          "Services include reverse charge mechanisms, import VAT recovery, and group registrations, optimizing cash flow and input tax credits.",
        ],
      },
    ],
    leaders: ["arslan-mushtaq"],
    keyTeam: ["Nisarg Sheth", "Farrukh Fayyaz"],
    insightCategories: ["Tax", "Compliance"],
    webinarSlugs: [
      "uae-corporate-tax-how-to-prepare",
      "understanding-the-vat-impact",
      "transfer-pricing-in-the-gcc",
      "recap-uae-vat-law-amendments",
    ],
    testimonials: ["nasser-al-falasi", "priya-sharma", "david-lee"],
    faqs: [
      {
        question: "How do you ensure compliance with the new UAE Corporate Tax?",
        answer:
          "We stay ahead of FTA updates, providing tailored computations, registrations, and audit defense with proven 100% pass rates.",
      },
      {
        question: "What transfer pricing methods do you use for UAE businesses?",
        answer:
          "We apply OECD-aligned methods like CUP, TNMM, and profit splits, with robust benchmarking from global databases.",
      },
      {
        question: "Can you handle VAT for e-commerce or free zone entities?",
        answer:
          "Yes, including reverse charges, zero-rating, and free zone simplifications for seamless FTA compliance.",
      },
      {
        question: "How quickly can you prepare tax returns?",
        answer:
          "Standard filings within 7-10 days; urgent ones in 48 hours, with full documentation.",
      },
      {
        question: "Do you support economic substance reporting?",
        answer:
          "Absolutely, we manage ESR filings and notifications to ensure free zone benefits are preserved.",
      },
      {
        question: "Is this more cost-effective than in-house tax teams?",
        answer:
          "Yes, our on-demand model cuts overheads while delivering specialized UAE expertise on flexible terms.",
      },
    ],
  },
  {
    path: "resourcing",
    heading: "Resourcing Services",
    intro:
      "At athGADLANG, we provide flexible, expert-driven resourcing solutions that help businesses adapt, scale, and perform in a dynamic environment. Our services are designed to ensure you have the right talent, capabilities, and support, exactly when you need them.",
    introMore:
      "Whether you are managing growth, optimizing operations, or addressing skill gaps, we deliver tailored solutions that enhance efficiency and align with your strategic goals. By combining industry expertise with a practical, hands-on approach, we help you build high-performing teams without the burden of long-term overheads.",
    hero: serviceHeroImages.resourcing,
    capabilities: [
      {
        slug: "business-process-outsourcing",
        title: "Business Process Outsourcing (BPO)",
        description: [
          "Managing non-core functions internally can strain resources and impact overall efficiency. Our BPO services are designed to help you streamline operations by outsourcing routine and resource-intensive processes to experienced professionals. We support the setup and management of BPO functions tailored to your business needs, allowing you to reduce costs, improve process efficiency, and focus on core strategic priorities.",
          "Whether it's finance, administrative processes, or operational support, we ensure seamless execution with strong governance and quality control. Our approach ensures that outsourced functions operate as an extension of your business; efficient, reliable, and aligned with your performance expectations.",
        ],
      },
      {
        slug: "talent-acquisition",
        title: "Talent Acquisition",
        description: [
          "Finding the right talent is critical to long-term success. Our talent acquisition services focus on identifying, evaluating, and securing professionals who not only meet technical requirements but also align with your company's culture and vision. We take a strategic, end-to-end approach, starting from understanding your hiring needs and defining role requirements to sourcing, screening, and onboarding candidates.",
          "Our rigorous selection process ensures that you gain access to high-quality talent that adds immediate value to your organization. By leveraging our network and expertise, we help you reduce hiring timelines, improve candidate quality, and build stronger, more capable teams.",
        ],
      },
      {
        slug: "secondments",
        title: "On-site and Off-site Secondments",
        description: [
          "We provide flexible staffing solutions through on-site and off-site secondments, giving you access to skilled professionals exactly when and where you need them. Whether you require short-term project support or long-term operational assistance, our secondment services ensure that you have the right expertise in place without the challenges of permanent hiring.",
          "Our professionals integrate seamlessly into your team, contributing effectively from day one. With a strong focus on quality and adaptability, we ensure that your business remains agile and well-supported during critical periods.",
        ],
      },
      {
        slug: "c-level-support",
        title: "C-level Support Services",
        description: [
          "We empower leadership teams with specialized support designed to enhance decision-making and operational effectiveness. Our C-level support services provide access to experienced professionals who assist executives in managing complex challenges and strategic initiatives. From financial oversight and operational support to strategic planning and execution, we work closely with your leadership team to deliver practical insights and solutions.",
          "Our goal is to strengthen your executive capabilities while ensuring alignment with your business objectives. By acting as a trusted advisory partner, we help your leadership team focus on driving growth and delivering results.",
        ],
      },
      {
        slug: "remote-work-solutions",
        title: "Remote Work Solutions",
        description: [
          "As businesses increasingly adopt flexible working models, having the right infrastructure and support is essential. Our remote work solutions are designed to enable seamless operations while maintaining productivity, collaboration, and data security. We assist in setting up the necessary tools, systems, and workflows required for effective remote operations, such as configuring platforms for communication and performance tracking.",
          "Beyond setup, we provide ongoing support to optimize remote work environments and address any operational challenges. Our goal is to help your teams remain connected, efficient, and aligned, regardless of location, while ensuring business continuity and performance.",
        ],
      },
      {
        slug: "recruitment-process-outsourcing",
        title: "Recruitment Process Outsourcing (RPO)",
        description: [
          "Our Recruitment Process Outsourcing (RPO) service allows you to delegate the entire hiring lifecycle to a dedicated team of experts. From defining job requirements and sourcing candidates to screening, selection, and onboarding, we manage every stage of the recruitment process with precision and consistency. We work closely with your internal stakeholders to understand your hiring needs, company culture, and long-term workforce strategy.",
          "Through our recruitment processes and data-driven strategies, we help reduce internal workload and ensure consistent candidate quality. With athGADLANG, you can focus on scaling your business while we ensure you have the right people in place to support your growth.",
        ],
      },
      {
        slug: "end-to-end-outsourcing",
        title: "End-to-end Outsourcing",
        description: [
          "Our end-to-end outsourcing solutions are designed to help businesses scale efficiently by managing critical operational functions under one integrated framework. We provide support across HR, staffing, payroll, and administrative processes, ensuring smooth and compliant operations. Acting as an extension of your organization, we integrate into your existing structure, taking ownership of routine and resource-intensive activities.",
          "From HR administration and payroll management to visa processing, PRO services, and back-office operations, we ensure that every function is handled with accuracy and efficiency. This approach not only reduces operational burden but also improves consistency, compliance, and overall performance.",
        ],
      },
    ],
    stats: {
      title: "Built For Scalable Workforce Support",
      description: "Supporting your growth through agile workforce solutions.",
      items: [
        { value: "2K+", label: "Recruited & Outsourced" },
        { value: "150+", label: "Clients" },
        { value: "5+", label: "Locations" },
        { value: "10+", label: "Years" },
      ],
    },
    leaders: ["osman-babar", "sikandar-gadit"],
    keyTeam: ["Ammar Hussain", "Hira Sikander", "Laiba"],
    insightCategories: ["Advisory", "Accounting", "Compliance"],
    testimonials: [
      "omar-al-hammadi",
      "ayesha-siddiqui",
      "james-walker",
      "khalid-al-mansoori",
    ],
    faqs: [
      {
        question:
          "How quickly can you deploy resources for urgent requirements?",
        answer:
          "For common roles, we can deploy pre-vetted candidates within days. For specialized roles, timelines depend on complexity, but we prioritize speed without compromising on quality.",
      },
      {
        question: "How do you ensure candidates are the right fit for our business?",
        answer:
          "We go beyond CV screening by assessing technical skills, industry experience, and cultural alignment. Our process includes structured evaluations and close collaboration with your team before final selection.",
      },
      {
        question:
          "Can your resources work within our existing systems and processes?",
        answer:
          "Yes. Our professionals are trained to integrate quickly into your workflows, tools, and reporting structures, ensuring minimal disruption and immediate productivity.",
      },
      {
        question: "What level of control do we have over outsourced functions?",
        answer:
          "You retain full visibility and control. We operate with defined SLAs, reporting structures, and regular performance reviews to ensure alignment with your expectations.",
      },
      {
        question:
          "How do you handle compliance, especially in areas like payroll and visas?",
        answer:
          "We stay aligned with UAE and global labor laws and regulatory requirements, managing payroll, WPS, visa processing, and PRO services to ensure full compliance and reduce your risk exposure according to your location.",
      },
      {
        question:
          "Is outsourcing cost-effective compared to building an in-house team?",
        answer:
          "In most cases, yes. Outsourcing reduces overhead costs related to hiring, training, infrastructure, and compliance while giving you access to experienced professionals on demand.",
      },
    ],
  },
  {
    path: "consulting",
    heading: "Consulting Services",
    intro:
      "At athGADLANG, we help businesses navigate complexity, unlock opportunities, and achieve sustainable growth. Our consulting services combine deep industry expertise with practical insights to support better decision-making across all areas of your organization.",
    introMore:
      "From strategy and transactions to risk and transformation, we work closely with you to solve challenges, improve performance, and build resilient, future-ready businesses. By integrating financial, operational, and technological expertise, we deliver solutions that are not only strategic but also actionable and results-driven.",
    capabilities: [
      {
        slug: "business-advisory",
        title: "Business Advisory",
        description: [
          "We work closely with leadership teams to shape forward-looking strategies that drive sustainable growth. Our business advisory services cover everything from business strategy development and operational excellence to large-scale business initiatives and performance improvement programs. We provide practical guidance that helps you lead market positioning, optimize internal processes, and respond to changing economic conditions.",
          "Our focus is not just on strategy design, but on execution, ensuring measurable improvements across your organization. We bring a hands-on, collaborative approach, working alongside your team to turn strategic objectives into tangible outcomes that deliver long-term value.",
        ],
        items: [
          "Business Strategy Development",
          "Intelligent Operating Module / Operational Excellence",
          "Business Transformation",
          "Performance Improvement",
        ],
      },
      {
        slug: "forensic-investigations",
        title: "Forensic Investigations",
        description: [
          "Our forensic specialists help organizations detect, investigate, and prevent financial misconduct. Through detailed fact-finding exercises, fraud risk assessments, and forensic investigations, we uncover critical insights that support informed action. We also assist businesses in strengthening compliance frameworks, including anti-money laundering (AML) measures, ensuring your organization is protected against financial and reputational risks.",
          "Our approach is discreet, thorough, and focused on delivering clear, defensible outcomes. We work with sensitivity and precision, ensuring that findings are not only accurate but also actionable for legal, regulatory, and internal purposes.",
        ],
        items: [
          "Fact Finding",
          "Fraud Risk Assessment",
          "Forensic Investigations",
          "Anti Money Laundering (AML)",
        ],
      },
      {
        slug: "transaction-advisory",
        title: "Transaction Advisory",
        description: [
          "We support businesses through critical transactions with a structured, insight-driven approach. From valuation and financial modelling to feasibility studies, market research, and business plan development, we provide the clarity needed to make high-stakes decisions. Our team also assists with IPO readiness and transaction structuring, ensuring that every stage, from initial assessment to execution, is handled with precision.",
          "Whether you are acquiring, divesting, or expanding, we help you maximize value while mitigating risks. By combining financial rigor with commercial insight, we ensure that every transaction aligns with your strategic goals and delivers sustainable returns.",
        ],
        items: [
          "Valuation & Financial Modelling",
          "Feasibility Study / Market Research",
          "Real Estate Highest and Best Use (HBU)",
          "Business Plan",
          "IPO Readiness",
        ],
      },
      {
        slug: "risk-advisory",
        title: "Risk Advisory",
        description: [
          "We help organizations build strong risk management frameworks that go beyond compliance and support long-term resilience. Our services include internal audits, enterprise risk management (ERM), ESG advisory, procurement reviews, and business continuity planning, all designed to strengthen your control environment. In addition, we support corporate governance structures, policy formulation, and regulatory compliance.",
          "Our goal is to identify vulnerabilities early and implement practical controls that safeguard your operations. By embedding risk awareness into your processes, we help create a proactive culture that enhances decision-making and organizational stability.",
        ],
        items: [
          "Internal Audits",
          "Enterprise Risk Management (ERM)",
          "Environmental Social Governance (ESG)",
          "Procurement Review",
          "Business Continuity Planning",
          "Corporate Governance",
          "Policy and Procedure Formulation",
          "Regulatory Compliance",
        ],
      },
      {
        slug: "financial-accounting-advisory",
        title: "Financial Accounting & Advisory (FAAS)",
        description: [
          "Our FAAS services are designed to help finance functions meet increasing regulatory demands while improving efficiency and transparency. We provide IFRS consultations, finance transformation, and actuarial valuation services, ensuring your financial reporting remains accurate, compliant, and aligned with global standards to help improve stakeholder confidence and long-term decision-making.",
          "We work closely with CFOs and finance teams to address complex accounting challenges, implement new standards, and enhance reporting frameworks. Our support extends beyond compliance — we focus on optimizing financial processes, improving reporting timelines, and strengthening internal capabilities.",
        ],
        items: [
          "IFRS Consultations",
          "Actuarial Valuations",
          "Finance Transformation",
        ],
      },
      {
        slug: "corporate-finance",
        title: "Corporate Finance",
        description: [
          "We help businesses make informed financial decisions that drive growth and long-term value creation. Our expertise spans mergers and acquisitions, buy-side and sell-side advisory, as well as debt and equity financing, ensuring you have the right structure and strategy in place. From evaluating opportunities to executing transactions, we provide hands-on support that aligns financial strategy with your broader business objectives.",
          "We take a holistic approach to corporate finance, considering both financial and strategic factors to ensure optimal outcomes. Whether you are scaling operations, entering new markets, or restructuring capital, we provide the expertise needed to move forward with confidence.",
        ],
        items: [
          "Buy-Side Advisory",
          "Debt Financing",
          "Mergers & Acquisition",
          "Sell-Side Advisory",
          "Equity Financing",
        ],
      },
      {
        slug: "corporate-services",
        title: "Corporate Services",
        description: [
          "We simplify the operational and regulatory complexities of running a business, allowing you to focus on growth. Our corporate services include company formation, structuring, PRO services, and liquidation support, ensuring compliance at every stage of your business lifecycle. We guide you through the entire setup process, from selecting the right legal structure to managing documentation and regulatory approvals.",
          "Our team ensures that all compliance requirements are met accurately and on time, reducing administrative burden and minimizing risk. With our support, you gain a reliable partner to manage your corporate obligations seamlessly.",
        ],
        items: [
          "Company Formation",
          "Liquidation",
          "PRO Services",
          "Company Structuring",
        ],
      },
      {
        slug: "technology-advisory",
        title: "Technology Advisory",
        description: [
          "We help organizations leverage technology to drive efficiency, innovation, and competitive advantage. Our services include digital transformation, ERP implementation, cybersecurity, and data protection, ensuring your technology landscape supports your business objectives. We begin by understanding your strategic goals and current systems, identifying gaps and opportunities for improvement.",
          "By bridging the gap between business and technology, we ensure that your investments deliver measurable value. Our approach focuses on scalability, security, and long-term sustainability, enabling your organization to thrive in an increasingly digital environment.",
        ],
        items: [
          "Digital Transformation",
          "Cyber Security",
          "ERP Implementation",
          "Data Protection",
        ],
      },
      {
        slug: "learning-development",
        title: "Learning & Development",
        description: [
          "We empower organizations by developing the skills and capabilities needed to succeed in a rapidly changing business environment. Our services include IFRS training, leadership development programs, and soft skills training, all tailored to your specific organizational needs. We design and deliver practical, engaging training programs that enhance both technical expertise and leadership capabilities.",
          "By fostering a culture of continuous learning and development, we help your organization build stronger teams, improve performance, and adapt effectively to new challenges and opportunities. Our focus is on creating lasting impact, ensuring your teams can apply what they learn directly to their roles.",
        ],
        items: ["IFRS Training", "Leadership Training", "Soft Skills Training"],
      },
    ],
    stats: {
      title: "Trusted By Numbers And Chosen For Results",
      description: "Delivering impact that can be counted.",
      items: [
        { value: "2000+", label: "Projects" },
        { value: "30+", label: "Consultants" },
        { value: "1000+", label: "Clients" },
      ],
    },
    leaders: ["haziq-neshat-akhtar", "saqib-nisar"],
    keyTeam: ["Khushboo Mushtaq", "Sneha Mehta", "Masood Ahmed"],
    insightCategories: ["Advisory", "Tax", "Compliance"],
    testimonials: [
      "abdullah-al-shamsi",
      "priya-nair",
      "daniel-thompson",
      "omar-al-mansoori",
    ],
    faqs: [
      {
        question: "How is your consulting approach different from traditional firms?",
        answer:
          "We focus on execution, not just recommendations. Our team works closely with you to implement solutions and deliver measurable outcomes, rather than leaving you with static reports.",
      },
      {
        question: "Can you support multiple areas of our business simultaneously?",
        answer:
          "Yes. Our integrated approach allows us to support strategy, finance, risk, and technology together, ensuring alignment across all business functions.",
      },
      {
        question: "At what stage should we engage consulting services?",
        answer:
          "The earlier, the better. Whether you are planning expansion, facing operational challenges, or preparing for a transaction, early involvement helps us create more effective and cost-efficient solutions.",
      },
      {
        question: "Do you work with internal teams or operate independently?",
        answer:
          "We collaborate closely with your internal teams, acting as an extension of your organization to ensure smooth implementation and knowledge transfer.",
      },
      {
        question: "How do you ensure your recommendations are practical?",
        answer:
          "Our solutions are grounded in real-world experience across industries. We focus on feasibility, scalability, and measurable impact, ensuring recommendations can be realistically implemented.",
      },
    ],
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

/**
 * The pages that name this leader, for the rail on their profile. Derived from
 * the same `leaders` lists the service pages render, so the two cannot drift.
 */
export function servicesLedBy(leaderSlug: string) {
  return serviceContent
    .filter((content) => content.leaders?.includes(leaderSlug))
    .map((content) => ({
      label: content.heading,
      href: `/services/${content.path}`,
    }));
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
