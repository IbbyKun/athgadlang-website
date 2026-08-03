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
    remotePatterns: [
      // Unsplash is used for development/placeholder photography.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
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
