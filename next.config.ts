import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/seed/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-*" },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
