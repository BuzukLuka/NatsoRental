"use client";
import { useStore } from "@/lib/store";

export default function FiltersBar() {
  const { filters, setFilters } = useStore();
  return (
    <div className="card p-3">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <input
          className="input"
          placeholder="Search"
          value={filters.q}
          onChange={(e) => setFilters({ q: e.target.value })}
        />
        <select
          className="select"
          value={filters.type ?? ""}
          onChange={(e) => setFilters({ type: e.target.value as any })}
        >
          <option value="">Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
        </select>
        <select
          className="select"
          value={filters.tenure ?? ""}
          onChange={(e) => setFilters({ tenure: e.target.value as any })}
        >
          <option value="">Tenure</option>
          <option value="mid">Mid‑term</option>
          <option value="long">Long‑term</option>
        </select>
        <input
          className="input"
          type="number"
          placeholder="Min $"
          value={filters.priceMin ?? ""}
          onChange={(e) =>
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
          onChange={(e) =>
            setFilters({
              priceMax: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!filters.pets}
            onChange={(e) => setFilters({ pets: e.target.checked })}
          />
          <span>Pets</span>
        </label>
      </div>
    </div>
  );
}
