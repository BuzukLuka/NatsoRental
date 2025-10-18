/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect } from "react";

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

export default function MiniMap({
  lat,
  lng,
  title,
  height = 420,  // ⬆️ taller default
  zoom = 12,     // keep default zoom 12
}: {
  lat: number;
  lng: number;
  title: string;
  height?: number;
  zoom?: number;
}) {
  const center = [lat, lng] as [number, number];

  useEffect(() => {
    // Marker icon paths after hydration
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

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
      <div className="px-3 py-2 text-sm font-semibold">Location</div>
      <div style={{ height }}>
        <MapContainer
          {...({ center, zoom } as any)}
          // 🔓 Unlock interactions
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          zoomControl={true}
          keyboard={true}
          style={{ height: "100%", width: "100%" }}
          attributionControl={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={center as any}>
            <Popup>{title}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
