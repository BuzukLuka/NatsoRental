// src/components/FiltersBar.tsx
"use client";

import React from "react";
import PadsplitStyleSearch from "./FiltersBar";

export default function FiltersBar() {
  return (
    <div className="w-full relative z-50">
      {/* Container with proper spacing and high z-index */}
      <div className="relative mx-auto max-w-3xl">
        {/* White card wrapper for the search */}
        <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
          <PadsplitStyleSearch />
        </div>
      </div>
    </div>
  );
}
