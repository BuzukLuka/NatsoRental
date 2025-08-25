"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "@/lib/store";
import Badge from "@/components/ui/Badge";

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getPropertyById } = useStore();
  const p = getPropertyById(id);
  if (!p) return <div className="p-6">Not found.</div>;

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative h-[380px] w-full overflow-hidden rounded-2xl">
            <Image src={p.image} alt={p.title} fill className="object-cover" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">{p.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.pets && <Badge>🐾 Pet friendly</Badge>}
            <Badge>🧹 Cleaning {p.cleaning}</Badge>
            <Badge>📶 Wi‑Fi {p.wifi}</Badge>
            <Badge>🛏️ {p.roomType}</Badge>
          </div>
          <p className="mt-4 text-black/80">{p.description}</p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="card p-4">
              <h3 className="font-bold">House Rules</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-black/80">
                {p.rules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="card p-4">
              <h3 className="font-bold">Common Areas & Orientation</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-black/80">
                <li>Kitchen access: {p.common.kitchen ? "Yes" : "No"}</li>
                <li>Laundry: {p.common.laundry ? "On-site" : "Nearby"}</li>
                <li>Parking: {p.common.parking ? "Available" : "Street"}</li>
              </ul>
            </div>
          </div>
        </div>

        <aside>
          <div className="card sticky top-24 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-extrabold">
                  ${p.priceMonthly}{" "}
                  <span className="text-sm font-normal text-black/60">
                    /month
                  </span>
                </div>
                <div className="text-sm text-black/60">
                  Deposit: ${p.deposit}
                </div>
              </div>
              <div className="badge">{p.tenure}</div>
            </div>
            <button
              className="btn btn-primary mt-4 w-full"
              onClick={() => router.push(`/apply/${p.id}`)}
            >
              Apply / Screening
            </button>
            <button
              className="btn btn-outline mt-2 w-full"
              onClick={() => router.push(`/reservation/${p.id}`)}
            >
              Reserve with Deposit
            </button>
            <div className="mt-4 rounded-xl bg-yellow-50 p-3 text-sm">
              <strong>Penalties & Deposit:</strong>
              <ul className="ml-5 list-disc">
                <li>Lost key: $80 deducted</li>
                <li>Late rent: $25 fee</li>
                <li>Damage: assessed post inspection</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Info sections */}
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-4">
          <h3 className="font-bold">Wi‑Fi Details</h3>
          <p className="mt-2 text-sm text-black/80">
            Provider: {p.wifiVendor} · Speed: {p.wifi}
          </p>
        </div>
        <div className="card p-4">
          <h3 className="font-bold">Services</h3>
          <p className="mt-2 text-sm text-black/80">{p.services.join(", ")}</p>
        </div>
        <div className="card p-4">
          <h3 className="font-bold">Availability</h3>
          <p className="mt-2 text-sm text-black/80">
            {p.availableNow ? "Available now" : `Next: ${p.nextAvailable}`}
          </p>
        </div>
      </div>
    </div>
  );
}
