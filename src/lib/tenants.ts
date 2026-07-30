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

export type Tenant = {
  code: TenantCode;
  /** Shown in the region switcher. */
  label: string;
  /** Empty for the primary tenant, which serves the bare domain. */
  subdomain: string;
  /** Trading name, where it differs from the group brand. */
  brandName?: string;
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

export const tenants: Tenant[] = [
  { code: "ae", label: "UAE", subdomain: "" },
  { code: "bh", label: "Bahrain", subdomain: "bh" },
  {
    code: "sa",
    label: "KSA",
    subdomain: "ksa",
    brandName: "Wathiq",
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
  { code: "uk", label: "UK", subdomain: "uk" },
  { code: "pk", label: "Pakistan", subdomain: "pk" },
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
  const hostname = host.split(":")[0].toLowerCase();
  const [first] = hostname.split(".");
  if (!first || first === "www") return primaryTenant.code;
  const match = tenants.find(
    (tenant) => tenant.subdomain && tenant.subdomain === first,
  );
  return match?.code ?? primaryTenant.code;
}
