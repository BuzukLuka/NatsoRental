"use client";

import { Heart } from "lucide-react";
import type { RoomList } from "@/types/api";
import { useApp } from "@/providers/AppProvider";
import { useState } from "react";

export default function WishlistButton({ p }: { p: RoomList }) {
  const { user } = useApp();
  const [wishlisted, setWishlisted] = useState(false);

  // ✅ Future integration: backend wishlist via API
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please log in to add to wishlist.");
      return;
    }

    setWishlisted((prev) => !prev);
    // 🔜 Later: call your backend wishlist endpoint here:
    // await api.post("/wishlist/toggle/", { room: p.id });
  };

  return (
    <button
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      onClick={toggleWishlist}
      className="inline-flex items-center rounded-full bg-white/90 p-2 shadow backdrop-blur transition hover:bg-white"
    >
      <Heart
        className={`h-5 w-5 ${
          wishlisted ? "fill-red-500 text-red-500" : "text-black/70"
        }`}
      />
    </button>
  );
}
