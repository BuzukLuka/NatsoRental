import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.example.com" }, // add your real host
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "15-223-51-206.sslip.io" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
