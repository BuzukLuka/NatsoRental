"use client";

import { useStore } from "@/lib/store";
import type { Filters } from "@/types";
import React from "react";

export default function FiltersBar() {
  const { filters, setFilters } = useStore();

  return (
    <div className="card p-3">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <input
          className="input"
          placeholder="Search"
          value={filters.q}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilters({ q: e.target.value })
          }
        />

        <select
          className="select"
          value={filters.type ?? ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFilters({
              type: (e.target.value || undefined) as Filters["type"],
            })
          }
        >
          <option value="">Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
        </select>

        <select
          className="select"
          value={filters.tenure ?? ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFilters({
              tenure: (e.target.value || undefined) as Filters["tenure"],
            })
          }
        >
          <option value="">Tenure</option>
          <option value="mid">Mid-term</option>
          <option value="long">Long-term</option>
        </select>

        <input
          className="input"
          type="number"
          placeholder="Min $"
          value={filters.priceMin ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilters({
              priceMin: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />

        <input
          className="input"
          type="number"
          placeholder="Max $"
          value={filters.priceMax ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilters({
              priceMax: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!filters.pets}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFilters({ pets: e.target.checked })
            }
          />
          <span>Pets</span>
        </label>
      </div>
    </div>
  );
}
