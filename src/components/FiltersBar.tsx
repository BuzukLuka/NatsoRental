"use client";

import React, { useMemo } from "react";
import { useStore } from "@/lib/store";
import type { Filters } from "@/types";

export default function FiltersBar() {
  const { filters, setFilters } = useStore();

  // Helper to update filters with type safety
  const updateFilters = (patch: Partial<Filters>) => {
    setFilters({ ...filters, ...patch });
  };

  // Pets handlers (keeps original behavior)
  const handlePetsAllowedChange = (checked: boolean) => {
    updateFilters({
      petsAllowed: checked ? true : undefined,
      noPets: checked ? undefined : filters.noPets,
    });
  };

  const handleNoPetsChange = (checked: boolean) => {
    updateFilters({
      noPets: checked ? true : undefined,
      petsAllowed: checked ? undefined : filters.petsAllowed,
    });
  };

  // Slider bounds & step (adjust to your market)
  const MIN_PRICE = 0;
  const MAX_PRICE = 2000;
  const STEP = 25;

  // Local values pulled from store (fall back to extremes if undefined)
  const priceMin = filters.priceMin ?? MIN_PRICE;
  const priceMax = filters.priceMax ?? MAX_PRICE;

  // Ensure local values always valid: min <= max
  const safeMin = Math.min(Math.max(priceMin, MIN_PRICE), MAX_PRICE);
  const safeMax = Math.min(Math.max(priceMax, MIN_PRICE), MAX_PRICE);

  // Visual percent positions for background fill
  const minPercent = useMemo(
    () => Math.round(((safeMin - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100),
    [safeMin]
  );
  const maxPercent = useMemo(
    () => Math.round(((safeMax - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100),
    [safeMax]
  );

  // When a thumb moves, clamp and update store immediately
  const onMinChange = (value: number) => {
    const newMin = Math.min(value, safeMax); // don't allow min > current max
    updateFilters({ priceMin: newMin });
  };

  const onMaxChange = (value: number) => {
    const newMax = Math.max(value, safeMin); // don't allow max < current min
    updateFilters({ priceMax: newMax });
  };

  return (
    <div className="w-full">
      {/* big pill container */}
      <div className="mx-auto max-w-5xl rounded-3xl bg-white/95 drop-shadow-xl border border-white/60 p-3">
        <div className="flex items-center gap-3 px-2">
          {/* prominent search input */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-full">
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm placeholder-gray-400 focus:outline-none focus:shadow-sm"
                placeholder="Search (neighbourhood, address or building)"
                value={filters.q ?? ""}
                onChange={(e) =>
                  updateFilters({ q: e.target.value || undefined })
                }
              />
            </div>
          </div>

          {/* compact selects */}
          <div className="hidden sm:flex gap-2">
            <select
              className="h-12 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none"
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

            <select
              className="h-12 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none"
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
              <option value="shared_bath_kitchen">Shared bath & kitchen</option>
              <option value="private_bathroom">Private bathroom</option>
              <option value="single_person">Single person</option>
              <option value="two_people">Two people</option>
            </select>

            <select
              className="h-12 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none"
              value={filters.tenure ?? ""}
              onChange={(e) =>
                updateFilters({
                  tenure: (e.target.value || undefined) as Filters["tenure"],
                })
              }
            >
              <option value="">Tenure</option>
              <option value="try">Try out — &lt;6 months</option>
              <option value="mid">Mid — 6 months</option>
              <option value="long">Long — &gt;6 months</option>
            </select>

            <select
              className="h-12 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none"
              value={filters.monthlyRange ?? ""}
              onChange={(e) =>
                updateFilters({ monthlyRange: e.target.value || undefined })
              }
            >
              <option value="">Monthly</option>
              <option value="upto_600">Up to 600</option>
              <option value="600_800">600 - 800</option>
              <option value="800_1200">800 - 1200</option>
              <option value="1200_plus">1200+</option>
            </select>
          </div>

          {/* slider + pets */}
          <div className="flex flex-col gap-2 items-end">
            {/* numeric labels above slider */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-600">
                Min: <strong>{safeMin} CAD</strong>
              </div>
              <div className="text-xs text-gray-600">
                Max: <strong>{safeMax} CAD</strong>
              </div>
            </div>

            {/* slider container */}
            <div className="w-64 relative">
              {/* background rail */}
              <div className="h-2 rounded-full bg-gray-200" />

              {/* filled range (positioned by inline style) */}
              <div
                className="absolute top-0 left-0 h-2 rounded-full bg-blue-500"
                style={{
                  left: `${minPercent}%`,
                  width: `${Math.max(0, maxPercent - minPercent)}%`,
                }}
              />

              {/* two overlapping range inputs */}
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={STEP}
                value={safeMin}
                onChange={(e) => onMinChange(Number(e.target.value))}
                className="pointer-events-auto absolute top-0 left-0 h-2 w-full appearance-none bg-transparent"
                style={{ zIndex: safeMin <= safeMax ? 20 : 10 }}
                aria-label="Minimum price"
              />
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={STEP}
                value={safeMax}
                onChange={(e) => onMaxChange(Number(e.target.value))}
                className="pointer-events-auto absolute top-0 left-0 h-2 w-full appearance-none bg-transparent"
                style={{ zIndex: 30 }}
                aria-label="Maximum price"
              />
            </div>

            {/* pets checkbox */}
            <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={filters.petsAllowed === true}
                onChange={(e) => handlePetsAllowedChange(e.target.checked)}
              />
              <span className="text-sm">Pets allowed</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
