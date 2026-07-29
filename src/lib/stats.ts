export type Stat = {
  id: string;
  label: string;
  /** Target the counter animates to. */
  value: number;
  /** Appended after the number. */
  suffix?: string;
  /**
   * How much of the ring fills, 0–1. A visual weight rather than a computed
   * ratio — the figures have no common scale, so each ring is set by design.
   */
  progress: number;
};

/** Figures shown in the "aG in Numbers" panel. */
export const stats: Stat[] = [
  {
    id: "experience",
    label: "Year of Experience",
    value: 20,
    suffix: "+",
    progress: 0.2,
  },
  {
    id: "clients",
    label: "Number of Clients Served",
    value: 2500,
    suffix: "+",
    progress: 0.95,
  },
  {
    id: "listed-companies",
    label: "Listed Companies Served",
    value: 30,
    suffix: "+",
    progress: 0.35,
  },
  {
    id: "fortune-500",
    label: "Fortune 500 Clients",
    value: 15,
    suffix: "+",
    progress: 0.3,
  },
  {
    id: "industries",
    label: "Industries Catered",
    value: 12,
    suffix: "+",
    progress: 0.15,
  },
  {
    id: "employees",
    label: "Employees",
    value: 100,
    suffix: "+",
    progress: 1,
  },
  {
    id: "certifications",
    label: "Certifications & Qualifications",
    value: 10,
    suffix: "+",
    progress: 0.12,
  },
  {
    id: "freezone-partnerships",
    label: "Freezone Partnerships",
    value: 25,
    suffix: "+",
    progress: 0.4,
  },
];
