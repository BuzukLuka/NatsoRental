"use client";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useMyRooms, useDeleteRoom } from "@/hooks/useRooms";
import Link from "next/link";
import Image from "next/image";
import Alert from "@/components/ui/Alert";
import { Trash2, Edit, Eye, Home } from "lucide-react";

export default function LandlordPage() {
  const { user } = useAuth();
  const { data: rooms, isLoading, error } = useMyRooms();
  const deleteRoom = useDeleteRoom();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const isVerified = user?.verified;

  async function handleDelete(slug: string) {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    setDeletingSlug(slug);
    try {
      await deleteRoom.mutateAsync(slug);
    } catch (err) {
      alert("Failed to delete listing");
    } finally {
      setDeletingSlug(null);
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <Alert type="error">Please login to access landlord dashboard.</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Landlord Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome, {user?.first_name || user?.username || "Landlord"}
          </p>
        </div>
        <Link
          href="/landlord/new"
          className="btn btn-primary flex items-center gap-2"
        >
          <Home size={20} />
          Add New Listing
        </Link>
      </div>

      {!isVerified && (
        <Alert type="warning" className="mb-6">
          Your identity is not verified. You must complete verification to create and manage listings.
          <Link href="/profile?tab=identity" className="underline ml-2">
            Verify Now
          </Link>
        </Alert>
      )}

      {error && (
        <Alert type="error" className="mb-6">
          Failed to load your listings. Please try again.
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading your listings...</p>
        </div>
      ) : rooms && rooms.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room: any) => (
            <div
              key={room.id}
              className="card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="relative h-44 w-full">
                {room.thumbnail ? (
                  <Image
                    src={room.thumbnail}
                    alt={room.address || "Property"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <Home size={48} className="text-gray-400" />
                  </div>
                )}

                {/* Property Type Badge */}
                <div className="absolute left-2 top-2">
                  <span className="badge bg-white/90">
                    {room.property_type?.name || "Property"}
                  </span>
                </div>

                {/* Featured Badge */}
                {room.is_featured && (
                  <div className="absolute left-2 top-10">
                    <span className="badge bg-brand-yellow">
                      ⭐ Featured
                    </span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute right-2 top-2">
                  <span className={`badge ${
                    room.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {room.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold line-clamp-1">{room.address || "No address"}</div>
                  <div className="text-sm shrink-0">
                    <strong>${room.price_per_month}</strong>/mo
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="btn btn-outline flex-1 flex items-center justify-center gap-1 text-sm"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                  <Link
                    href={`/landlord/edit/${room.slug}`}
                    className="btn btn-outline flex-1 flex items-center justify-center gap-1 text-sm"
                  >
                    <Edit size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(room.slug)}
                    disabled={deletingSlug === room.slug}
                    className="btn btn-outline flex items-center justify-center px-3 text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Home size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
          <p className="text-gray-600 mb-6">
            Start earning by creating your first listing
          </p>
          {isVerified && (
            <Link href="/landlord/new" className="btn btn-primary">
              Create Your First Listing
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
