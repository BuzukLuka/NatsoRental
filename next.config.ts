import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Enable standalone output for Docker
  images: {
    unoptimized: true, // ← TEMP: should make images appear immediately
  },
  // Note: In Next.js 16+, use `next lint --max-warnings 0` in package.json instead of eslint config here
  typescript: {
    ignoreBuildErrors: false, // ← үнэхээр нэмэх шаардлагатай бол л true болгоорой
  },
};

export default nextConfig;
