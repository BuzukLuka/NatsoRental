import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.example.com" }, // add your real host
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  eslint: {
    // ✅ Build үед lint error-уудаас болж унахгүй
    ignoreDuringBuilds: true,
  },
  // Хэрэв TS алдаа түр хугацаанд хориг болж байвал (зөвхөн түр):
  typescript: {
    ignoreBuildErrors: false, // ← үнэхээр нэмэх шаардлагатай бол л true болгоорой
  },
};

export default nextConfig;
