"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, BadgeCheck, Heart, Trash2 } from "lucide-react";
import { useMemo } from "react";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-xs font-medium text-black shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-700 ring-1 ring-amber-200">
          <BadgeCheck className="h-3 w-3" /> Feature
        </span>
      </div>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-black/5 p-2">{icon}</div>
        <div>
          <h3 className="font-semibold leading-tight">{title}</h3>
          <p className="mt-1 text-sm text-black/70">{desc}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-100 opacity-0 blur-2xl transition group-hover:opacity-60" />
    </div>
  );
}

function WLCard({
  id,
  title,
  image,
  neighborhood,
  price,
  href,
  onRemove,
}: {
  id: string;
  title: string;
  image: string;
  neighborhood: string;
  price: number;
  href: string;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="relative h-48 w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
        <div className="absolute left-3 top-3">
          <Chip>{neighborhood}</Chip>
        </div>
        <button
          aria-label="Remove from wishlist"
          onClick={() => onRemove(id)}
          className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/90 p-2 shadow backdrop-blur transition hover:bg-white"
        >
          <Trash2 className="h-5 w-5 text-red-600" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 font-semibold leading-tight">{title}</h3>
        <div className="mt-auto flex items-end justify-between">
          <div className="text-sm">
            <span className="text-black/60">$</span>
            <span className="text-lg font-extrabold">{price}</span>
            <span className="text-black/60">/mo</span>
          </div>
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow-md"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {




  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Wishlist</h1>
          <p className="text-sm text-black/70">
            Saved places you love in Calgary
          </p>
        </div>
        {/* {total > 0 && (
          <div className="text-sm text-black/70">{total} saved</div>
        )} */}
      </div>

      <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <FeatureCard
          title="Verified landlords"
          desc="Screened listings & rules"
          icon={<MapPin className="h-5 w-5" />}
        />
        <FeatureCard
          title="Deposit protection"
          desc="Clear penalties & refunds"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path
                d="M12 2l8 4v6c0 5-3.6 9.3-8 10-4.4-.7-8-5-8-10V6l8-4z"
                fill="currentColor"
              />
            </svg>
          }
        />
        <FeatureCard
          title="Support portal"
          desc="Maintenance & payments"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path
                d="M12 3a9 9 0 100 18 9 9 0 000-18zm1 14h-2v-2h2v2zm1.1-6.9l-.8.8c-.6.6-.9 1.1-.9 2.1h-2c0-1.4.5-2.3 1.4-3.2l1.1-1.1c.3-.3.5-.7.5-1.1a1.5 1.5 0 00-3 0H7a3.5 3.5 0 117 0c0 .9-.4 1.7-.9 2.3z"
                fill="currentColor"
              />
            </svg>
          }
        />
      </section>

      {/* {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">No saved homes yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-black/70">
            Tap the heart on a listing to save it here. You can compare prices,
            neighborhoods, and terms later.
          </p>
          <Link
            href="/browse"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
          >
            Browse homes
          </Link>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <WLCard
              key={p.id}
              id={p.id}
              title={p.title}
              image={p.image}
              neighborhood={p.neighborhood}
              price={p.priceMonthly}
              href={`/room/${p.id}`}
              onRemove={removeFromWishlist}
            />
          ))}
        </section>
      )} */}
    </main>
  );
}
