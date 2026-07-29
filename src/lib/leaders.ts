import { leaderImages } from "@/lib/images";

export type Leader = {
  slug: keyof typeof leaderImages;
  name: string;
  role: string;
  /** Profile URL on LinkedIn. "#" until the real profiles are supplied. */
  linkedin?: string;
  image: { src: string; alt: string };
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
  },
  {
    slug: "yasir-gadit",
    name: "Yasir Gadit",
    role: "Partner — Consulting",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["yasir-gadit"],
  },
  {
    slug: "abdullah-taimoor",
    name: "Abdullah Taimoor",
    role: "Partner — Fixed Asset Management",
    linkedin: LINKEDIN_TBC,
    image: leaderImages["abdullah-taimoor"],
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
