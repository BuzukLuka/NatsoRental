"use client";

import { useStore } from "@/lib/store";
import type { Filters } from "@/types";
import React from "react";

export default function FiltersBar() {
  const { filters, setFilters } = useStore();

  // Helper function to update filters with type safety
  const updateFilters = (patch: Partial<Filters>) => {
    setFilters({ ...filters, ...patch });
  };

  // Handle mutually exclusive pet checkboxes
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

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {/* Search Input */}
        <input
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search"
          value={filters.q ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFilters({ q: e.target.value || undefined })
          }
        />

        {/* City / Area Select */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.cityArea ?? ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            updateFilters({ cityArea: e.target.value || undefined })
          }
        >
          <option value="">City / Area</option>
          <option value="calgary_downtown">Calgary — Downtown (any)</option>
          <option value="calgary_downtown_sw">Calgary — Downtown SW</option>
          <option value="calgary_downtown_se">Calgary — Downtown SE</option>
          <option value="calgary_downtown_ne">Calgary — Downtown NE</option>
          <option value="calgary_downtown_nw">Calgary — Downtown NW</option>
        </select>

        {/* Type Select */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.type ?? ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
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

        {/* Tenure Select */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.tenure ?? ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            updateFilters({
              tenure: (e.target.value || undefined) as Filters["tenure"],
            })
          }
        >
          <option value="">Tenure</option>
          <option value="try">Try out — Less than 6 months</option>
          <option value="mid">Mid-term — 6 months</option>
          <option value="long">Long-term — more than 6 months</option>
        </select>

        {/* Monthly Rental Range Select */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.monthlyRange ?? ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            updateFilters({ monthlyRange: e.target.value || undefined })
          }
        >
          <option value="">Monthly rental</option>
          <option value="upto_600">Up to 600 CAD</option>
          <option value="600_800">600 - 800 CAD</option>
          <option value="800_1200">800 - 1200 CAD</option>
          <option value="1200_plus">More than 1200 CAD</option>
        </select>

        {/* Price Min Input */}
        <input
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Min (CAD)"
          value={filters.priceMin ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFilters({
              priceMin: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />

        {/* Price Max Input */}
        <input
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Max (CAD)"
          value={filters.priceMax ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFilters({
              priceMax: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />

        {/* Pets Checkboxes */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="pets-allowed"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={filters.petsAllowed === true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handlePetsAllowedChange(e.target.checked)
            }
          />
          <label htmlFor="pets-allowed" className="text-sm text-gray-700">
            Pets allowed
          </label>
        </div>
      </div>
    </div>
  );
}
