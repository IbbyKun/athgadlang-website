import { leaderImages } from "@/lib/images";

export type Leader = {
  slug: keyof typeof leaderImages;
  name: string;
  role: string;
  /** Profile URL on LinkedIn. "#" until the real profiles are supplied. */
  linkedin?: string;
  image: { src: string; alt: string };
  /** Biography, one string per paragraph. Shown on service detail pages. */
  bio?: string[];
};

/** Stub until real profile URLs are available. */
const LINKEDIN_TBC = "#";

/**
 * IMPORTANT — partly placeholder data.
 *
 * The first four are the leaders named on the current site; their photographs
 * are still stock placeholders. Entries five to ten are pure placeholders
 * ("Leader Five" … "Leader Ten") so the grid can be reviewed — they are NOT
 * real people and every one must be replaced with a real name, role, photo,
 * and LinkedIn URL before this section goes anywhere public.
 */
export const leaders: Leader[] = [
  {
    slug: "arshad-gadit",
    name: "Arshad Gadit",
    role: "Global CEO",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["arshad-gadit"],
  },
  {
    slug: "usman-alam",
    name: "Usman Alam",
    role: "Partner — Assurance & Compliance",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["usman-alam"],
    bio: [
      "Usman Alam, a founding partner of athGADLANG Group, is a Fellow Member of the Institute of Chartered Accountants in England and Wales (ICAEW). With over 19 years of professional experience, Usman has built a distinguished career through leadership roles at global firms such as KPMG and PwC, as well as in the FMCG sector.",
      "At athGADLANG, Usman leads the Assurance & Compliance Services division, ensuring clients achieve compliance with IFRS and other regulatory frameworks. His expertise lies in optimizing financial reporting systems, navigating complex compliance matters, and delivering strategic advisory services for high-profile clients across a variety of industries.",
      "A respected thought leader, Usman contributes to the financial services industry through publications, webinars, and speaking engagements, offering insights into IFRS trends and best practices. His leadership and commitment to excellence have played a key role in athGADLANG's success as a trusted partner for businesses worldwide.",
    ],
  },
  {
    slug: "yasir-gadit",
    name: "Yasir Gadit",
    role: "Partner — Consulting",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["yasir-gadit"],
    // TWO VERSIONS SUPPLIED, and they disagree: the BPO page said "more than
    // 16 years" and "Ernst & Young in Qatar & UAE"; this is the later one,
    // "more than 19 years" and "UAE, Qatar and Kuwait". Confirm which is right.
    bio: [
      "Yasir is our leader for the Consulting division. He is a Fellow Chartered Accountant from the Institute of Chartered Accountants of Pakistan (ICAP). With more than 19 years of experience, Yasir is passionate adding value to our clients, and is a huge cricket enthusiast.",
      "Yasir brings Big 4 experience of the GCC region. He worked with Ernst & Young in UAE, Qatar and Kuwait, where he advised various clients in diversified sectors such as financial institutions, manufacturing, service, construction companies, and many more.",
      "Yasir has also led the Institute of Chartered Accountants of Pakistan's UAE Chapter, as well as various business councils in the UAE.",
    ],
  },
  {
    slug: "abdullah-taimoor",
    name: "Abdullah Taimoor",
    role: "Partner — Fixed Asset Management",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["abdullah-taimoor"],
    // Reproduced as supplied — including the opening line, which names a
    // different practice to the role above.
    bio: [
      "Our Partner – Accounting, Abdullah holds an MBA in Finance, is a certified ACCA member, and is currently a student of ACA (ICAEW) with over 10 years of experience (including Big 4) in auditing banks, funds, and insurance companies.",
      "Abdullah Taimoor is an energetic leader with the ability to expertly utilize methodologies to reduce risks, finalize engagements, measure operational efficiencies, financial integrity, and reporting capabilities in alignment with IFRS and ISAs.",
      "Abdullah is a strong believer in technology and works on bringing the latest tools which make our firm the right and best choice for our clients to partner and work with.",
    ],
  },
  {
    slug: "arslan-mushtaq",
    name: "Arslan Mushtaq",
    role: "Partner — Tax",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["arslan-mushtaq"],
    bio: [
      "Arslan leads the team at our Tax division. His experience spans over 19 years of post-qualification tenure in VAT, Audit Assurance, and Internal Audit, working at PwC, KPMG, and FRHI in the UK and UAE. A pro-networker and badminton player, Arslan has served a large range of companies and groups of all sizes, ranging from multinational companies to family-owned businesses.",
      "He has acquired both firm and industry experience and served a number of clients in Financial Services, Media, F&B, Hospitality, Manufacturing, Real Estate, and Construction sectors. Clients reach out to Arslan to seek his expertise in UK & GCC Tax, Excise and Customs Duty, Zakat, as well as financial planning, budgeting, contract reviews, financial reporting, and development of policies and procedures.",
    ],
  },
  {
    slug: "saqib-nisar",
    name: "Saqib Nisar",
    role: "Managing Partner",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["saqib-nisar"],
    bio: [
      "Saqib Nisar has over 25 years of experience in the field of investigations, contract reviews, financial crime, AML and sanctions assessments, audit, accounting, forensics, and related services. He has worked in a range of industries, including construction, logistics, trading and contracting services, and oil & gas sectors.",
      "Saqib has worked across multiple jurisdictions, including the Middle East and Gulf region, Western and Central Europe, and Africa. His extensive experience and knowledge of various sectors and regions allow him to provide comprehensive and practical solutions to clients seeking support in financial and related services.",
      "Saqib's wealth of knowledge and experience in financial and related services, along with his ability to understand the intricacies of different industries and regions, make him a trusted advisor to each client's unique needs.",
    ],
  },
  {
    slug: "haziq-neshat-akhtar",
    name: "Haziq Neshat Akhtar",
    role: "Partner — Risk, Financial Crimes & Transaction Advisory",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["haziq-neshat-akhtar"],
    bio: [
      "Haziq Neshat Akhtar leads the Advisory division at athGADLANG & WATHIQ. With over 16 years of experience, he specializes in risk management, forensic audits, corporate advisory, and financial consulting.",
      "Haziq is a Fellow member of The Institute of Financial Accountants UK and The Institute of Public Accountants Australia, he also holds a Fellowship with The Institute of Forensic Accountants of Pakistan and is associated with the Association of Chartered Certified Accountants. He further holds specialized qualifications in IT audits, Shariah Audit and Anti-money laundering. He has held key leadership roles in leading firms, including Forvis Mazars, BDO, Grant Thornton, British Petroleum Pakistan, Gerry's International, and SJG Pharma Group.",
      "An entrepreneur at heart, Haziq has delivered impactful projects in internal audits, process re-engineering, ERM, Strategy and research, ESG, Cyber security, valuations, M&A, Buy & Sell Side advisory and feasibility studies across diverse industries. He is passionate about driving ethical and sustainable business practices while delivering measurable value to clients.",
    ],
  },
  {
    slug: "osman-babar",
    name: "Osman Babar",
    role: "Partner — BPO Services",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["osman-babar"],
    bio: [
      "Osman is our Partner of Business Process Outsourcing (BPO) Services and a fellow member of the Institute of Chartered Accountants of Pakistan. He is a determined, highly motivated, and skilled professional with more than 22 years of experience.",
      "An accomplished professional with proven success in establishing performance management, best practices, enhancing business performance through timely and relevant financial planning and management, robust control structures, and financial reporting protocols in alignment with business goals and KPIs.",
      "He has also served as a leader in providing assurance services in five service streams for world-class organizations, including Statutory and Internal Audits, Management Assurance, and Financial Accounting & Advisory Services.",
    ],
  },
  {
    slug: "leader-nine",
    name: "Leader Nine",
    role: "Head of Internal Audit",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["leader-nine"],
  },
  {
    slug: "leader-ten",
    name: "Leader Ten",
    role: "Head of Technology",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["leader-ten"],
  },
];

export function leaderHref(leader: Leader) {
  return `/about/leadership/${leader.slug}`;
}

/** Looked up by slug, so pages can name the leaders they want. */
export function getLeaders(slugs: string[]) {
  return slugs
    .map((slug) => leaders.find((leader) => leader.slug === slug))
    .filter((leader): leader is Leader => Boolean(leader));
}
