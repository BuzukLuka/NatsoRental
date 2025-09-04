"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  Home,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import type { Property } from "@/types";

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

function CurrentRental({
  property,
  onPay,
}: {
  property: Property;
  onPay: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="relative h-28 w-full overflow-hidden rounded-xl md:h-24 md:w-40">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold leading-tight">{property.title}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-200">
                <BadgeCheck className="h-3 w-3" /> Active
              </span>
            </div>
            <p className="text-sm text-black/70">
              {property.neighborhood} · {property.roomType} · {property.tenure}
            </p>
          </div>
          <Link
            href={`/room/${property.id}`}
            className="btn btn-outline whitespace-nowrap"
          >
            View
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-black/60">$</span>
            <span className="text-lg font-extrabold">
              {property.priceMonthly}
            </span>
            <span className="text-black/60">/mo</span>
          </div>
          <button
            onClick={onPay}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
          >
            <CreditCard className="h-4 w-4" />
            Pay this month
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const store = useStore();

  // guard: not logged in
  if (!store.me) {
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

  const me = store.me;
  const reservations = store.myReservations();
  // Одоогийн түрээс: хамгийн сүүлд үүсгэсэн reservation (таны Store reserve нь prepend хийдэг)
  const current = reservations[0];
  const currentProperty = current
    ? store.getPropertyById(current.propertyId)
    : undefined;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      {/* Header */}
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
        {/* Left: Profile info */}
        <div className="lg:col-span-1">
          <Section title="Account">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/90 text-white">
                <UserIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">{me.name}</div>
                <div className="flex items-center gap-1 text-sm text-black/70">
                  <Mail className="h-4 w-4" />
                  {me.email}
                </div>
              </div>
            </div>
            <Row label="Role" value={me.role} />
            <Row
              label="Wishlist"
              value={
                <Link href="/wishlist" className="underline">
                  {store.wishlist.length} saved
                </Link>
              }
            />
            <Row
              label="Reservations"
              value={<span>{reservations.length}</span>}
            />
            <Row
              label="Payments"
              value={<span>{store.payments.length}</span>}
            />
          </Section>
        </div>

        {/* Right: Current rental + history + payments */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Section title="Current rental">
            {!currentProperty ? (
              <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                  <Home className="h-6 w-6" />
                </div>
                <div className="font-semibold">No active rental</div>
                <p className="max-w-md text-sm text-black/70">
                  Reserve a room to see it here. You can browse available homes
                  and add to wishlist.
                </p>
                <div className="mt-2 flex gap-2">
                  <Link href="/browse" className="btn btn-outline">
                    Browse homes
                  </Link>
                  <Link href="/wishlist" className="btn btn-outline">
                    Wishlist
                  </Link>
                </div>
              </div>
            ) : (
              <CurrentRental
                property={currentProperty}
                onPay={() => store.payRent(currentProperty.priceMonthly)}
              />
            )}
          </Section>

          <Section title="Rental history">
            {reservations.length === 0 ? (
              <div className="text-sm text-black/70">No reservations yet.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {reservations.map((r) => {
                  const prop = store.getPropertyById(r.propertyId);
                  if (!prop) return null;
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-black/10 p-3"
                    >
                      <div className="min-w-0">
                        <div className="font-medium leading-tight line-clamp-1">
                          {r.propertyTitle}
                        </div>
                        <div className="text-xs text-black/60">
                          {prop.neighborhood} · deposit ${r.deposit}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <div className="text-sm">
                          <span className="text-black/60">$</span>
                          <span className="font-semibold">
                            {prop.priceMonthly}
                          </span>
                          <span className="text-black/60">/mo</span>
                        </div>
                        <Link
                          href={`/room/${prop.id}`}
                          className="btn btn-outline"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          <Section title="Payment history">
            {store.payments.length === 0 ? (
              <div className="text-sm text-black/70">No payments yet.</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-black/10">
                <table className="w-full text-sm">
                  <thead className="bg-black/5 text-left">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.payments.map((p) => (
                      <tr key={p.id} className="border-t border-black/5">
                        <td className="px-3 py-2">{p.date}</td>
                        <td className="px-3 py-2">${p.amount}</td>
                        <td className="px-3 py-2 text-black/60">
                          Rent payment
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </div>
      </div>
    </main>
  );
}
