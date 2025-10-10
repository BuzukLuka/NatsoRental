"use client";
import React from "react";
import { motion } from "framer-motion";

const steps = [
  { title: "Discovery", desc: "Search Calgary rooms with filters" },
  { title: "Browse & Filter", desc: "Apply price, type, and pet filters" },
  { title: "Listing Details", desc: "See rules, wifi, and orientation" },
  { title: "Application & Screening", desc: "Provide ID & references" },
  { title: "Reservation", desc: "Pay deposit & sign" },
  { title: "Pre Move-In", desc: "Receive keys & checklist" },
  { title: "Move-In", desc: "Inspection & check-in" },
  { title: "Stay & Support", desc: "Portal for payments & support" },
  { title: "Renewal / Move-Out", desc: "Renew or plan move-out" },
];

type StepsProps = {
  className?: string;
};

export default function Steps({ className }: StepsProps) {
  return (
    <section className={`py-16 px-4 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
        How It Works
      </h2>

      <ul className="flex flex-wrap justify-center gap-x-10 gap-y-14 max-w-6xl mx-auto">
        {steps.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            viewport={{ once: true }}
            className="w-[140px] flex flex-col items-center text-center"
          >
            {/* step badge */}
            <div className="mb-3 flex items-center justify-center h-10 w-10 rounded-full border-4 border-[#FFD12E] bg-white font-bold text-gray-900 shadow-[2px_2px_0_#FFD12E]">
              {i + 1}
            </div>

            {/* text */}
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">
              {s.title}
            </h3>
            <p className="text-xs text-gray-600 mt-1 leading-snug max-w-[120px]">
              {s.desc}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
