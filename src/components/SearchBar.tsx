"use client";
import { useStore } from "@/lib/store";

export default function SearchBar({ variant }: { variant?: "hero" }) {
  const { setFilters, filters } = useStore();
  return (
    <div
      className={`card ${variant === "hero" ? "p-2" : "p-2"} animate-fadeUp`}
    >
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          className="input"
          placeholder="Search Calgary (Beltline, Kensington...)"
          value={filters.q}
          onChange={(e) => setFilters({ q: e.target.value })}
        />
        <button className="btn btn-primary">Search</button>
      </form>
    </div>
  );
}
