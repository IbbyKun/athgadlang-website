import { leaderImages } from "@/lib/images";

/**
 * Facts drawn from a leader's own biography — nothing inferred. Shown as an
 * at-a-glance panel on the profile page; every field is optional, and a field
 * left out simply does not appear.
 */
export type LeaderProfile = {
  /** Post-qualification or firm experience, as the biography states it. */
  experience?: string;
  qualifications?: string[];
  /** Firms held before or alongside athGADLANG. */
  firms?: string[];
  /** What they are brought in for. */
  focus?: string[];
  /** Sectors named in the biography. */
  industries?: string[];
  /** Markets worked, where the biography names them. */
  regions?: string[];
};

export type Leader = {
  slug: keyof typeof leaderImages;
  name: string;
  role: string;
  /** Profile URL on LinkedIn. "#" until the real profiles are supplied. */
  linkedin?: string;
  image: { src: string; alt: string };
  /** Biography, one string per paragraph. The first is used as the lead. */
  bio?: string[];
  profile?: LeaderProfile;
};

/**
 * The leadership team.
 *
 * Biographies and roles are reproduced as supplied from the leadership pages.
 * The photographs are still stock placeholders — every one must be replaced
 * with the leader's real portrait before this goes anywhere public.
 */
export const leaders: Leader[] = [
  {
    slug: "arshad-gadit",
    name: "Arshad Gadit",
    role: "Partner & Global CEO",
    linkedin:
      "https://www.linkedin.com/in/arshadgadit/",
    image: leaderImages["arshad-gadit"],
    bio: [
      "Arshad is our Global CEO, Head of Public Relations & Partner. He has over 2 decades of firm experience in Europe, South East Asia and Middle East. Prior to joining athGADLANG, Arshad has led the audit practice at BDO Bahrain as an Assurance and Business Advisory Partner.",
      "He has also been part of various Technical Committees and elected Technical Partner for Qatar, Oman and Bahrain Offices. He was associated Deloitte LLP UK and worked in the Banking Capital Market division of the firm.",
      "He is a highly motivated business leader with proven track record, technically astute, with the ability to grow the business and possesses sound financial services industry knowledge.",
    ],
    profile: {
      experience: "Over 2 decades",
      firms: ["BDO Bahrain", "Deloitte LLP UK"],
      focus: ["Assurance", "Business advisory", "Public relations"],
      regions: ["Europe", "South East Asia", "Middle East"],
    },
  },
  {
    slug: "usman-alam",
    name: "Usman Alam",
    role: "Partner — Assurance & Compliance",
    linkedin:
      "https://www.linkedin.com/in/usman-alam-a3434a30/",
    image: leaderImages["usman-alam"],
    // An earlier version of this biography said "over 19 years" and described
    // Usman as a founding partner of athGADLANG Group. This is the leadership
    // page text, which says 17 years. Confirm which figure is current.
    bio: [
      "Usman is a seasoned professional who has spent over 17 years serving clients across various industries with Assurance, Financial Planning, Business Advisory, Financial Reporting, and Compliance services. He has worked with some of the top firms in the industry, including PWC and KPMG, and is a Fellow Chartered Accountant from the Institute of Chartered Accountants of England and Wales (ICAEW).",
      "Throughout his career, Usman has successfully led numerous engagements for both listed and unlisted companies, with turnovers ranging from USD $50 million to USD $10 billion.",
    ],
    profile: {
      experience: "Over 17 years",
      qualifications: ["Fellow Chartered Accountant — ICAEW"],
      firms: ["PwC", "KPMG"],
      focus: [
        "Assurance",
        "Financial reporting",
        "Compliance",
        "Business advisory",
      ],
    },
  },
  {
    slug: "yasir-gadit",
    name: "Yasir Gadit",
    role: "Partner — Consulting",
    linkedin:
      "https://www.linkedin.com/in/yasirgadit/",
    image: leaderImages["yasir-gadit"],
    bio: [
      "Yasir is our leader for the Consulting division. He is a Fellow Chartered Accountant from the Institute of Chartered Accountants of Pakistan (ICAP). With more than 19 years of experience, Yasir is passionate adding value to our clients, and is a huge cricket enthusiast.",
      "Yasir brings Big 4 experience of the GCC region. He worked with Ernst & Young in UAE, Qatar and Kuwait, where he advised various clients in diversified sectors such as financial institutions, manufacturing, service, construction companies, and many more.",
      "Yasir has also led the Institute of Chartered Accountants of Pakistan's UAE Chapter, as well as various business councils in the UAE.",
    ],
    profile: {
      experience: "More than 19 years",
      qualifications: ["Fellow Chartered Accountant — ICAP"],
      firms: ["Ernst & Young"],
      focus: ["Consulting", "Advisory"],
      industries: [
        "Financial institutions",
        "Manufacturing",
        "Services",
        "Construction",
      ],
      regions: ["UAE", "Qatar", "Kuwait"],
    },
  },
  {
    slug: "abdullah-taimoor",
    name: "Abdullah Taimoor",
    role: "Partner — Fixed Asset & Inventory Management",
    linkedin:
      "https://www.linkedin.com/in/abdullahtaimoor/",
    image: leaderImages["abdullah-taimoor"],
    bio: [
      "Abdullah Taimoor is a distinguished finance professional with over 18 years of experience, including a tenure as an external auditor at PwC, where he audited leading banks, funds, and insurance companies. He holds an MBA in Finance and is a certified ACCA, bringing deep expertise in auditing, financial reporting, and operational risk management.",
      "As a Partner at athGADLANG, Abdullah specializes in developing and implementing comprehensive fixed asset management strategies and inventory control frameworks. His expertise extends to regulatory compliance, risk mitigation, and aligning financial reporting practices with IFRS and ISAs. He is known for his ability to enhance operational efficiencies, strengthen financial transparency, and ensure the highest standards of accuracy in reporting.",
      "With a proven track record of managing complex engagements across industries, Abdullah combines technical excellence with a forward-thinking approach. He leverages advanced methodologies and technology-driven solutions to minimize risks, optimize processes, and deliver sustainable results for clients.",
      "Abdullah's leadership and dedication to precision make him an invaluable partner for organizations seeking reliability, integrity, and excellence in fixed asset and inventory management.",
    ],
    profile: {
      experience: "Over 18 years",
      qualifications: ["ACCA", "MBA in Finance"],
      firms: ["PwC"],
      focus: [
        "Fixed asset management",
        "Inventory control",
        "Financial reporting",
        "Operational risk",
      ],
    },
  },
  {
    slug: "arslan-mushtaq",
    name: "Arslan Mushtaq",
    role: "Partner — Tax",
    linkedin:
      "https://www.linkedin.com/in/arslan-mushtaq-73222311/",
    image: leaderImages["arslan-mushtaq"],
    bio: [
      "Arslan leads the team at our Tax division. His experience spans over 19 years of post qualification tenure in VAT, Audit Assurance and Internal Audit working at PwC, KPMG and FRHI in the UK and UAE.",
      "A pro-networker and badminton player, Arslan has served a large number of companies and groups of all sizes, ranging from multinational companies to family-owned businesses.",
      "He has acquired both firm and industry experience and served a number clients in Financial Services, Media, F&B, Hospitality, Manufacturing, Real estate and construction sectors.",
      "Clients reach out to Arslan to seek his expertise in UK & GCC Tax, Excise and Customs Duty, Zakat, as well as financial planning, budgeting, contract reviews, financial reporting, development of policies procedures.",
    ],
    profile: {
      experience: "Over 19 years post-qualification",
      firms: ["PwC", "KPMG", "FRHI"],
      focus: [
        "UK & GCC tax",
        "VAT",
        "Excise and customs duty",
        "Zakat",
        "Internal audit",
      ],
      industries: [
        "Financial services",
        "Media",
        "F&B",
        "Hospitality",
        "Manufacturing",
        "Real estate",
        "Construction",
      ],
      regions: ["UK", "UAE"],
    },
  },
  {
    slug: "abdul-aziz-lang",
    name: "Abdul Aziz Lang",
    role: "Partner — Strategy",
    linkedin:
      "https://www.linkedin.com/in/abdul-aziz-lang-9814aa23/",
    image: leaderImages["abdul-aziz-lang"],
    bio: [
      "Abdul Aziz Lang is one of the most senior partners of the firm, with more than three decades of experience in Consulting, Corporate Finance, and Strategy. Abdul Aziz is a fellow member of the Institute of Chartered Accountants of Pakistan, Institute of Cost and Management Accountants, Institute of Corporate Secretaries, and a Certified Strategic Management Master.",
      "He is an alumnus of Ernst & Young and has worked in leadership roles in top global companies such as Sabre, and Gulf Air. Abdul Aziz is an expert in the Manufacturing, Technology, and Airline industries and also has extensive experience in business turnaround, transforming loss-making businesses, implementing process improvements, and leading organization-wide transformation projects.",
    ],
    profile: {
      experience: "More than three decades",
      qualifications: [
        "Fellow — Institute of Chartered Accountants of Pakistan",
        "Fellow — Institute of Cost and Management Accountants",
        "Fellow — Institute of Corporate Secretaries",
        "Certified Strategic Management Master",
      ],
      firms: ["Ernst & Young", "Sabre", "Gulf Air"],
      focus: [
        "Strategy",
        "Corporate finance",
        "Business turnaround",
        "Organisation-wide transformation",
      ],
      industries: ["Manufacturing", "Technology", "Airlines"],
    },
  },
  {
    slug: "saqib-nisar",
    name: "Saqib Nisar",
    role: "Managing Partner",
    linkedin:
      "https://www.linkedin.com/in/forensics-consultant/",
    image: leaderImages["saqib-nisar"],
    bio: [
      "Saqib Nisar has over 25 years of experience in the field of investigations, contract reviews, financial crime, AML and sanctions assessments, audit, accounting, forensics, and related services. He has worked in a range of industries, including construction, logistics, trading and contracting services, and oil & gas sectors.",
      "Saqib has worked across multiple jurisdictions, including the Middle East and Gulf region, Western and Central Europe, and Africa. His extensive experience and knowledge of various sectors and regions allow him to provide comprehensive and practical solutions to clients seeking support in financial and related services.",
      "Saqib's wealth of knowledge and experience in financial and related services, along with his ability to understand the intricacies of different industries and regions, make him a trusted advisor to each client's unique needs.",
    ],
    profile: {
      experience: "Over 25 years",
      focus: [
        "Investigations",
        "Financial crime",
        "AML and sanctions",
        "Forensics",
        "Contract reviews",
      ],
      industries: [
        "Construction",
        "Logistics",
        "Trading and contracting",
        "Oil & gas",
      ],
      regions: [
        "Middle East and Gulf",
        "Western and Central Europe",
        "Africa",
      ],
    },
  },
  {
    slug: "haziq-neshat-akhtar",
    name: "Haziq Neshat Akhtar",
    role: "Partner — Risk, Financial Crimes & Transaction Advisory",
    linkedin:
      "https://www.linkedin.com/in/haziq-neshat-akhtar-a1419121/",
    image: leaderImages["haziq-neshat-akhtar"],
    bio: [
      "Haziq Neshat Akhtar leads the Advisory division at athGADLANG & WATHIQ. With over 16 years of experience, he specializes in risk management, forensic audits, corporate advisory, and financial consulting.",
      "Haziq is a Fellow member of The Institute of Financial Accountants UK and The Institute of Public Accountants Australia, he also holds a Fellowship with The Institute of Forensic Accountants of Pakistan and is associated with the Association of Chartered Certified Accountants. He further holds specialized qualifications in IT audits, Shariah Audit and Anti-money laundering. He has held key leadership roles in leading firms, including Forvis Mazars, BDO, Grant Thornton, British Petroleum Pakistan, Gerry's International, and SJG Pharma Group.",
      "An entrepreneur at heart, Haziq has delivered impactful projects in internal audits, process re-engineering, ERM, Strategy and research, ESG, Cyber security, valuations, M&A, Buy & Sell Side advisory and feasibility studies across diverse industries. He is passionate about driving ethical and sustainable business practices while delivering measurable value to clients.",
    ],
    profile: {
      experience: "Over 16 years",
      qualifications: [
        "Fellow — Institute of Financial Accountants UK",
        "Fellow — Institute of Public Accountants Australia",
        "Fellow — Institute of Forensic Accountants of Pakistan",
        "ACCA affiliated",
      ],
      firms: [
        "Forvis Mazars",
        "BDO",
        "Grant Thornton",
        "British Petroleum Pakistan",
      ],
      focus: [
        "Risk management",
        "Forensic audits",
        "Transaction advisory",
        "ESG",
        "Cyber security",
      ],
    },
  },
  {
    slug: "osman-babar",
    name: "Osman Babar",
    role: "Partner — BPO Services",
    linkedin:
      "https://www.linkedin.com/in/muhammadosmanbabar/",
    image: leaderImages["osman-babar"],
    bio: [
      "Osman is our Partner of Business Process Outsourcing (BPO) Services and a fellow member of the Institute of Chartered Accountants of Pakistan. He is a determined, highly motivated, and skilled professional with more than 22 years of experience.",
      "An accomplished professional with proven success in establishing performance management, best practices, enhancing business performance through timely and relevant financial planning and management, robust control structures, and financial reporting protocols in alignment with business goals and KPIs.",
      "He has also served as a leader in providing assurance services in five service streams for world-class organizations, including Statutory and Internal Audits, Management Assurance, and Financial Accounting & Advisory Services.",
    ],
    profile: {
      experience: "More than 22 years",
      qualifications: ["Fellow Chartered Accountant — ICAP"],
      focus: [
        "Business process outsourcing",
        "Performance management",
        "Statutory and internal audit",
        "Financial accounting advisory",
      ],
    },
  },
  {
    slug: "sikandar-gadit",
    // The resourcing page supplied his card headed "Sikandar Gadit" but the
    // biography names him "Sikander Abdul Rehman Gadit", and labelled the role
    // "Partner - Consulting" while the biography says COO. The heading spelling
    // and the biography's role are used here — confirm both.
    name: "Sikandar Gadit",
    role: "Partner & Chief Operating Officer",
    linkedin:
      "https://www.linkedin.com/in/sikandergadit/",
    image: leaderImages["sikandar-gadit"],
    bio: [
      "Sikander Abdul Rehman Gadit is the COO at athGADLANG & WATHIQ, with over 25 years of international experience across the UAE, KSA, Bahrain, and Pakistan. He specializes in business operations, growth strategy, and market expansion, helping organizations build scalable and efficient operating models.",
      "He holds professional affiliations and certifications in business and leadership, complementing his extensive industry experience. Known for his client-centric and collaborative leadership style, Sikander focuses on strengthening relationships and developing high-performing teams.",
      "He has successfully led cross-border engagements, enabling businesses to enter new markets and scale operations effectively. His ability to align strategy with execution makes him a trusted partner for organizations navigating growth and transformation.",
    ],
    profile: {
      experience: "Over 25 years",
      focus: [
        "Business operations",
        "Growth strategy",
        "Market expansion",
        "Operating models",
      ],
      regions: ["UAE", "KSA", "Bahrain", "Pakistan"],
    },
  },
  {
    slug: "khushboo-mushtaq",
    name: "Khushboo Mushtaq",
    role: "Director — Financial Accounting & Advisory Services (FAAS)",
    linkedin:
      "https://www.linkedin.com/in/khushboo-mushtaq-aca-17b5a057/",
    image: leaderImages["khushboo-mushtaq"],
    bio: [
      "A Chartered Accountant from Institute of Chartered Accountants of Pakistan. Khushboo's experience spans across a spectrum of verticals in more than one country and has a strong grip on IFRS.",
      "Her experience exceeds over 11 years and she is an alumni with top Big 4 firms such as EY and BDO. Khushboo has proved her mettle with hands on experience in handling the diversified portfolio of clients and delivered high impact assignments related Financial & Business Valuation, Advisory and Accounting.",
      "Khushboo is currently in various leadership roles including committee of ICAP – UAE and role model for South Asian women in accounting & finance.",
    ],
    profile: {
      experience: "Over 11 years",
      qualifications: ["Chartered Accountant — ICAP"],
      firms: ["EY", "BDO"],
      focus: [
        "Financial and business valuation",
        "Advisory",
        "Accounting",
        "IFRS",
      ],
    },
  },
];

export function leaderHref(leader: Leader) {
  return `/about/leadership/${leader.slug}`;
}

/** Every leader slug, for `generateStaticParams`. */
export const leaderSlugs = leaders.map((leader) => leader.slug);

/** The leader for a URL segment, or undefined so the route can 404. */
export function getLeader(slug: string) {
  return leaders.find((leader) => leader.slug === slug);
}

/** Looked up by slug, so pages can name the leaders they want. */
export function getLeaders(slugs: string[]) {
  return slugs
    .map((slug) => leaders.find((leader) => leader.slug === slug))
    .filter((leader): leader is Leader => Boolean(leader));
}

/** The rest of the team, for the rail at the foot of a profile. */
export function otherLeaders(leader: Leader, limit = 4) {
  return leaders.filter((item) => item.slug !== leader.slug).slice(0, limit);
}
