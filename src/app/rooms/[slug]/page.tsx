"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useRoom } from "@/hooks/useRooms";
import Badge from "@/components/ui/Badge";
import MiniMap from "@/components/MiniMap";
import { useCallback, useState } from "react";
import { useStartCheckout } from "@/hooks/useBookings"; // 👈 add this
import ApplyDrawer from "@/components/ApplyDrawer";
import { MessageCircle } from "lucide-react";
import { useStartChatWithRoom } from "@/hooks/useMessagingExtras";
import { useAuth } from "@/providers/AuthProvider";
import SupportButton from "@/components/Support";

export default function RoomDetailPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [applyOpen, setApplyOpen] = useState(false);
  const { data: room, isLoading, error } = useRoom(slug);
  const { isAuthenticated } = useAuth();
  const startWithRoom = useStartChatWithRoom();

  // ✅ Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3500 }),
  ]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // ✅ Local state for dates
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // ✅ Checkout mutation (booking -> stripe session -> redirect)
  const startCheckout = useStartCheckout();

  const handleReserve = async () => {
    if (!room) return;
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    try {
      await startCheckout.mutateAsync({
        room_id: room.id,
        check_in: checkIn, // "YYYY-MM-DD"
        check_out: checkOut, // "YYYY-MM-DD"
      });
      // redirects to Stripe automatically inside the hook
    } catch (e) {
      console.error(e);
      alert("Failed to start checkout. Please try again.");
    }
  };

  if (isLoading)
    return (
      <div className="p-6 text-gray-500 animate-pulse">
        Loading room details...
      </div>
    );
  if (error)
    return <div className="p-6 text-red-600">Failed to load room details.</div>;
  if (!room) return <div className="p-6">Not found.</div>;

  // 🖼️ Combine thumbnail + other images
  const allImages = [
    ...(room.thumbnail
      ? [{ id: 0, image: room.thumbnail, alt_text: room.title }]
      : []),
    ...(room.images || []),
  ];

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* 🏠 MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2">
          {/* 🖼️ Full Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex">
                {allImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative flex-[0_0_100%] h-[400px]"
                  >
                    <Image
                      src={img.image}
                      alt={img.alt_text || room.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Left/Right Controls */}
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2 py-1 text-2xl text-white hover:bg-black/60"
            >
              ‹
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-2 py-1 text-2xl text-white hover:bg-black/60"
            >
              ›
            </button>
          </div>

          {/* TITLE + META */}
          <h1 className="mt-4 text-2xl font-extrabold">{room.title}</h1>
          <p className="mt-1 text-black/70">{room.address}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {room.pets_allowed && <Badge>🐾 Pet friendly</Badge>}
            {room.furnished && <Badge>🛋️ Furnished</Badge>}
            {room.bills_included && <Badge>💡 Bills Included</Badge>}
            {room.parking && <Badge>🚗 Parking</Badge>}
            <Badge>{room.property_type.name}</Badge>
            <Badge>⭐ {room.average_rating?.toFixed(1)} rating</Badge>
          </div>

          <p className="mt-4 text-black/80 leading-relaxed">
            {room.description}
          </p>

          {/* INFO CARDS */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="card p-4">
              <h3 className="font-bold">Property Details</h3>
              <ul className="mt-2 space-y-1 text-sm text-black/80">
                <li>🏠 Type: {room.property_type.name}</li>
                <li>🛏️ Bedrooms: {room.bedrooms}</li>
                <li>🛁 Bathrooms: {room.bathrooms}</li>
                <li>📏 Size: {room.size} m²</li>
                <li>📅 Tenure: {room.tenure}</li>
              </ul>
            </div>

            <div className="card p-4">
              <h3 className="font-bold">Additional Info</h3>
              <ul className="mt-2 space-y-1 text-sm text-black/80">
                <li>🧾 Bills Included: {room.bills_included ? "Yes" : "No"}</li>
                <li>🐾 Pets Allowed: {room.pets_allowed ? "Yes" : "No"}</li>
                <li>🛋️ Furnished: {room.furnished ? "Yes" : "No"}</li>
                <li>🚗 Parking: {room.parking ? "Available" : "No"}</li>
                <li>
                  🕒 Last Updated:{" "}
                  {new Date(room.updated_at).toLocaleDateString()}
                </li>
              </ul>
            </div>
          </div>

          {/* 🗺️ Mini Map */}
          {room.coordinates && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-bold">Location</h3>
              {typeof room.coordinates === "string" ? (
                (() => {
                  const [lat, lng] = room.coordinates.split(",").map(Number);
                  return <MiniMap lat={lat} lng={lng} title={room.title} />;
                })()
              ) : (
                <MiniMap
                  lat={room.coordinates.lat}
                  lng={room.coordinates.lng}
                  title={room.title}
                />
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside>
          <div className="card sticky top-24 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-extrabold">
                  ${room.price_per_month}
                  <span className="text-sm font-normal text-black/60">
                    {" "}
                    /month
                  </span>
                </div>
                <div className="text-sm text-black/60">
                  Location: {room.address}
                </div>
              </div>
              <div className="badge bg-yellow-200 text-black">
                {room.property_type.name}
              </div>
            </div>

            {/* Simple date pickers */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-black/60">Check-in</label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-black/60">Check-out</label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <button
              className="btn btn-primary mt-3 w-full"
              onClick={handleReserve}
              disabled={startCheckout.isPending}
            >
              {startCheckout.isPending
                ? "Redirecting to Stripe..."
                : "Reserve with Deposit"}
            </button>

            <button
              className="btn btn-outline mt-2 w-full"
              onClick={() => setApplyOpen(true)}
            >
              Apply / Screening
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

      {/* EXTRA SECTIONS */}
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-4">
          <h3 className="font-bold">Average Rating</h3>
          <p className="mt-2 text-sm text-black/80">
            {room.average_rating
              ? `${room.average_rating}/5`
              : "No ratings yet"}
          </p>
        </div>

        <div className="card p-4">
          <h3 className="font-bold">Availability</h3>
          <p className="mt-2 text-sm text-black/80">Available now ✅</p>
        </div>
      </div>
      <ApplyDrawer
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        roomId={room.id}
        roomTitle={room.title}
      />
    </div>
  );
}
