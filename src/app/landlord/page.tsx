"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function LandlordPage() {
  const { me, myManaged } = useStore();
  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">
          Landlord · {me?.name ?? "Guest"}
        </h1>
        <Link className="btn btn-primary" href="/landlord/new">
          Add new listing
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {myManaged().map((p) => (
          <div key={p.id} className="card p-4">
            <div className="text-lg font-bold">{p.title}</div>
            <div className="text-sm text-black/70">{p.neighborhood}</div>
            <div className="mt-2 text-sm">
              Availability: {p.availableNow ? "Now" : p.nextAvailable}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
