"use client";
import FiltersBar from "@/components/FiltersBar";
import PropertyGrid from "@/components/PropertyGrid";
import Map from "@/components/Map";
import { useStore } from "@/lib/store";
import { useMemo } from "react";

export default function BrowsePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { properties, filters } = useStore();

  const items = useMemo(() => {
    return properties.filter((p) => {
      if (
        filters.q &&
        !`${p.title} ${p.neighborhood}`
          .toLowerCase()
          .includes(filters.q.toLowerCase())
      )
        return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.tenure && p.tenure !== filters.tenure) return false;
      if (filters.priceMin && p.priceMonthly < filters.priceMin) return false;
      if (filters.priceMax && p.priceMonthly > filters.priceMax) return false;
      if (filters.pets && !p.pets) return false;
      return true;
    });
  }, [properties, filters]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-3">
        <FiltersBar />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PropertyGrid items={items} />
        </div>
        <div>
          <Map items={items} />
        </div>
      </div>
    </div>
  );
}
