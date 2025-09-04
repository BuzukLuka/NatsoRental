"use client";

import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Property } from "@/types";

export default function WishlistButton({ p }: { p: Property }) {
  const store = useStore();
  const isOn = store.isWishlisted(p.id);

  return (
    <button
      aria-label={isOn ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); // картын нэвтрэлтээс сэргийлнэ
        store.toggleWishlist(p);
      }}
      className="inline-flex items-center rounded-full bg-white/90 p-2 shadow backdrop-blur transition hover:bg-white"
    >
      <Heart
        className={`h-5 w-5 ${
          isOn ? "fill-red-500 text-red-500" : "text-black/70"
        }`}
      />
    </button>
  );
}
