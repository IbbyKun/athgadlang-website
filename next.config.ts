import type { NextConfig } from "next";

/**
 * Storage host for admin-uploaded artwork, derived from the project URL so
 * Supabase is configured in one place. Absent until a project is attached —
 * the site still builds, it just has no uploaded images to show.
 */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? URL.parse(process.env.NEXT_PUBLIC_SUPABASE_URL)?.hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    /**
     * Four device widths instead of eight, and three small ones instead of
     * seven.
     *
     * Every width in these two lists is a separate optimised image, and Vercel
     * bills a transformation for each — 5,000 a month on the free plan. The
     * defaults are `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]` plus
     * `[32, 48, 64, 96, 128, 256, 384]`, which made the homepage alone imply 424
     * transformations from 42 source photographs. Three quarters of the monthly
     * allowance went in days.
     *
     * The pairs that went are the ones that bought least. 750 sits between 640
     * and 828, and 1080 between 828 and 1200 — a browser choosing either was
     * saving a few kilobytes over its neighbour. 2048 and 3840 are the expensive
     * ones: 91 images on the homepage requested 3840, a width only a 4K display
     * showing something full-bleed can use.
     *
     * What this costs: a full-width hero on a 4K or high-DPI screen now scales
     * 1920 up rather than being served 3840. Card images are unaffected, because
     * their `sizes` never asked for those widths.
     *
     * Everything in `imageSizes` stays below the smallest `deviceSizes` entry,
     * which is the constraint Next documents for it.
     */
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [128, 256, 384],

    /**
     * 31 days, up from the Next 16 default of 4 hours.
     *
     * This, not the ladder above, is the change that matters. The site has only
     * about 128 distinct source images — 61 Unsplash placeholders, 59 local
     * files, 8 video stills — which at seven widths is under 900 distinct
     * optimised images in total, comfortably inside a 5,000 monthly allowance.
     * We were nowhere near that in distinct images and still burned three
     * quarters of the quota in days, because a 4-hour TTL lets every image be
     * re-optimised six times a day. The same few hundred pictures, generated
     * again and again.
     *
     * Next warns against a long TTL because the image cache cannot be
     * invalidated — replace a picture at the same URL and the old one persists.
     * That cannot happen here: `createUploadUrl` writes every upload to a fresh
     * UUID path, so a replacement always has a new URL and the old entry ages
     * out unreferenced.
     */
    minimumCacheTTL: 2678400,

    remotePatterns: [
      // Unsplash is used for development/placeholder photography.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      // Video stills, for webinars published without their own thumbnail.
      // Scoped to the thumbnail path, and to no query string at all.
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
        search: "",
      },
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              // Scoped to the public bucket: nothing else in the storage API
              // should be reachable through the image optimiser.
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
