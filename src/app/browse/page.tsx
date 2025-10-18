"use client";

import FiltersBar from "@/components/FiltersBar";
import PropertyGrid from "@/components/PropertyGrid";
import Map from "@/components/Map";
import { useApp } from "@/providers/AppProvider";
import { useMemo } from "react";

export default function BrowsePage() {
  const { rooms, filters, isLoading } = useApp();

  // 🧮 Apply frontend filters (in case backend doesn't yet support all)
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    const q = (filters.q ?? "").trim().toLowerCase();

    return rooms.filter((r) => {
      // --- keyword search across multiple fields ---
      if (q) {
        const haystack = [r.title, r.address, r.property_type?.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(q)) return false;
      }

      // --- price range ---

      // --- pets allowed ---
      if (filters.petsAllowed === true && !r.pets_allowed) return false;

      // --- tenure (exact match if you store strings like 'try'|'mid'|'long') ---
      if (filters.tenure && r.tenure !== filters.tenure) return false;

      // --- type (match by name; change if you store an id/slug) ---
      if (filters.type) {
        const typeName = r.property_type?.name?.toLowerCase() ?? "";
        if (!typeName.includes(String(filters.type).toLowerCase()))
          return false;
      }

      return true; // ✅ keep the room
    });
  }, [rooms, filters]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-3">
        <FiltersBar />
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-black/60">Loading rooms...</div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-10 text-black/60">
          No rooms match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* 🏠 Left: property cards */}
          <div className="lg:col-span-2">
            <PropertyGrid items={filteredRooms} />
          </div>

          {/* 🗺️ Right: interactive map */}
          <div className="sticky top-24 h-[100vh]">
            <Map items={filteredRooms} />
          </div>
        </div>
      )}
    </div>
  );
}
