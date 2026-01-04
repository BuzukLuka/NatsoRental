"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge from "./ui/Badge";
import WishlistButton from "./WishlistButton";
import { RoomList } from "@/types/api";

export default function PropertyCard({ p }: { p: RoomList }) {
  const router = useRouter();
  const open = () => router.push(`/rooms/${p.slug}`);

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`Open ${p.property_type?.name} at ${p.address} details`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className="card overflow-hidden cursor-pointer transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="relative h-44 w-full">
        <Image
          src={p?.thumbnail ?? "/default-image.jpg"}
          alt={p.property_type?.name}
          fill
          className="object-cover"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <span className="badge bg-white/90">{p.property_type?.name}</span>
          {p.is_taken ? (
            <span className="badge badge-warning text-xs">Booked</span>
          ) : (
            <span className="badge bg-green-100 text-green-800 text-xs border-green-200">
              Available now ✅
            </span>
          )}
        </div>

        {/* ❤️ add/remove */}
        <div className="absolute right-2 top-2">
          <WishlistButton p={p} />
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="font-bold line-clamp-1">{p.address}</div>
          <div className="text-sm shrink-0">
            <strong>${p.price_per_month}</strong>/mo
          </div>
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-black/70">
          <span>{p.property_type?.name}</span>
          <span>· {p.tenure}</span>
          {p.pets_allowed && <Badge>🐾 Pets</Badge>}
        </div>

        {/* View товч дархад картын click ажиллахгүй */}
        <Link
          href={`/rooms/${p.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="btn btn-outline mt-3 w-full"
        >
          View
        </Link>
      </div>
    </div>
  );
}
