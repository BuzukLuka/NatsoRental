// tailwind.config.ts (ESM)
import type { Config } from "tailwindcss";

export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { yellow: "#FFD12E", ink: "#111111", paper: "#ffffff" },
      },
      boxShadow: { soft: "0 8px 24px rgba(0,0,0,0.08)" },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { fadeUp: "fadeUp .6s ease-out both" },
    },
  },
  plugins: [],
} satisfies Config;
