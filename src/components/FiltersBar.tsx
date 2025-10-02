"use client";
import React from "react";
import { useStore } from "@/lib/store";
import type { Filters } from "@/types";
import { Range } from "react-range";

export default function FiltersBar() {
  const { filters, setFilters } = useStore();

  const updateFilters = (patch: Partial<Filters>) => {
    setFilters({ ...filters, ...patch });
  };

  const handlePetsAllowedChange = (checked: boolean) => {
    updateFilters({
      petsAllowed: checked ? true : undefined,
      noPets: checked ? undefined : filters.noPets,
    });
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row md:flex-wrap gap-3 items-center justify-between">
      {/* Search */}
      <div className="flex-1 min-w-[120px]">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.q ?? ""}
          onChange={(e) => updateFilters({ q: e.target.value || undefined })}
        />
      </div>

      {/* City / Area */}
      <div className="flex-1 min-w-[140px]">
        <select
          className="w-full px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.cityArea ?? ""}
          onChange={(e) =>
            updateFilters({ cityArea: e.target.value || undefined })
          }
        >
          <option value="">City / Area</option>
          <option value="calgary_downtown">Calgary — Downtown (any)</option>
          <option value="calgary_downtown_sw">Downtown SW</option>
          <option value="calgary_downtown_se">Downtown SE</option>
          <option value="calgary_downtown_ne">Downtown NE</option>
          <option value="calgary_downtown_nw">Downtown NW</option>
        </select>
      </div>

      {/* Type */}
      <div className="flex-1 min-w-[140px]">
        <select
          className="w-full px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.type ?? ""}
          onChange={(e) =>
            updateFilters({
              type: (e.target.value || undefined) as Filters["type"],
            })
          }
        >
          <option value="">Type</option>
          <option value="basement">Basement</option>
          <option value="upstairs">Upstairs</option>
          <option value="shared_bath_kitchen">Shared bathroom & kitchen</option>
          <option value="private_bathroom">Private bathroom</option>
          <option value="single_person">Single person</option>
          <option value="two_people">Two people</option>
        </select>
      </div>

      {/* Tenure */}
      <div className="flex-1 min-w-[120px]">
        <select
          className="w-full px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.tenure ?? ""}
          onChange={(e) =>
            updateFilters({
              tenure: (e.target.value || undefined) as Filters["tenure"],
            })
          }
        >
          <option value="">Tenure</option>
          <option value="try">Try — &lt; 6 months</option>
          <option value="mid">Mid — 6 months</option>
          <option value="long">Long — &gt; 6 months</option>
        </select>
      </div>

      {/* Monthly */}
      <div className="flex-1 min-w-[120px]">
        <select
          className="w-full px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.monthlyRange ?? ""}
          onChange={(e) =>
            updateFilters({ monthlyRange: e.target.value || undefined })
          }
        >
          <option value="">Monthly</option>
          <option value="upto_600">Up to 600 CAD</option>
          <option value="600_800">600 - 800 CAD</option>
          <option value="800_1200">800 - 1200 CAD</option>
          <option value="1200_plus">1200+ CAD</option>
        </select>
      </div>

      {/* Price Slider */}
      <div className="flex-1 min-w-[200px] mt-2 md:mt-0">
        <Range
          step={50}
          min={0}
          max={2000}
          values={[filters.priceMin ?? 0, filters.priceMax ?? 2000]}
          onChange={(values: number[]) =>
            updateFilters({ priceMin: values[0], priceMax: values[1] })
          }
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 bg-gray-200 rounded-full w-full relative"
              style={props.style}
            >
              <div
                className="absolute h-2 bg-blue-500 rounded-full"
                style={{
                  left: `${((filters.priceMin ?? 0) / 2000) * 100}%`,
                  right: `${100 - ((filters.priceMax ?? 2000) / 2000) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-5 w-5 rounded-full bg-white border-2 border-blue-600 shadow-md cursor-pointer focus:outline-none"
            />
          )}
        />
        <div className="flex justify-between text-sm text-gray-700 font-medium mt-1">
          <span>Min: {filters.priceMin ?? 0}</span>
          <span>Max: {filters.priceMax ?? 2000}</span>
        </div>
      </div>

      {/* Pets */}
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        <input
          type="checkbox"
          id="pets-allowed"
          className="h-4 w-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500"
          checked={filters.petsAllowed === true}
          onChange={(e) => handlePetsAllowedChange(e.target.checked)}
        />
        <label htmlFor="pets-allowed" className="text-sm text-gray-800">
          Pets allowed
        </label>
      </div>
    </div>
  );
}
