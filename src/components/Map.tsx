"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import type { Property } from "@/types";
import "leaflet/dist/leaflet.css";

// Dynamic imports (types-аа any болгож зөрчлийг дарна)
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

export default function Map({ items }: { items: Property[] }) {
  useEffect(() => {
    // Leaflet marker icon-ы замыг зөв болгоно (client only)
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

  const center: [number, number] = [51.0447, -114.0719];

  return (
    // isolate + z-0 => Map нь header-ийг давж гарч харагдахгүй
    <div className="relative isolate z-0 h-[420px] w-full overflow-hidden rounded-2xl border border-black/10">
      <MapContainer center={center} zoom={12} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        {items
          .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
          .map((p) => (
            <Marker key={p.id} position={[p.lat as number, p.lng as number]}>
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
