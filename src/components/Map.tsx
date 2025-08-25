"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import type { Property } from "@/types";

const MapContainer = dynamic(async () => (await import("react-leaflet")).MapContainer, { ssr: false });
const TileLayer     = dynamic(async () => (await import("react-leaflet")).TileLayer,     { ssr: false });
const Marker        = dynamic(async () => (await import("react-leaflet")).Marker,        { ssr: false });
const Popup         = dynamic(async () => (await import("react-leaflet")).Popup,         { ssr: false });

// Leaflet CSS is safe to import globally
import "leaflet/dist/leaflet.css";

export default function Map({ items }: { items: Property[] }) {
  useEffect(() => {
    // dynamically import leaflet and patch icon URLs on client only
    import("leaflet").then(L => {
      import("leaflet/dist/images/marker-icon.png").then(icon => {
        import("leaflet/dist/images/marker-icon-2x.png").then(icon2x => {
          import("leaflet/dist/images/marker-shadow.png").then(shadow => {
            L.Icon.Default.mergeOptions({
              iconUrl: (icon as any).default ?? icon,
              iconRetinaUrl: (icon2x as any).default ?? icon2x,
              shadowUrl: (shadow as any).default ?? shadow,
            });
          });
        });
      });
    });
  }, []);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-black/10">
      {/* @ts-expect-error async component */}
      <MapContainer center={[51.0447, -114.0719]} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // @ts-expect-error react-leaflet typing quirk
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        {items
          .filter(p => typeof p.lat === "number" && typeof p.lng === "number")
          .map(p => (
            <Marker key={p.id} position={[p.lat, p.lng]}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-black/70">{p.neighborhood}</div>
                  <div className="mt-1">
                    <strong>${p.priceMonthly}</strong> / month
                  </div>
                  <a
                    href={`/room/${p.id}`}
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
