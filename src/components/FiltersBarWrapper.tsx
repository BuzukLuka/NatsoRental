"use client";
import React from "react";
import FiltersBar from "@/components/FiltersBar";

export default function FiltersBarWrapper({
  variant = "default",
}: {
  variant?: "default" | "hero";
}) {
  if (variant === "hero") {
    return (
      <div className="mt-6 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-6 border border-gray-200 max-w-6xl mx-auto">
        <FiltersBar />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4">
      <FiltersBar />
    </div>
  );
}
