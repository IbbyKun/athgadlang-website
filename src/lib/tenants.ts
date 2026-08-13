/**
 * Regional tenants.
 *
 * Each region is served from its own subdomain — the primary one (UAE) from
 * the bare domain. Middleware maps the request host onto a `[tenant]` route
 * segment, so every tenant is prerendered at build time and the public URLs
 * never carry a prefix: ksa.athgadlang.com/insights renders /sa/insights
 * internally while the address bar stays clean.
 *
 * KSA trades under the Wathiq brand and carries its own logo.
 */

export type TenantCode = "ae" | "bh" | "sa" | "uk" | "pk";

export type TenantLogo = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * A region's brand colours, where they differ from athGADLANG's.
 *
 * Emitted as CSS custom properties on that region's pages, so every `bg-brand`,
 * `text-brand-navy` and the rest follow without a single component knowing
 * which region it is rendering.
 */
export type TenantPalette = {
  brand: string;
  /** Pressed/hover red. The brand red at ~81% lightness per channel. */
  brandHover: string;
  brandNavy: string;
};

export type Tenant = {
  code: TenantCode;
  /** Shown in the region switcher. */
  label: string;
  /**
   * The region as it reads mid-sentence, article included — "the UAE", but
   * "Bahrain". Carried rather than derived, because whether a country name
   * takes "the" is a fact about the name and not something to infer.
   *
   * Used in the title and meta description, which are prose.
   */
  inRegion: string;
  /** Empty for the primary tenant, which serves the bare domain. */
  subdomain: string;
  /** Trading name, where it differs from the group brand. */
  brandName?: string;
  /**
   * Brand colours, where the region has its own. Omitted means athGADLANG's,
   * which are the defaults in globals.css.
   */
  palette?: TenantPalette;
  /** Omitted where the tenant uses the athGADLANG logo. */
  logo?: { default: TenantLogo; light: TenantLogo };
  /** Browser tab icon: the brand mark on its own. */
  favicon?: { svg: string; apple: string };
};

/** athGADLANG mark, extracted from the full logo. */
export const defaultFavicon = {
  svg: "/svg/favicon-ag.svg",
  apple: "/images/apple-icon-ag.png",
};

/** Override per environment, e.g. a staging domain. */
export const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "athgadlang.com";

/**
 * Stands in for a subdomain on hosts that cannot have one — a Vercel
 * deployment URL, an IP. Set by the region switcher, read by the proxy, and
 * ignored the moment the request arrives on a domain of ours.
 */
export const tenantCookie = "region";

export const tenants: Tenant[] = [
  { code: "ae", label: "UAE", inRegion: "the UAE", subdomain: "" },
  { code: "bh", label: "Bahrain", inRegion: "Bahrain", subdomain: "bh" },
  {
    code: "sa",
    label: "KSA",
    inRegion: "Saudi Arabia",
    subdomain: "ksa",
    brandName: "Wathiq",
    /*
      Wathiq's own colours, taken from its logo: the mark is #C13649, against
      athGADLANG's #A71F25. These were supplied as the KSA brand and apply to
      this region only — painting the other four in them would put the Wathiq
      palette on athGADLANG's sites, which is what happened when they were set
      as the site-wide defaults.
    */
    palette: {
      brand: "#c23546",
      brandHover: "#9d2b39",
      brandNavy: "#0c1a3f",
    },
    /**
     * The supplied asset is a knockout (white glyph), which suits the dark
     * footer. `default` is the same artwork with the glyph recoloured to
     * brand navy, for the light header.
     */
    logo: {
      default: {
        src: "/svg/wathiqLogo-navy.svg",
        width: 500,
        height: 317,
        alt: "Wathiq",
      },
      light: {
        src: "/svg/wathiqLogo.svg",
        width: 500,
        height: 317,
        alt: "Wathiq",
      },
    },
    /** The Wathiq chevron, extracted from its logo. */
    favicon: {
      svg: "/svg/favicon-wathiq.svg",
      apple: "/images/apple-icon-wathiq.png",
    },
  },
  { code: "uk", label: "UK", inRegion: "the UK", subdomain: "uk" },
  { code: "pk", label: "Pakistan", inRegion: "Pakistan", subdomain: "pk" },
];

export const primaryTenant = tenants[0];

export const tenantCodes = tenants.map((tenant) => tenant.code);

/** Absolute URL for a tenant — always cross-origin. */
export function tenantUrl(tenant: Tenant) {
  const host = tenant.subdomain
    ? `${tenant.subdomain}.${siteDomain}`
    : siteDomain;
  return `https://${host}/`;
}

/** Looks up a tenant by route segment, falling back to the primary one. */
export function getTenant(code: string | undefined): Tenant {
  return tenants.find((tenant) => tenant.code === code) ?? primaryTenant;
}

/**
 * Maps a request host to a tenant code. Anything unrecognised — the bare
 * domain, localhost, a Vercel preview URL — resolves to the primary tenant.
 */
export function tenantCodeFromHost(host: string): TenantCode {
  return tenantSubdomainCode(host) ?? primaryTenant.code;
}

/**
 * The region a host names through its subdomain, or undefined where it names
 * none. Works for `ksa.athgadlang.com` and `ksa.localhost` alike.
 */
export function tenantSubdomainCode(host: string): TenantCode | undefined {
  const [first] = host.split(":")[0].toLowerCase().split(".");
  if (!first || first === "www") return undefined;
  return tenants.find(
    (tenant) => tenant.subdomain && tenant.subdomain === first,
  )?.code;
}

/**
 * True for our own domain and its subdomains — the only hosts where a region
 * has a URL of its own. A deployment URL is somebody else's domain.
 */
export function isSiteHost(host: string) {
  const hostname = host.split(":")[0].toLowerCase();
  return hostname === siteDomain || hostname.endsWith(`.${siteDomain}`);
}

/** A region code we recognise, or undefined. */
export function tenantCode(value: string | undefined): TenantCode | undefined {
  return tenants.find((tenant) => tenant.code === value)?.code;
}
