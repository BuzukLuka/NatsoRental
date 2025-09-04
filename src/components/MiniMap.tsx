/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Next.js + Leaflet marker icon fix
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MiniMap({
  lat,
  lng,
  title,
  height = 220,
  zoom = 14,
}: {
  lat: number;
  lng: number;
  title: string;
  height?: number;
  zoom?: number;
}) {
  const center = [lat, lng] as [number, number];

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
      <div className="px-3 py-2 text-sm font-semibold">Location</div>
      <div style={{ height }}>
        {/* center/zoom дээр тип маргаан үүсгэхээс сэргийлж any каст хийв */}
        <MapContainer
          {...({ center, zoom } as any)}
          scrollWheelZoom={false}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
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
