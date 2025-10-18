/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { RoomList } from "@/types/api";
import "leaflet/dist/leaflet.css";

// --- Dynamic imports for react-leaflet (client only) ---
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
) as any;
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
) as any;
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
}) as any;
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
}) as any;

export default function Map({ items }: { items: RoomList[] }) {
  const [LRef, setLRef] = useState<any>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      setLRef(L);

      // If you still use image pins somewhere else, keep the default icon fix:
      const [icon, icon2x, shadow] = await Promise.all([
        import("leaflet/dist/images/marker-icon.png"),
        import("leaflet/dist/images/marker-icon-2x.png"),
        import("leaflet/dist/images/marker-shadow.png"),
      ]);
      L.Icon.Default.mergeOptions({
        iconUrl: (icon as any).default ?? icon,
        iconRetinaUrl: (icon2x as any).default ?? icon2x,
        shadowUrl: (shadow as any).default ?? shadow,
      });
    })();
  }, []);

  // Define a type for normalized rooms with coordinates as an object
  type NormalizedRoom = Omit<RoomList, "coordinates"> & {
    coordinates: { lat: number; lng: number };
  };

  // ✅ Normalize coordinates (handle both string & object)
  const normalizedRooms = useMemo(() => {
    return items
      .map((r) => {
        let coords: { lat: number; lng: number } | null = null;

        if (r.coordinates) {
          if (typeof r.coordinates === "string") {
            try {
              coords = JSON.parse(r.coordinates);
            } catch {
              coords = null;
            }
          } else if (
            typeof r.coordinates === "object" &&
            "lat" in r.coordinates &&
            "lng" in r.coordinates
          ) {
            coords = r.coordinates as { lat: number; lng: number };
          }
        }

        return coords
          ? {
              ...r,
              coordinates: coords,
            }
          : null;
      })
      .filter(Boolean) as NormalizedRoom[];
  }, [items]);

  // Default fallback center (Calgary)
  const defaultCenter: [number, number] = [51.0447, -114.0719];

  // Auto-fit to all markers; fallback to default center
  useEffect(() => {
    if (!map || normalizedRooms.length === 0) return;
    const points: [number, number][] = normalizedRooms.map((r) => [
      r.coordinates.lat,
      r.coordinates.lng,
    ]);
    // Leaflet accepts an array of LatLng tuples in fitBounds:
    map.fitBounds(points as any, { padding: [50, 50] });
  }, [map, normalizedRooms]);

  // Create a price tag divIcon
  const priceIcon = (amount: string | number) => {
    if (!LRef) return null;
    // Use inline styles so it renders inside the DivIcon (Tailwind classes won't apply inside HTML string).
    const html = `
      <div style="
        display:inline-flex;align-items:center;justify-content:center;
        padding:6px 10px;border-radius:9999px;
        background:#FFD12E;border:1px solid rgba(0,0,0,.15);
        color:#111;font-weight:700;font-size:12px;line-height:1;
        box-shadow:0 2px 6px rgba(0,0,0,.15);
        transform:translateY(-6px);
        user-select:none;
        ">
        $${amount}
      </div>
    `;
    return LRef.divIcon({
      html,
      className: "", // prevent Leaflet default styles
      iconSize: [0, 0], // let content size itself
      iconAnchor: [20, 20], // tweak to feel centered
      popupAnchor: [0, -16],
    });
  };

  return (
    <div className="relative isolate z-0 w-full overflow-hidden rounded-2xl border border-black/10">
      {/* Bigger, responsive height */}
      <div className="h-[65vh] md:h-[75vh]">
        <MapContainer
          center={defaultCenter}
          zoom={10}
          className="h-full w-full z-0"
          whenCreated={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />

          {/* ✅ Plot backend room markers as PRICE BADGES */}
          {LRef &&
            normalizedRooms.map((r) => (
              <Marker
                key={r.id}
                position={[r.coordinates.lat as number, r.coordinates.lng as number]}
                icon={priceIcon(r.price_per_month) || undefined}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-black/70">
                      {r.property_type?.name || "Room"}
                    </div>
                    <div className="mt-1">
                      <strong>${r.price_per_month}</strong> / month
                    </div>
                    <a
                      href={`/rooms/${r.slug}`}
                      className="mt-2 inline-block rounded-md bg-[var(--brand-yellow)] px-3 py-1 text-xs font-semibold text-black"
                    >
                      View details
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
