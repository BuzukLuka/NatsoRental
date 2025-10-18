"use client";

import { X, AlertTriangle, Info, CheckCircle2, OctagonAlert } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

type Variant = "warning" | "info" | "success" | "danger";

const ICONS: Record<Variant, React.ReactNode> = {
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  danger: <OctagonAlert className="h-5 w-5" />,
};

const RING: Record<Variant, string> = {
  warning: "ring-[--ring] bg-[--bg] text-[--fg]",
  info: "ring-[--ring] bg-[--bg] text-[--fg]",
  success: "ring-[--ring] bg-[--bg] text-[--fg]",
  danger: "ring-[--ring] bg-[--bg] text-[--fg]",
};

const VAR_STYLES: Record<Variant, React.CSSProperties> = {
  warning: {
    // brand yellow
    ["--ring" as any]: "rgba(255,209,46,0.6)",
    ["--bg" as any]: "linear-gradient(180deg,#FFF7D6, #FFEFA8)",
    ["--fg" as any]: "#181818",
  },
  info: {
    ["--ring" as any]: "rgba(147,197,253,0.5)",
    ["--bg" as any]: "linear-gradient(180deg,#F0F6FF,#DBEAFE)",
    ["--fg" as any]: "#0B1220",
  },
  success: {
    ["--ring" as any]: "rgba(52,211,153,0.5)",
    ["--bg" as any]: "linear-gradient(180deg,#E8FFF5,#CFFAE6)",
    ["--fg" as any]: "#052014",
  },
  danger: {
    ["--ring" as any]: "rgba(248,113,113,0.55)",
    ["--bg" as any]: "linear-gradient(180deg,#FFF1F2,#FFE4E6)",
    ["--fg" as any]: "#22080A",
  },
};

export default function Alert({
  variant = "warning",
  title,
  children,
  onClose,
  className = "",
}: {
  variant?: Variant;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={VAR_STYLES[variant]}
      className={[
        // neo-brutal card w/ chunky ring + shadow
        "relative overflow-hidden rounded-2xl border border-black/10 ring-2",
        "shadow-[4px_4px_0_#00000018] p-3 md:p-4",
        RING[variant],
        className,
      ].join(" ")}
    >
      {/* subtle moving sheen */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        initial={{ backgroundPositionX: "0%" }}
        animate={{ backgroundPositionX: "200%" }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.4) 20%, transparent 40%)",
          backgroundSize: "200% 100%",
        }}
      />
      <div className="relative z-10 flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl border border-black/10 bg-white/60 backdrop-blur">
          {ICONS[variant]}
        </div>
        <div className="min-w-0 flex-1">
          {title && <div className="font-bold leading-tight">{title}</div>}
          {children && (
            <div className="prose prose-sm mt-1 max-w-none text-[0.92rem] leading-relaxed">
              {children}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white/60 text-black/70 hover:bg-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
