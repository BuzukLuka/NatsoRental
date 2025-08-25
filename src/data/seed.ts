import type { Property } from "@/types";

const neighborhoods = [
  "Beltline",
  "Kensington",
  "Inglewood",
  "Brentwood",
  "Mission",
  "Sunalta",
  "Hillhurst",
  "Eau Claire",
  "Downtown West",
  "Capitol Hill",
];

// Rough centroids for Calgary neighborhoods (approximate)
const HOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  Beltline: { lat: 51.041, lng: -114.071 },
  Kensington: { lat: 51.054, lng: -114.088 },
  Inglewood: { lat: 51.041, lng: -114.028 },
  Brentwood: { lat: 51.087, lng: -114.133 },
  Mission: { lat: 51.031, lng: -114.07 },
  Sunalta: { lat: 51.045, lng: -114.093 },
  Hillhurst: { lat: 51.059, lng: -114.09 },
  "Eau Claire": { lat: 51.053, lng: -114.07 },
  "Downtown West": { lat: 51.047, lng: -114.087 },
  "Capitol Hill": { lat: 51.073, lng: -114.101 },
};

const imgs = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1507086189233-bff3de22a4f0",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
];

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

export function generateSeed(): Property[] {
  const list: Property[] = [];
  for (let i = 1; i <= 50; i++) {
    const hood = pick(neighborhoods, i);
    const tenure = i % 2 === 0 ? "mid" : "long";
    const type = (i % 3 === 0 ? "house" : "apartment") as Property["type"];
    const roomType = (
      i % 5 === 0 ? "Studio" : i % 2 === 0 ? "Master room" : "Private room"
    ) as Property["roomType"];
    const price = 750 + (i % 10) * 50;

    // small jitter so markers don’t perfectly overlap
    const jitter = () => (Math.random() - 0.5) * 0.004; // ~400m

    const { lat, lng } = HOOD_COORDS[hood] || { lat: 51.0447, lng: -114.0719 }; // Calgary center fallback

    list.push({
      id: String(i),
      title: `${hood} ${roomType}`,
      description: `Comfortable ${roomType.toLowerCase()} in ${hood}, Calgary. Close to transit and amenities.`,
      image: pick(imgs, i) + "?auto=format&fit=crop&w=1200&q=60",
      neighborhood: hood,
      priceMonthly: price,
      deposit: Math.round(price * 0.5),
      tenure,
      type,
      roomType,
      pets: i % 4 === 0,
      wifi: i % 3 === 0 ? "1 Gbps" : "300 Mbps",
      wifiVendor: i % 2 === 0 ? "Shaw" : "TELUS",
      cleaning: i % 3 === 0 ? "biweekly" : "monthly",
      rules: [
        "No smoking indoors",
        "Respect quiet hours 10pm–7am",
        "Keep common areas clean",
      ],
      services: ["Support", "Orientation", "Cleaning"],
      availableNow: i % 3 !== 0,
      nextAvailable: "2025-09-01",
      common: { kitchen: true, laundry: true, parking: i % 2 === 0 },

      // NEW
      lat: lat + jitter(),
      lng: lng + jitter(),

      // legacy fields (safe to remove if not used elsewhere)
      mapX: 10 + ((i * 7) % 80),
      mapY: 15 + ((i * 11) % 70),
    });
  }
  return list;
}
