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
 * current site.
 *
 * Logos are normalised onto one 768x224 canvas — four times the display size —
 * so the row reads as a set rather than as fifteen marks each sized by its own
 * aspect ratio. They are raster, not vector, on purpose: at 56 pixels tall a
 * 4x PNG is indistinguishable from the real SVG, and tracing a supplied raster
 * would produce a redrawn approximation of someone else's trademark.
 */
export const clients: Client[] = [
  { name: "GymNation", logo: "/images/logos/gymnation.png" },
  { name: "Al Habtoor", logo: "/images/logos/al-habtoor.png" },
  { name: "Linde", logo: "/images/logos/linde.png" },
  { name: "Alshaya", logo: "/images/logos/alshaya.png" },
  { name: "TCL", logo: "/images/logos/tcl.png" },
  { name: "Spotii", logo: "/images/logos/spotii.png" },
  /*
    Lifted out of the marketing banner that was the only artwork available —
    theirs is the one mark supplied as white type over a photograph. The white
    separates cleanly from the wash behind it, so the shape is theirs unaltered;
    only the colour is applied, and that is sampled from the same banner.

    Cropping the banner instead would have left a near-square image, and a square
    capped at the tile's 56px height uses a third of its 192px width — the logo
    would have landed markedly smaller than every other one in the row.
  */
  { name: "Footprint Real Estate", logo: "/images/logos/footprint.png" },
  { name: "CitrussTV", logo: "/images/logos/citrusstv.png" },
  { name: "Kishmish", logo: "/images/logos/kishmish.png" },
  {
    name: "Jetstream Aviation Academy",
    logo: "/images/logos/jetstream.png",
  },
  // The supplied mark is Masdar's, not the Masdar Institute's — that name has
  // not existed since it merged into Khalifa University in 2017.
  { name: "Masdar", logo: "/images/logos/masdar.png" },
  { name: "Bloom Energy", logo: "/images/logos/bloom-energy.png" },
  { name: "Chai and Co.", logo: "/images/logos/chai-and-co.png" },
  { name: "Pink Camel", logo: "/images/logos/pink-camel.png" },
  {
    name: "Al Khayyat Investments",
    logo: "/images/logos/al-khayyat-investments.png",
  },
];

/** Splits the roster into a given number of marquee rows, round-robin. */
export function splitIntoRows<T>(items: T[], rows: number): T[][] {
  const result: T[][] = Array.from({ length: rows }, () => []);
  items.forEach((item, index) => {
    result[index % rows].push(item);
  });
  return result;
}
