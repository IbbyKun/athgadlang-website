import { primaryTenant, type TenantCode } from "@/lib/tenants";

export type Office = {
  slug: string;
  /**
   * The region this office serves. One office per region, so this is what
   * turns the visitor's subdomain into an address, a phone number and a pin.
   */
  tenant: TenantCode;
  /** Short country label — matches the region switcher and the footer row. */
  country: string;
  /** The country as it reads mid-sentence, e.g. on the legal pages. */
  countryName: string;
  /** ISO 3166-1 alpha-2, for the structured data on the homepage. */
  countryCode: string;
  city: string;
  address: string;
  /**
   * What the map links search for. Geocodes more reliably than the full
   * address, which carries a unit number no mapping service knows about.
   */
  mapQuery: string;
  phone: string;
  /** Digits only, for the tel: link. */
  phoneHref: string;
  /**
   * APPROXIMATE — set to the district, not the building. Replace with exact
   * figures: open Google Maps, right-click the entrance, click the lat/long to
   * copy it.
   */
  lat: number;
  lng: number;
};

/**
 * The office network, in the same order as the region switcher.
 *
 * No office is marked as the head office, on purpose: the site does not say
 * which one it is. Five offices, listed as equals.
 */
export const offices: Office[] = [
  {
    slug: "uae",
    tenant: "ae",
    country: "UAE",
    countryName: "United Arab Emirates",
    countryCode: "AE",
    city: "Dubai",
    address: "Office # 2804, API World Tower, Sheikh Zayed Road, Dubai - UAE",
    mapQuery: "API World Tower, Sheikh Zayed Road, Dubai",
    phone: "(+971) 4 878 7025",
    phoneHref: "tel:+97148787025",
    lat: 25.2166,
    lng: 55.276,
  },
  {
    slug: "bahrain",
    tenant: "bh",
    country: "Bahrain",
    countryName: "Bahrain",
    countryCode: "BH",
    city: "Al-Seef",
    address:
      "Office 174, Nordic Tower, Building 79, Road 2802, Block-428, Al-Seef",
    mapQuery: "Nordic Tower, Road 2802, Block 428, Al Seef, Bahrain",
    phone: "(+973) 17701230",
    phoneHref: "tel:+97317701230",
    lat: 26.2185,
    lng: 50.529,
  },
  {
    slug: "ksa",
    tenant: "sa",
    country: "KSA",
    countryName: "Saudi Arabia",
    countryCode: "SA",
    city: "Riyadh",
    address:
      "Office No 16, Leaders Business, Tower 2, King Fahad Road, Al Olaya District, Riyadh",
    mapQuery: "Leaders Business Tower 2, King Fahad Road, Al Olaya, Riyadh",
    phone: "(+966) 11 420 0085",
    phoneHref: "tel:+966114200085",
    lat: 24.698,
    lng: 46.684,
  },
  {
    slug: "uk",
    tenant: "uk",
    // Kept short so it matches the region switcher and the footer row.
    country: "UK",
    countryName: "United Kingdom",
    countryCode: "GB",
    city: "London",
    address: "Office F22, 25 Finsbury Circus, EC2M 7EE, London, United Kingdom",
    mapQuery: "25 Finsbury Circus, London EC2M 7EE",
    phone: "(+973) 17701230",
    phoneHref: "tel:+97317701230",
    lat: 51.5183,
    lng: -0.0864,
  },
  {
    slug: "pakistan",
    tenant: "pk",
    country: "Pakistan",
    countryName: "Pakistan",
    countryCode: "PK",
    city: "Lahore",
    address: "304, Upper Mall Scheme, Lahore, Punjab",
    mapQuery: "Upper Mall Scheme, Lahore",
    phone: "(+971) 58 123 0671",
    phoneHref: "tel:+971581230671",
    lat: 31.556,
    lng: 74.33,
  },
];

/**
 * The office a region is served from. Falls back to the primary region's
 * office, which is the same fallback `getTenant` makes for an unknown host —
 * so an unrecognised region shows one region's details rather than none.
 */
export function officeForTenant(code: TenantCode): Office {
  return (
    offices.find((office) => office.tenant === code) ??
    offices.find((office) => office.tenant === primaryTenant.code)!
  );
}

/** Google Maps search link for an office. */
export function mapHref(office: Office) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    office.mapQuery,
  )}`;
}
