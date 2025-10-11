// src/components/SearchBar.tsx
"use client";

import { useApp } from "@/providers/AppProvider";

export default function SearchBar({ variant }: { variant?: "hero" }) {
  const { filters, setFilters, refreshRooms } = useApp();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refreshRooms(); // хэрэгтэй бол хайлтыг дахин ачаална
  };

  return (
    <div
      className={`card ${variant === "hero" ? "p-2" : "p-2"} animate-fadeUp`}
    >
      <form className="flex items-center gap-2" onSubmit={onSubmit}>
        <input
          className="input"
          placeholder="Search Calgary (Beltline, Kensington...)"
          value={filters.q ?? ""}
          onChange={(e) => setFilters({ q: e.target.value || undefined })}
          aria-label="Search"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
    </div>
  );
}
