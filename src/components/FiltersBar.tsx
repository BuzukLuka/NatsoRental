"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useApp } from "@/providers/AppProvider";
import type { Filters } from "@/types";

type G = typeof google;
type Prediction = google.maps.places.AutocompletePrediction;

const CALGARY_CENTER = { lat: 51.0447, lng: -114.0719 };
const CALGARY_RADIUS_M = 25_000;

const debounce = <F extends (...args: any[]) => void>(fn: F, ms = 250) => {
  let t: any;
  return (...args: Parameters<F>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

function waitForGooglePlaces(): Promise<G> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).google?.maps?.places) {
      resolve((window as any).google);
      return;
    }
    let waited = 0;
    const iv = setInterval(() => {
      waited += 100;
      if ((window as any).google?.maps?.places) {
        clearInterval(iv);
        resolve((window as any).google);
      } else if (waited > 10_000) {
        clearInterval(iv);
        reject(new Error("Google Places failed to load within 10s."));
      }
    }, 100);
  });
}

export default function PadsplitStyleSearch() {
  const { filters, setFilters, refreshRooms } = useApp();

  const [q, setQ] = useState<string>(filters.q ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [g, setG] = useState<G | null>(null);
  const [svc, setSvc] = useState<google.maps.places.AutocompleteService | null>(null);
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loadingPreds, setLoadingPreds] = useState(false);
  const [error, setError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    waitForGooglePlaces()
      .then((gg) => {
        if (!mounted) return;
        console.log("✅ Google Places loaded successfully");
        setG(gg);
        setSvc(new gg.maps.places.AutocompleteService());
        setSessionToken(new gg.maps.places.AutocompleteSessionToken());
        setError("");
      })
      .catch((err) => {
        console.error("❌ Google Places failed to load:", err);
        setError("Google Places API not available. Using keyword search only.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const routeMatches = useMemo(() => predictions, [predictions]);

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

  const applyKeyword = () => {
    const next: Filters = {
      ...filters,
      q: q || undefined,
    };
    setFilters(next);
    refreshRooms();
    setOpen(false);
  };

  const choosePrediction = (idx: number) => {
    const p = routeMatches[idx];
    if (!p) return;
    setQ(p.description);

    const next: Filters = {
      ...filters,
      q: p.description,
    };

    setFilters(next);
    refreshRooms();
    setOpen(false);

    if (g) {
      setSessionToken(new g.maps.places.AutocompleteSessionToken());
    }
  };

  const clearAll = () => {
    setQ("");
    setPredictions([]);
    const next: Filters = {
      ...filters,
      q: undefined,
    };
    setFilters(next);
    refreshRooms();
    setActiveIndex(0);
    setOpen(false);
  };

  const fetchPredictions = React.useMemo(
    () =>
      debounce((text: string) => {
        if (!svc || !g) {
          console.log("⚠️ Service or Google not ready");
          setPredictions([]);
          return;
        }
        const trimmed = text.trim();
        if (!trimmed) {
          setPredictions([]);
          return;
        }

        console.log("🔍 Fetching predictions for:", trimmed);
        setLoadingPreds(true);

        const request: google.maps.places.AutocompletionRequest = {
          input: trimmed,
          componentRestrictions: { country: "ca" },
          sessionToken: sessionToken ?? undefined,
          location: new g.maps.LatLng(CALGARY_CENTER.lat, CALGARY_CENTER.lng),
          radius: CALGARY_RADIUS_M,
        };

        svc.getPlacePredictions(request, (res, status) => {
          setLoadingPreds(false);

          console.log("📊 Predictions status:", status);
          console.log("📊 Predictions result:", res);

          if (status !== g.maps.places.PlacesServiceStatus.OK) {
            console.warn("⚠️ Places API status:", status);
            if (status === g.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              setPredictions([]);
            }
            return;
          }

          if (!res || res.length === 0) {
            setPredictions([]);
            return;
          }

          const ranked = res
            .slice(0)
            .sort((a, b) => {
              const aCal = a.structured_formatting?.secondary_text
                ?.toLowerCase()
                .includes("calgary")
                ? 1
                : 0;
              const bCal = b.structured_formatting?.secondary_text
                ?.toLowerCase()
                .includes("calgary")
                ? 1
                : 0;
              return bCal - aCal;
            })
            .slice(0, 8);

          console.log("✅ Setting predictions:", ranked.length);
          setPredictions(ranked);
        });
      }, 300),
    [svc, g, sessionToken]
  );

  useEffect(() => {
    if (!open) return;
    fetchPredictions(q);
  }, [q, open, fetchPredictions]);

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
        choosePrediction(activeIndex);
      } else {
        applyKeyword();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="w-full relative">
      {error && (
        <div className="mb-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          {error}
        </div>
      )}

      <div className="relative z-[100]">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Calgary areas e.g. Downtown SW or any keyword…"
          className="w-full px-4 py-3 pr-24 rounded-xl border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-[101]">
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
            disabled={loadingPreds}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        {open && (
          <div
            ref={popRef}
            className="absolute z-[200] mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
              {g ? "Calgary Areas (Google Places)" : "Loading Google Places…"}
            </div>

            {(!g || loadingPreds) && (
              <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
            )}

            {g && !loadingPreds && routeMatches.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No matching places. Press{" "}
                <kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-200">
                  Enter
                </kbd>{" "}
                to search by keyword.
              </div>
            ) : null}

            {g && !loadingPreds && routeMatches.length > 0 && (
              <ul role="listbox" className="max-h-72 overflow-auto">
                {routeMatches.map((p, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <li
                      key={p.place_id}
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        choosePrediction(idx);
                      }}
                      className={`px-4 py-3 cursor-pointer flex items-center justify-between ${
                        active ? "bg-blue-50" : "bg-white"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <span className="text-sm text-gray-900">
                        {p.structured_formatting?.main_text || p.description}
                      </span>
                      <span className="text-xs text-gray-500">
                        {p.structured_formatting?.secondary_text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
              <div>
                <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200">
                  ↑
                </kbd>{" "}
                <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200">
                  ↓
                </kbd>{" "}
                to navigate •{" "}
                <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200">
                  Enter
                </kbd>{" "}
                to select
              </div>
              <button
                className="text-blue-600 hover:underline"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyKeyword();
                }}
              >
                Search "{q || "all"}"
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Tip: Start typing a Calgary neighborhood/route (e.g., "Downtown SW"),
        then press Enter or pick from the list.
      </div>
    </div>
  );
}