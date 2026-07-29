import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Unsplash is used for development/placeholder photography.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
