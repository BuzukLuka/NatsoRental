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

    return rooms.filter((r) => {
      if (filters.q && !r.title.toLowerCase().includes(filters.q.toLowerCase()))
        return false;

      if (filters.type && r.property_type?.name !== filters.type)
        return false;

      if (
        filters.priceMin !== undefined &&
        Number(r.price_per_month) < filters.priceMin
      )
        return false;

      if (
        filters.priceMax !== undefined &&
        Number(r.price_per_month) > filters.priceMax
      )
        return false;

      if (filters.petsAllowed && !r.pets_allowed) return false;

      return true;
    });
  }, [rooms, filters]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-3">
        <FiltersBar />
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-black/60">
          Loading rooms...
        </div>
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
          <div className="sticky top-24 h-[75vh]">
            <Map items={filteredRooms} />
          </div>
        </div>
      )}
    </div>
  );
}
