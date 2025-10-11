"use client";
import { useApp } from "@/providers/AppProvider";
import Link from "next/link";

export default function LandlordPage() {
  const { user: me } = useApp();
  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">
          Landlord · {me?.first_name ?? "Guest"}
        </h1>
        <Link className="btn btn-primary" href="/landlord/new">
          Add new listing
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3"></div>
    </div>
  );
}
