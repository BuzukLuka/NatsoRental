"use client";
import React, { useState } from "react";
import { useStore } from "@/lib/store";
import type { Filters } from "@/types";
import { Range } from "react-range";
import { Search } from "lucide-react";

export default function FiltersBar() {
  const { filters, setFilters } = useStore();
  const [pendingFilters, setPendingFilters] = useState(filters);

  const updatePending = (patch: Partial<Filters>) => {
    setPendingFilters({ ...pendingFilters, ...patch });
  };

  const handlePetsAllowedChange = (checked: boolean) => {
    updatePending({
      petsAllowed: checked ? true : undefined,
      noPets: checked ? undefined : filters.noPets,
    });
  };

  const handleSearch = () => {
    setFilters(pendingFilters);
  };

  return (
    <div className="w-full bg-white shadow-xl rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row md:flex-wrap gap-4 items-center justify-between">
      {/* Search Field */}
      <div className="flex-1 min-w-[200px] relative">
        <input
          type="text"
          placeholder="Search by keyword..."
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={pendingFilters.q ?? ""}
          onChange={(e) => updatePending({ q: e.target.value || undefined })}
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-all"
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {/* City / Area */}
      <div className="flex-1 min-w-[160px]">
        <select
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500"
          value={pendingFilters.cityArea ?? ""}
          onChange={(e) =>
            updatePending({ cityArea: e.target.value || undefined })
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
      <div className="flex-1 min-w-[160px]">
        <select
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500"
          value={pendingFilters.type ?? ""}
          onChange={(e) =>
            updatePending({
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
      <div className="flex-1 min-w-[140px]">
        <select
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500"
          value={pendingFilters.tenure ?? ""}
          onChange={(e) =>
            updatePending({
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
      <div className="flex-1 min-w-[140px]">
        <select
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500"
          value={pendingFilters.monthlyRange ?? ""}
          onChange={(e) =>
            updatePending({ monthlyRange: e.target.value || undefined })
          }
        >
          <option value="">Monthly</option>
          <option value="upto_600">Up to 600 CAD</option>
          <option value="600_800">600 - 800 CAD</option>
          <option value="800_1200">800 - 1200 CAD</option>
          <option value="1200_plus">1200+ CAD</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="flex-1 min-w-[220px]">
        <Range
          step={50}
          min={0}
          max={2000}
          values={[
            pendingFilters.priceMin ?? 0,
            pendingFilters.priceMax ?? 2000,
          ]}
          onChange={(values: number[]) =>
            updatePending({ priceMin: values[0], priceMax: values[1] })
          }
          renderTrack={({ props, children }) => {
            return (
              <div
                {...props}
                className="h-2 bg-gray-200 rounded-full w-full relative"
                style={props.style}
              >
                <div
                  className="absolute h-2 bg-blue-500 rounded-full"
                  style={{
                    left: `${((pendingFilters.priceMin ?? 0) / 2000) * 100}%`,
                    right: `${
                      100 - ((pendingFilters.priceMax ?? 2000) / 2000) * 100
                    }%`,
                  }}
                />
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            return (
              <div
                {...props}
                className="h-5 w-5 rounded-full bg-white border-2 border-blue-600 shadow cursor-pointer"
              />
            );
          }}
        />
        <div className="flex justify-between text-sm text-gray-700 font-medium mt-1">
          <span>Min: {pendingFilters.priceMin ?? 0}</span>
          <span>Max: {pendingFilters.priceMax ?? 2000}</span>
        </div>
      </div>

      {/* Pets */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="pets-allowed"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={pendingFilters.petsAllowed === true}
          onChange={(e) => handlePetsAllowedChange(e.target.checked)}
        />
        <label htmlFor="pets-allowed" className="text-sm text-gray-800">
          Pets allowed
        </label>
      </div>

      {/* Search Button (mobile view visible too) */}
      <div className="w-full md:w-auto flex justify-end mt-2 md:mt-0">
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all w-full md:w-auto"
        >
          Search
        </button>
      </div>
    </div>
  );
}
