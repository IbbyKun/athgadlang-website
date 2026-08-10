/**
 * Google Analytics 4.
 *
 * The measurement ID is not a secret — it ships in the HTML of every page, and
 * anyone can read it from the browser. It lives here rather than in an
 * environment variable so there is nothing to forget when the project is
 * redeployed or moved between Vercel accounts, which has already happened once.
 * `NEXT_PUBLIC_GA_ID` still overrides it, for a second property or a staging one.
 *
 * The gate is the part worth reading. Analytics is only rendered on the real
 * production deployment, because a preview build is a production build in every
 * other respect: without the check, every preview URL, every `next start` run and
 * every crawl of a deployment link would land in the same reports as real
 * visitors. `VERCEL_ENV` is "production", "preview" or "development", and it is
 * read at build time in a server component, which is where the layout renders.
 *
 * One consequence to know about: pageviews from all five regional hostnames land
 * in one property. That is the useful arrangement — the regions are one business
 * — and GA4 records the hostname, so any report can be split by region when
 * somebody wants that.
 */

/** The property for athgadlang.com and its regional subdomains. */
const measurementId = "G-QFJ86E2E8X";

export const googleAnalyticsId =
  process.env.NEXT_PUBLIC_GA_ID?.trim() || measurementId;

/**
 * True only on the production deployment.
 *
 * Locally `VERCEL_ENV` is undefined, so development never reports — which also
 * means the tag cannot be verified by running the site locally. Check the
 * deployed HTML for `googletagmanager.com/gtag/js` instead.
 */
export const analyticsEnabled =
  process.env.VERCEL_ENV === "production" && Boolean(googleAnalyticsId);
