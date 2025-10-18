"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useApp } from "@/providers/AppProvider";
import type { Filters } from "@/types";

/** Calgary routes (edit freely). `value` can map to your backend `cityArea` codes. */
const CALGARY_ROUTES = [
  { label: "Calgary — Downtown (any)", value: "calgary_downtown" },
  { label: "Downtown SW", value: "calgary_downtown_sw" },
  { label: "Downtown SE", value: "calgary_downtown_se" },
  { label: "Downtown NE", value: "calgary_downtown_ne" },
  { label: "Downtown NW", value: "calgary_downtown_nw" },
  // Add more: Beltline, Eau Claire, Mission, Kensington, etc.
];

export default function PadsplitStyleSearch() {
  const { filters, setFilters, refreshRooms } = useApp();

  // Single input state = the only visible control
  const [q, setQ] = useState<string>(filters.q ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0); // keyboard highlight

  const inputRef = useRef<HTMLInputElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  // Filter Calgary routes by typed keyword (case-insensitive)
  const routeMatches = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return CALGARY_ROUTES;
    return CALGARY_ROUTES.filter((r) =>
      r.label.toLowerCase().includes(text)
    );
  }, [q]);

  // Click outside to close the dropdown
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!popRef.current || !inputRef.current) return;
      if (popRef.current.contains(t) || inputRef.current.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Apply text search (Enter)
  const applyKeyword = () => {
    const next: Filters = {
      ...filters,
      q: q || undefined,
      // keep the rest as-is; single-input UI means no other visible controls
    };
    setFilters(next);
    refreshRooms();
    setOpen(false);
  };

  // Selecting a route applies cityArea (internally) while keeping a human label in q
  const chooseRoute = (idx: number) => {
    const r = routeMatches[idx];
    if (!r) return;
    setQ(r.label); // keep a nice label in the input
    const next: Filters = {
      ...filters,
      q: r.label, // useful if backend also searches across metadata
      cityArea: r.value, // the actual filter used server-side
    };
    setFilters(next);
    refreshRooms();
    setOpen(false);
  };

  // Clear search
  const clearAll = () => {
    setQ("");
    const next: Filters = {
      ...filters,
      q: undefined,
      cityArea: undefined,
    };
    setFilters(next);
    refreshRooms();
    setActiveIndex(0);
    setOpen(false);
  };

  // Keyboard UX for the dropdown
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) =>
        Math.min(i + 1, Math.max(routeMatches.length - 1, 0))
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (routeMatches.length) {
        chooseRoute(activeIndex);
      } else {
        applyKeyword();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Single search input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search (e.g., “Downtown SW” or a keyword)…"
          className="w-full px-4 py-3 pr-24 rounded-xl border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true); // show routes as you type/click
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />

        {/* Right-side buttons inside the input */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {q && (
            <button
              onClick={clearAll}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Clear"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={applyKeyword}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all"
            title="Search"
            type="button"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        {/* Calgary routes popover */}
        {open && (
          <div
            ref={popRef}
            className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
              Calgary Routes
            </div>

            {routeMatches.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No matching routes. Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-200">Enter</kbd> to search by keyword.
              </div>
            ) : (
              <ul role="listbox" className="max-h-72 overflow-auto">
                {routeMatches.map((r, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <li
                      key={r.value}
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseDown={(e) => {
                        // prevent input blur before click handler
                        e.preventDefault();
                        chooseRoute(idx);
                      }}
                      className={`px-4 py-3 cursor-pointer flex items-center justify-between ${
                        active ? "bg-blue-50" : "bg-white"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <span className="text-sm text-gray-900">{r.label}</span>
                      <span className="text-xs text-gray-500">{r.value}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
              <div>
                <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200">↑</kbd>{" "}
                <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200">↓</kbd>{" "}
                to navigate • <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200">Enter</kbd> to select
              </div>
              <button
                className="text-blue-600 hover:underline"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyKeyword();
                }}
              >
                Search “{q || "all"}”
              </button>
            </div>
          </div>
        )}
      </div>

      {/* (Optional) Tiny helper text */}
      <div className="mt-2 text-xs text-gray-500">
        Tip: Click the box to browse Calgary routes, or type to search by keyword.
      </div>
    </div>
  );
}
