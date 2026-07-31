/**
 * Registration bodies and free zone authorities that list the firm as an
 * approved auditor.
 *
 * The authorities' own logo files are not in the repository — they are
 * third-party marks and must come from the brand folder rather than be
 * recreated. Until they land, `logo` is unset and the card sets the authority's
 * name instead; drop a file in and the card switches to it with no code change.
 */
export type Approval = {
  id: string;
  /** Full legal name, used for the accessible label and the logo's alt text. */
  name: string;
  /** How the authority brands itself, where that differs from the full name. */
  short?: string;
  logo?: { src: string; alt: string };
};

export const approvals: Approval[] = [
  { id: "jafza", name: "Jebel Ali Free Zone", short: "JAFZA" },
  { id: "dmcc", name: "Dubai Multi Commodities Centre", short: "DMCC" },
  { id: "ifza", name: "International Free Zone Authority", short: "IFZA" },
  // Confirm which body this is: the mark on the current site reads "DCC", which
  // could be Dubai CommerCity or the Dubai Chamber of Commerce. Shown as the
  // initials alone until then.
  { id: "dcc", name: "DCC" },
  { id: "dwtc", name: "Dubai World Trade Centre", short: "DWTC" },
  { id: "meydan", name: "Meydan Free Zone", short: "Meydan" },
  {
    id: "rak-icc",
    name: "RAK International Corporate Centre",
    short: "RAK ICC",
  },
  { id: "dsoa", name: "Dubai Silicon Oasis Authority", short: "DSOA" },
  { id: "rakez", name: "Ras Al Khaimah Economic Zone", short: "RAKEZ" },
  { id: "dafza", name: "Dubai Airport Freezone", short: "DAFZA" },
  { id: "dda", name: "Dubai Development Authority", short: "DDA" },
];

/** Every authority, for pages that cite the full list. */
export const approvalIds = approvals.map((approval) => approval.id);

/** Looked up by id, so a page can cite the authorities relevant to it. */
export function getApprovals(ids: string[]) {
  return ids
    .map((id) => approvals.find((approval) => approval.id === id))
    .filter((approval): approval is Approval => Boolean(approval));
}
