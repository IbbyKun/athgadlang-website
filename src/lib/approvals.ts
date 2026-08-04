/**
 * Registration bodies and free zone authorities that list the firm as an
 * approved auditor.
 *
 * These are third-party marks, so the files come from the supplied brand folder
 * rather than being recreated. Where `logo` is unset the card falls back to the
 * authority's name in type, which is deliberate: a missing mark should read as a
 * name, never as a broken image.
 *
 * Intrinsic dimensions are recorded per logo because they differ wildly — the
 * lockups range from nearly square to five-to-one — and the card needs the real
 * ratio to reserve the right space before the image loads.
 */
export type Approval = {
  id: string;
  /** Full legal name, used for the accessible label and the logo's alt text. */
  name: string;
  /** How the authority brands itself, where that differs from the full name. */
  short?: string;
  logo?: { src: string; alt: string; width: number; height: number };
};

/** Every logo is normalised to a 200px height, so only the width varies. */
function logo(id: string, name: string, width: number) {
  return { src: `/images/approvals/${id}.png`, alt: name, width, height: 200 };
}

export const approvals: Approval[] = [
  {
    id: "jafza",
    name: "Jebel Ali Free Zone",
    short: "JAFZA",
    logo: logo("jafza", "Jebel Ali Free Zone", 337),
  },
  {
    id: "dmcc",
    name: "Dubai Multi Commodities Centre",
    short: "DMCC",
    logo: logo("dmcc", "Dubai Multi Commodities Centre", 697),
  },
  {
    id: "ifza",
    name: "International Free Zone Authority",
    short: "IFZA",
    logo: logo("ifza", "International Free Zone Authority", 820),
  },
  // The supplied mark is a three-letter wordmark with no expansion on it, which
  // the initials made ambiguous — Dubai CommerCity and the Dubai Chamber of
  // Commerce both abbreviate the same way. Confirmed by the firm as DCC Energy,
  // dccenergy.com.
  { id: "dcc", name: "DCC Energy", logo: logo("dcc", "DCC Energy", 652) },
  {
    id: "dwtc",
    name: "Dubai World Trade Centre",
    short: "DWTC",
    logo: logo("dwtc", "Dubai World Trade Centre", 745),
  },
  {
    id: "meydan",
    name: "Meydan Free Zone",
    short: "Meydan",
    logo: logo("meydan", "Meydan Free Zone", 189),
  },
  {
    id: "rak-icc",
    name: "RAK International Corporate Centre",
    short: "RAK ICC",
    logo: logo("rak-icc", "RAK International Corporate Centre", 271),
  },
  {
    id: "dsoa",
    name: "Dubai Silicon Oasis Authority",
    short: "DSOA",
    logo: logo("dsoa", "Dubai Silicon Oasis Authority", 491),
  },
  {
    id: "rakez",
    name: "Ras Al Khaimah Economic Zone",
    short: "RAKEZ",
    logo: logo("rakez", "Ras Al Khaimah Economic Zone", 625),
  },
  // The stacked block in this mark has its letters clipped by the block's edge.
  // That is how the artwork was supplied and appears to be the authority's own
  // treatment, so it is used as-is rather than "corrected".
  {
    id: "dafza",
    name: "Dubai Airport Freezone",
    short: "DAFZA",
    logo: logo("dafza", "Dubai Airport Freezone", 384),
  },
  {
    id: "dda",
    name: "Dubai Development Authority",
    short: "DDA",
    logo: logo("dda", "Dubai Development Authority", 1099),
  },
];

/** Every authority, for pages that cite the full list. */
export const approvalIds = approvals.map((approval) => approval.id);

/** Looked up by id, so a page can cite the authorities relevant to it. */
export function getApprovals(ids: string[]) {
  return ids
    .map((id) => approvals.find((approval) => approval.id === id))
    .filter((approval): approval is Approval => Boolean(approval));
}
