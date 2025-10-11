/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
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
  useEffect(() => {
    // Fix marker icon paths after hydration
    (async () => {
      const L = await import("leaflet");
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
  const center: [number, number] =
    normalizedRooms.length > 0
      ? [normalizedRooms[0].coordinates.lat, normalizedRooms[0].coordinates.lng]
      : defaultCenter;

  return (
    <div className="relative isolate z-0 h-[420px] w-full overflow-hidden rounded-2xl border border-black/10">
      <MapContainer center={center} zoom={12} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {/* ✅ Plot backend room markers */}
        {normalizedRooms.map((r) => (
          <Marker
            key={r.id}
            position={[
              r.coordinates.lat as number,
              r.coordinates.lng as number,
            ]}
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
  );
}
