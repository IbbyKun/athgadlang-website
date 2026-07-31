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
    bio: [
      "Yasir is our leader for the Consulting division. He is a Fellow Chartered Accountant from the Institute of Chartered Accountants of Pakistan (ICAP). With more than 16 years of experience, Yasir is passionate adding value to our clients, and is a huge cricket enthusiast.",
      "Yasir brings Big 4 experience of the GCC region. He worked with Ernst & Young in Qatar & UAE, where he advised various clients in diversified sectors such as financial institutions, manufacturing, service, construction companies, and many more. Yasir has also led the Institute of Chartered Accountants of Pakistan's UAE Chapter, as well as various business councils in the UAE.",
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
    slug: "leader-five",
    name: "Leader Five",
    role: "Partner — Tax",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["leader-five"],
  },
  {
    slug: "leader-six",
    name: "Leader Six",
    role: "Partner — Corporate Services",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["leader-six"],
  },
  {
    slug: "leader-seven",
    name: "Leader Seven",
    role: "Director — Accounting",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["leader-seven"],
  },
  {
    slug: "leader-eight",
    name: "Leader Eight",
    role: "Director — Resourcing",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["leader-eight"],
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
