export type Office = {
  slug: string;
  /** Country or territory the office serves. */
  country: string;
  city: string;
  address: string;
  phone: string;
  /** Digits only, for the tel: link. */
  phoneHref: string;
  /** Marked "Head Office" on the pin and in its popup. */
  headOffice?: boolean;
  /**
   * APPROXIMATE — set to the district, not the building. Replace with exact
   * figures: open Google Maps, right-click the entrance, click the lat/long to
   * copy it.
   */
  lat: number;
  lng: number;
};

/** Offices pinned on the contact map, head office first. */
export const offices: Office[] = [
  {
    slug: "uae",
    country: "UAE",
    city: "Dubai",
    address: "Office # 2804, API World Tower, Sheikh Zayed Road, Dubai - UAE.",
    phone: "(+971) 4 878 7025",
    phoneHref: "tel:+97148787025",
    headOffice: true,
    lat: 25.2166,
    lng: 55.276,
  },
  {
    slug: "bahrain",
    country: "Bahrain",
    city: "Al-Seef",
    address:
      "Office 174, Nordic Tower, Building 79, Road 2802, Block-428, Al-Seef.",
    phone: "(+973) 17701230",
    phoneHref: "tel:+97317701230",
    lat: 26.2185,
    lng: 50.529,
  },
  {
    slug: "ksa",
    country: "KSA",
    city: "Riyadh",
    address:
      "Office No 16, Leaders Business, Tower 2, King Fahad Road, Al Olaya District, Riyadh.",
    phone: "(+966) 11 420 0085",
    phoneHref: "tel:+966114200085",
    lat: 24.698,
    lng: 46.684,
  },
  {
    slug: "uk",
    country: "United Kingdom",
    city: "London",
    address:
      "Office F22, 25 Finsbury Circus, EC2M 7EE, London, United Kingdom.",
    phone: "(+973) 17701230",
    phoneHref: "tel:+97317701230",
    lat: 51.5183,
    lng: -0.0864,
  },
  {
    slug: "pakistan",
    country: "Pakistan",
    city: "Lahore",
    address: "304, Upper Mall Scheme, Lahore, Punjab.",
    phone: "(+971) 58 123 0671",
    phoneHref: "tel:+971581230671",
    lat: 31.556,
    lng: 74.33,
  },
  {
    slug: "oman",
    country: "Oman",
    city: "Muscat",
    address:
      "Office No. 312 - 313, Maktabi Al Watayah, PC 116, Muscat, Sultanate of Oman.",
    phone: "(+973) 1770 1230",
    phoneHref: "tel:+97317701230",
    lat: 23.594,
    lng: 58.41,
  },
];
