"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  CreditCard,
  BadgeCheck,
  Home,
} from "lucide-react";
import api from "@/lib/client";
import { useAuth } from "@/providers/AuthProvider";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 py-2 last:border-b-0">
      <div className="text-sm text-black/60">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

type Room = {
  id: number;
  title: string;
  price_per_month: string;
  thumbnail: string | null;
  address: string;
  property_type?: { name: string };
};

type Booking = {
  id: number;
  status: string;
  check_in: string;
  check_out: string;
  total_price: string;
  room: Room;
};

type Payment = {
  id: number;
  amount: string;
  status: string;
  created_at: string;
  payment_type: string;
};

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();

  const {
    data: bookings,
    isLoading: loadingBookings,
  } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => (await api.get("/bookings/")).data.results || [],
    enabled: isAuthenticated,
  });

  const {
    data: payments,
    isLoading: loadingPayments,
  } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => (await api.get("/payments/")).data.results || [],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-8">
        <Section title="Profile">
          <div className="text-sm text-black/70">
            You’re not logged in.{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>{" "}
            to view your profile and rentals.
          </div>
        </Section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Profile</h1>
          <p className="text-sm text-black/70">
            Your account, rentals & payments
          </p>
        </div>
        <Link href="/settings" className="btn btn-outline">
          Edit profile
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left panel */}
        <div className="lg:col-span-1">
          <Section title="Account">
            <div className="mb-3 flex items-center gap-3">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="rounded-full border border-black/10"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                  <UserIcon className="h-6 w-6" />
                </div>
              )}
              <div>
                <div className="font-semibold">{user?.name || user?.username}</div>
                <div className="flex items-center gap-1 text-sm text-black/70">
                  <Mail className="h-4 w-4" /> {user?.email}
                </div>
              </div>
            </div>
            <Row label="Role" value={user?.role || "—"} />
            <Row
              label="Bookings"
              value={loadingBookings ? "…" : bookings?.length || 0}
            />
            <Row
              label="Payments"
              value={loadingPayments ? "…" : payments?.length || 0}
            />
          </Section>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Current Booking */}
          <Section title="Current rental">
            {loadingBookings ? (
              <div className="text-sm text-black/60">Loading...</div>
            ) : bookings && bookings.length > 0 ? (
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative h-28 w-full overflow-hidden rounded-xl md:h-24 md:w-40">
                  <Image
                    src={bookings[0].room.thumbnail || "/placeholder.png"}
                    alt={bookings[0].room.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold leading-tight">
                          {bookings[0].room.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-200">
                          <BadgeCheck className="h-3 w-3" />{" "}
                          {bookings[0].status}
                        </span>
                      </div>
                      <p className="text-sm text-black/70">
                        {bookings[0].room.address}
                      </p>
                    </div>
                    <Link
                      href={`/room/${bookings[0].room.id}`}
                      className="btn btn-outline whitespace-nowrap"
                    >
                      View
                    </Link>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-black/60">$</span>
                      <span className="text-lg font-extrabold">
                        {bookings[0].room.price_per_month}
                      </span>
                      <span className="text-black/60">/mo</span>
                    </div>
                    <button
                      onClick={() =>
                        alert("Integrate Stripe payment here 💳")
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
                    >
                      <CreditCard className="h-4 w-4" />
                      Pay this month
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                  <Home className="h-6 w-6" />
                </div>
                <div className="font-semibold">No active rental</div>
                <p className="max-w-md text-sm text-black/70">
                  Reserve a room to see it here. You can browse available homes
                  and add to your wishlist.
                </p>
                <div className="mt-2 flex gap-2">
                  <Link href="/browse" className="btn btn-outline">
                    Browse homes
                  </Link>
                </div>
              </div>
            )}
          </Section>

          {/* Booking history */}
          <Section title="Rental history">
            {loadingBookings ? (
              <div className="text-sm text-black/60">Loading...</div>
            ) : bookings && bookings.length > 0 ? (
              <div className="flex flex-col gap-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-black/10 p-3"
                  >
                    <div className="min-w-0">
                      <div className="font-medium leading-tight line-clamp-1">
                        {b.room.title}
                      </div>
                      <div className="text-xs text-black/60">
                        {b.room.address} · ${b.total_price}
                      </div>
                    </div>
                    <Link
                      href={`/room/${b.room.id}`}
                      className="btn btn-outline"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-black/70">No bookings yet.</div>
            )}
          </Section>

          {/* Payment history */}
          <Section title="Payment history">
            {loadingPayments ? (
              <div className="text-sm text-black/60">Loading...</div>
            ) : payments && payments.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-black/10">
                <table className="w-full text-sm">
                  <thead className="bg-black/5 text-left">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-t border-black/5">
                        <td className="px-3 py-2">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2">${p.amount}</td>
                        <td className="px-3 py-2 text-black/60">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-black/70">No payments yet.</div>
            )}
          </Section>
        </div>
      </div>
    </main>
  );
}
