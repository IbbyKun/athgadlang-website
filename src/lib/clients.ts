export type Client = {
  name: string;
  /**
   * Path to the logo under /public/images/logos. Optional: until the real
   * asset is dropped in, the tile falls back to a typographic wordmark, so no
   * brand is ever misrepresented by a stand-in image.
   */
  logo?: string;
  /** Optional case study or client page. */
  href?: string;
};

/**
 * Clients shown in the portfolio gallery, in the order they appear on the
 * current site. Add `logo: "/images/logos/<file>.svg"` as each asset lands.
 */
export const clients: Client[] = [
  { name: "GymNation" },
  { name: "Al Habtoor" },
  { name: "Linde" },
  { name: "Alshaya" },
  { name: "TCL" },
  { name: "Spotii" },
  { name: "Footprint Real Estate" },
  { name: "CitrussTV" },
  { name: "Kishmish" },
  { name: "Jetstream Aviation Academy" },
  { name: "Masdar Institute" },
  { name: "Bloom Energy" },
  { name: "Chai and Co." },
  { name: "Pink Camel" },
  { name: "Al Khayyat Investments" },
];

/** Splits the roster into a given number of marquee rows, round-robin. */
export function splitIntoRows<T>(items: T[], rows: number): T[][] {
  const result: T[][] = Array.from({ length: rows }, () => []);
  items.forEach((item, index) => {
    result[index % rows].push(item);
  });
  return result;
}
