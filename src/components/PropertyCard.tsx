import Image from "next/image";
import Link from "next/link";
import Badge from "./ui/Badge";
import type { Property } from "@/types";

export default function PropertyCard({ p }: { p: Property }) {
  return (
    <div className="card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative h-44 w-full">
        <Image src={p.image} alt={p.title} fill className="object-cover" />
        <div className="absolute left-2 top-2">
          <span className="badge bg-white/90">{p.neighborhood}</span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="font-bold">{p.title}</div>
          <div className="text-sm">
            <strong>${p.priceMonthly}</strong>/mo
          </div>
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-black/70">
          <span>{p.roomType}</span>
          <span>· {p.tenure}</span>
          {p.pets && <Badge>🐾 Pets</Badge>}
        </div>
        <Link href={`/room/${p.id}`} className="btn btn-outline mt-3 w-full">
          View
        </Link>
      </div>
    </div>
  );
}
