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
      "Arshad Gadit is Global CEO, Head of Public Relations & Partner at athGADLANG, bringing over 27 years of assurance, tax, and business advisory experience across Europe, South East Asia, and the Middle East, including senior roles at Ernst & Young, Deloitte UK, and BDO.",
      "Before joining athGADLANG, Arshad was a Partner leading the Audit, Business & Assurance practice at BDO Bahrain, Oman, and Qatar, directing a team of 50+ professionals across the GCC. He has created over USD 200 million in value for clients, helped businesses grow revenues by 150%+, and guided numerous organizations into new international markets.",
      "At athGADLANG, he leads global operations, expanding the firm's footprint, service lines, and government relationships, while also serving as CEO of Wathiq in Riyadh. He is a Fellow Chartered Accountant (FCA), ACCA member, and a recognized voice on VAT and business advisory across the GCC.",
    ],
    profile: {
      experience: "Over 27 years",
      qualifications: ["Fellow Chartered Accountant (FCA)", "ACCA member"],
      firms: ["Ernst & Young", "Deloitte UK", "BDO"],
      focus: ["Assurance", "Tax", "Business advisory", "Public relations"],
      regions: ["Europe", "South East Asia", "Middle East"],
    },
  },
  {
    slug: "usman-alam",
    name: "Usman Alam",
    role: "Partner, Assurance & Compliance",
    linkedin:
      "https://www.linkedin.com/in/usman-alam-a3434a30/",
    image: leaderImages["usman-alam"],
    // The 17-versus-19 years question noted here previously is settled: this
    // copy says 19, and founding partner, which is what the earlier version
    // said too.
    bio: [
      "Usman Alam is a Founding Partner at athGADLANG, leading the firm's Assurance & Compliance Services division, with over 19 years of experience in audit, assurance, and compliance, including leadership roles at PwC and KPMG.",
      "Before joining athGADLANG, Usman spent seven years at PwC in the UAE as a Manager, and began his career at KPMG. He also led finance operations in the FMCG sector as Finance Manager at Gulf Marketing Group in Dubai.",
      "At athGADLANG, he helps businesses navigate IFRS, regulatory frameworks, and complex compliance matters, optimizing financial reporting systems and delivering strategic advisory for high-profile clients across diverse industries. He is a Fellow Chartered Accountant (ICAEW) and a regular contributor to industry discussions on IFRS trends through publications, webinars, and speaking engagements.",
    ],
    profile: {
      experience: "Over 19 years",
      qualifications: ["Fellow Chartered Accountant, ICAEW"],
      firms: ["PwC", "KPMG", "Gulf Marketing Group"],
      focus: [
        "Assurance",
        "Compliance",
        "IFRS",
        "Financial reporting",
      ],
    },
  },
  {
    slug: "yasir-gadit",
    name: "Yasir Gadit",
    role: "Partner, Consulting",
    linkedin:
      "https://www.linkedin.com/in/yasirgadit/",
    image: leaderImages["yasir-gadit"],
    bio: [
      "Yasir Gadit, FCA is Partner, Consulting at athGADLANG, leading a team of over 140 professionals, with more than 19 years of experience spanning audit, taxation, financial reporting, and management consulting, including a tenure at Ernst & Young Dubai.",
      "Before joining athGADLANG, Yasir spent over seven years at Ernst & Young progressing from Audit Supervisor to Audit Senior, and later served as Manager and Senior Manager at Beaufort Associates, a multidisciplinary business consultancy in Dubai. He also briefly advised Engro Corp as a Financial Consultant.",
      "At athGADLANG, he drives the firm's business advisory and management consulting offering, and also serves as Regional Partner for Financial Accounting & Advisory Services at Wathiq in Riyadh. He is a Fellow Chartered Accountant and Council Member of the Institute of Chartered Accountants of Pakistan (ICAP), and a passionate cricket enthusiast.",
    ],
    profile: {
      experience: "More than 19 years",
      qualifications: [
        "Fellow Chartered Accountant",
        "Council Member, ICAP",
      ],
      firms: ["Ernst & Young", "Beaufort Associates", "Engro Corp"],
      focus: [
        "Management consulting",
        "Business advisory",
        "Financial reporting",
        "Taxation",
      ],
      regions: ["UAE", "Saudi Arabia"],
    },
  },
  {
    slug: "abdullah-taimoor",
    name: "Abdullah Taimoor",
    role: "Partner, Fixed Asset & Inventory Management",
    linkedin:
      "https://www.linkedin.com/in/abdullahtaimoor/",
    image: leaderImages["abdullah-taimoor"],
    bio: [
      "Abdullah Taimoor is a Partner at athGADLANG, bringing over 18 years of GCC experience in auditing banks, funds, and insurance companies, including a tenure at PwC where he specialized in audits of Islamic and conventional financial institutions.",
      "Before joining athGADLANG, Abdullah spent nearly four years at PwC as an Experienced Audit Associate, working on statutory audits and risk advisory engagements for major banks and insurers, including JPMorgan Chase, BNP Paribas, and AXA Insurance. He also serves as CFO of Earthlink UAE and as a Partner at Wathiq in Riyadh.",
      "At athGADLANG, he drives the firm's business forward, ensuring exceptional client service in alignment with IFRS and ISAs. He holds an MBA in Finance and is a Fellow Member of ACCA, with a strong track record applying AI and technology to business strategy.",
    ],
    profile: {
      experience: "Over 18 years",
      qualifications: ["Fellow Member, ACCA", "MBA in Finance"],
      firms: ["PwC", "Earthlink UAE", "Wathiq"],
      focus: [
        "Audit",
        "IFRS and ISAs",
        "Risk advisory",
        "Business strategy",
      ],
      industries: ["Banking", "Funds", "Insurance"],
      regions: ["GCC"],
    },
  },
  {
    slug: "arslan-mushtaq",
    name: "Arslan Mushtaq",
    role: "Partner, Tax",
    linkedin:
      "https://www.linkedin.com/in/arslan-mushtaq-73222311/",
    image: leaderImages["arslan-mushtaq"],
    bio: [
      "Arslan Mushtaq is Partner, Tax at athGADLANG, bringing over 23 years of international experience in direct and indirect taxation, including leadership roles at PwC and KPMG UK.",
      "Before joining athGADLANG, Arslan spent nearly nine years at PwC across the UAE, progressing from Assurance Executive to Audit Senior Manager, and began his career at KPMG UK. He also served as Director Audit Services at FRHI Hotels & Resorts (now part of AccorHotels).",
      "At athGADLANG, he advises multinational corporations, family-owned businesses, and clients across financial services, hospitality, real estate, and manufacturing on tax planning, compliance, and risk management. He also serves as Partner at Wathiq, and is a Fellow Chartered Certified Accountant (FCCA).",
    ],
    profile: {
      experience: "Over 23 years",
      qualifications: ["Fellow Chartered Certified Accountant (FCCA)"],
      firms: ["PwC", "KPMG UK", "FRHI Hotels & Resorts"],
      focus: [
        "Direct and indirect tax",
        "Tax planning",
        "Compliance",
        "Risk management",
      ],
      industries: [
        "Financial services",
        "Hospitality",
        "Real estate",
        "Manufacturing",
      ],
      regions: ["UK", "UAE"],
    },
  },
  {
    slug: "abdul-aziz-lang",
    name: "Abdul Aziz Lang",
    role: "Partner, Strategy",
    linkedin:
      "https://www.linkedin.com/in/abdul-aziz-lang-9814aa23/",
    image: leaderImages["abdul-aziz-lang"],
    bio: [
      "Abdul Aziz Lang is Chairman of athGADLANG Management Consultants, bringing over 36 years of experience in strategy, corporate finance, and executive leadership, including a tenure early in his career at EY.",
      "Before joining athGADLANG, Abdul Aziz held senior finance and CEO roles across the Middle East, including Director of Strategic Planning and CEO for Sabre Travel Network in Bahrain and Egypt, Regional Manager Finance at Gulf Air, and CFO & Company Secretary at Zagro. He began his career as an Audit Senior at EY.",
      "At athGADLANG, he provides strategic oversight across the firm's operations, and also serves as Founding Partner of Gadlang UK Management Consultants. He is a Fellow Chartered Accountant, Fellow Cost and Management Accountant, and Fellow Corporate Secretary, and is a published author and strategist.",
    ],
    profile: {
      experience: "Over 36 years",
      qualifications: [
        "Fellow Chartered Accountant",
        "Fellow Cost and Management Accountant",
        "Fellow Corporate Secretary",
      ],
      firms: [
        "Ernst & Young",
        "Sabre Travel Network",
        "Gulf Air",
        "Zagro",
      ],
      focus: [
        "Strategy",
        "Corporate finance",
        "Executive leadership",
      ],
      regions: ["Middle East"],
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
      "Saqib Nisar is Managing Partner at athGADLANG, bringing over 30 years of global experience in assurance, forensics, compliance, and fraud investigations, including a 10-year tenure as Partner at Ernst & Young.",
      "Before joining athGADLANG, Saqib spent nearly 16 years at Ernst & Young, serving as Fraud Investigation and Dispute Services Leader for Qatar, Kuwait, and Oman, and began his career as Senior Manager at UHY Hacker Young.",
      "At athGADLANG, he applies his expertise across investigations, financial crime, AML, and forensic accounting, translating complex financial information into clear, actionable insight for clients across construction, logistics, trading, and oil & gas sectors. He is a Chartered Accountant (ICAEW) and a member of ACCA.",
    ],
    profile: {
      experience: "Over 30 years",
      qualifications: ["Chartered Accountant, ICAEW", "ACCA member"],
      firms: ["Ernst & Young", "UHY Hacker Young"],
      focus: [
        "Investigations",
        "Financial crime and AML",
        "Forensic accounting",
        "Compliance",
      ],
      industries: [
        "Construction",
        "Logistics",
        "Trading",
        "Oil & gas",
      ],
      regions: ["Qatar", "Kuwait", "Oman"],
    },
  },
  {
    // "Akhtar", as the biography, the LinkedIn address and the published URL
    // all spell it. The supplied copy headed his section "Akhter"; that is the
    // odd one out, so it is not followed.
    slug: "haziq-neshat-akhtar",
    name: "Haziq Neshat Akhtar",
    role: "Partner, Risk, Financial Crimes & Transaction Advisory",
    linkedin:
      "https://www.linkedin.com/in/haziq-neshat-akhtar-a1419121/",
    image: leaderImages["haziq-neshat-akhtar"],
    bio: [
      "Haziq Neshat Akhtar is Regional Partner, Risk, Financial Crimes, Sustainability & Transaction Advisory at athGADLANG, bringing over 19 years of multidisciplinary experience in risk management, forensic auditing, and corporate advisory, including senior leadership and Partner roles at Grant Thornton, BDO, and Forvis Mazars.",
      "Before joining athGADLANG, Haziq served as Executive Director (Partner) and Head of Risk & Corporate Advisory at BDO Pakistan, and as Partner, Risk, Forensics & Corporate Advisory at Forvis Mazars in Bahrain. He began his advisory career at Grant Thornton, and also led internal audit functions at Gerry's Group and SJ&G Pharmaceutical Group.",
      "At athGADLANG, he delivers high-impact solutions in ESG advisory, M&A, and enterprise risk management, also serving as Regional Partner at Wathiq. He is a Certified Shariah Auditor, Certified Anti-Money Laundering Specialist, and Fellow of the Institute of Forensic Accountants of Pakistan, and is the author of Consulting Chronicles.",
    ],
    profile: {
      experience: "Over 19 years",
      qualifications: [
        "Certified Shariah Auditor",
        "Certified Anti-Money Laundering Specialist",
        "Fellow, Institute of Forensic Accountants of Pakistan",
      ],
      firms: [
        "Grant Thornton",
        "BDO",
        "Forvis Mazars",
        "Gerry's Group",
      ],
      focus: [
        "Enterprise risk management",
        "Forensic auditing",
        "ESG advisory",
        "M&A",
      ],
    },
  },
  {
    slug: "osman-babar",
    name: "Osman Babar",
    role: "Partner, BPO Services",
    linkedin:
      "https://www.linkedin.com/in/muhammadosmanbabar/",
    image: leaderImages["osman-babar"],
    bio: [
      "Osman Babar, FCA is Partner, BPO Services at athGADLANG, with over 25 years of experience building and scaling offshore finance functions for clients across the UK, GCC, and North America, including senior roles at PwC and KPMG.",
      "Before joining athGADLANG, Osman spent over four years at PwC as Senior Manager, Assurance, and four years at KPMG UAE as Audit and Assurance Manager, following a stint at PepsiCo as Senior Consultant. He also served as Head of Finance at The Royal Atlantis, Resort & Residences in Dubai for nearly seven years.",
      "At athGADLANG, he designs cost-efficient finance delivery models and builds offshore teams, and also serves as Partner, BPO Services at Wathiq and Managing Partner at AGR Consultants. He is a Fellow Chartered Accountant (ICAP).",
    ],
    profile: {
      experience: "Over 25 years",
      qualifications: ["Fellow Chartered Accountant, ICAP"],
      firms: ["PwC", "KPMG", "PepsiCo", "The Royal Atlantis"],
      focus: [
        "Business process outsourcing",
        "Offshore finance functions",
        "Finance delivery models",
      ],
      regions: ["UK", "GCC", "North America"],
    },
  },
  {
    slug: "sikandar-gadit",
    // The card heading, the slug and the metadata all say "Sikandar"; the
    // biography names him "Sikander Abdul Rehman Gadit", as the supplied copy
    // does. The two have disagreed since the copy was first supplied and the
    // published spelling is kept until somebody confirms which is right.
    name: "Sikandar Gadit",
    role: "Partner & Chief Operating Officer",
    linkedin:
      "https://www.linkedin.com/in/sikandergadit/",
    image: leaderImages["sikandar-gadit"],
    bio: [
      "Sikander Abdul Rehman Gadit is Chief Operating Officer at athGADLANG and Wathiq, bringing over 25 years of international business experience across Pakistan, Saudi Arabia, the UAE, and Bahrain.",
      "Before joining athGADLANG, Sikander built a diverse operational background, including as Managing Partner at Tahyati Textile LLC in Dubai, Business Owner at Rida Traders in Karachi, and Operations Manager at Abdul Latif Jamal Trading in Saudi Arabia. He also co-founded Prowire Online.",
      "At athGADLANG, he oversees operations across Bahrain and KSA, focused on business architecture, growth strategy, and market expansion, building scalable operating models and deep client relationships across the region.",
    ],
    profile: {
      experience: "Over 25 years",
      firms: [
        "Tahyati Textile",
        "Rida Traders",
        "Abdul Latif Jamal Trading",
      ],
      focus: [
        "Business architecture",
        "Growth strategy",
        "Market expansion",
        "Operations",
      ],
      regions: ["Pakistan", "Saudi Arabia", "UAE", "Bahrain"],
    },
  },
  {
    slug: "khushboo-mushtaq",
    name: "Khushboo Mushtaq",
    role: "Director, Financial Accounting & Advisory Services (FAAS)",
    linkedin:
      "https://www.linkedin.com/in/khushboo-mushtaq-aca-17b5a057/",
    image: leaderImages["khushboo-mushtaq"],
    bio: [
      "Khushboo Mushtaq, ACA is Regional Director, Advisory Services at athGADLANG, bringing over 15 years of experience in business valuation, financial due diligence, and M&A advisory, including tenures at Ernst & Young and BDO.",
      "Before joining athGADLANG, Khushboo spent over five years at Ernst & Young Pakistan as Audit Supervisor, and served as Assistant Manager, Audit & Advisory at BDO Pakistan. She also spent nearly four years at Gadlang Management Consultants, helping establish the firm's UAE and Pakistan offices.",
      "At athGADLANG, she advises CEOs, founders, and investors across the UAE and Saudi Arabia on business valuation, deal structuring, and transaction readiness, with a focus on maximizing enterprise value and negotiating power. She is a Chartered Accountant, former ICAP UAE Chairperson, and was named CA Woman of the Year 2026.",
    ],
    profile: {
      experience: "Over 15 years",
      qualifications: [
        "Chartered Accountant (ACA)",
        "Former Chairperson, ICAP UAE",
        "CA Woman of the Year 2026",
      ],
      firms: [
        "Ernst & Young",
        "BDO",
        "Gadlang Management Consultants",
      ],
      focus: [
        "Business valuation",
        "Financial due diligence",
        "M&A advisory",
        "Deal structuring",
      ],
      regions: ["UAE", "Saudi Arabia"],
    },
  },
];

export function leaderHref(leader: Leader) {
  return `/about/leadership/${leader.slug}`;
}

/** Every leader slug, for `generateStaticParams`. */
export const leaderSlugs = leaders.map((leader) => leader.slug);

/**
 * Slug and name only, for the admin form's presenter picker.
 *
 * Narrowed deliberately: the form is a Client Component, and a `Leader` carries
 * a biography, an expertise list and a portrait reference that would all be
 * serialised into the page payload to fill in a select with eleven options.
 */
export const leaderOptions = leaders.map(({ slug, name }) => ({ slug, name }));

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
