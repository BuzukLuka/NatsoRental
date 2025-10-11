import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // ← TEMP: should make images appear immediately
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
