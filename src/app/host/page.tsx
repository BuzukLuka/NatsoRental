"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Home,
  Shield,
  KeyRound,
  Sparkles,
  DollarSign,
  Info,
} from "lucide-react";
import { useStore } from "@/lib/store";

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="rounded-xl bg-black/5 p-2">{icon}</div>
      <div>
        <div className="text-xs text-black/60">{label}</div>
        <div className="font-bold">{value}</div>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700 ring-1 ring-emerald-200">
      <CheckCircle2 className="h-3 w-3" />
      {children}
    </span>
  );
}

export default function BecomeHostPage() {
  const store = useStore();

  // --- Listing quick form ---
  const [title, setTitle] = useState("Cozy private room near transit");
  const [price, setPrice] = useState(900);
  const [occupancy, setOccupancy] = useState(1); // persons
  const [occRate, setOccRate] = useState(85); // %
  const [fees, setFees] = useState(5); // platform fee %

  const estMonthly = useMemo(() => {
    // simple: price * occupancy * occRate%
    const gross = price * occupancy * (occRate / 100);
    const fee = (gross * fees) / 100;
    return Math.max(0, Math.round(gross - fee));
  }, [price, occupancy, occRate, fees]);

  function onCreate() {
    if (!title.trim()) return alert("Please enter a title.");
    if (price <= 0) return alert("Please set a valid monthly price.");
    store.createListing({ title: title.trim(), priceMonthly: price });
    // store дотор alert хийдэг — энд давхар navigate хийхийг хүсвэл доорх мөрийг нээгээрэй.
    // router.push("/landlord");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-8">
      {/* Hero */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-extrabold leading-tight">
            Become a Host
          </h1>
          <p className="mt-2 max-w-2xl text-black/70">
            Earn steady income by listing your spare room or unit. We handle
            screening, payments, and support so you can host with confidence.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat
              icon={<DollarSign className="h-5 w-5" />}
              label="Avg. payout/mo"
              value="$900–$1,300"
            />
            <Stat
              icon={<Shield className="h-5 w-5" />}
              label="Deposit protected"
              value="Dispute & penalties"
            />
            <Stat
              icon={<KeyRound className="h-5 w-5" />}
              label="You’re in control"
              value="Custom rules & terms"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>ID & landlord verification</Pill>
            <Pill>Secure rent collection</Pill>
            <Pill>Maintenance portal</Pill>
          </div>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-2xl md:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=60"
            alt="Host your place"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Steps */}
      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
            1
          </div>
          <h3 className="font-semibold">Create your listing</h3>
          <p className="mt-1 text-sm text-black/70">
            Add a title, price, and basic details. You can edit everything
            later.
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
            2
          </div>
          <h3 className="font-semibold">Set house rules</h3>
          <p className="mt-1 text-sm text-black/70">
            Define cleaning, quiet hours, and pet policy. We’ll share it with
            renters.
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
            3
          </div>
          <h3 className="font-semibold">Publish & start earning</h3>
          <p className="mt-1 text-sm text-black/70">
            Go live and receive screened applications with deposit protection.
          </p>
        </div>
      </section>

      {/* Quick create + estimator */}
      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Home className="h-5 w-5" />
              <h2 className="text-lg font-bold">Create a quick listing</h2>
            </div>

            <label className="mb-2 block text-sm font-semibold">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Bright master room in Kensington"
              className="mb-4 w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Monthly price (USD)
                </label>
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={price}
                  onChange={(e) =>
                    setPrice(parseInt(e.target.value || "0", 10))
                  }
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Occupancy (people)
                </label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={occupancy}
                  onChange={(e) =>
                    setOccupancy(parseInt(e.target.value || "1", 10))
                  }
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Expected occupancy (%)
                </label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  step={5}
                  value={occRate}
                  onChange={(e) =>
                    setOccRate(parseInt(e.target.value || "0", 10))
                  }
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Platform fee (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={1}
                  value={fees}
                  onChange={(e) => setFees(parseInt(e.target.value || "0", 10))}
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div className="md:col-span-2 rounded-xl border border-black/10 bg-black/[0.03] px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  This is a simplified estimator. Actual income depends on term,
                  pet policy, and demand.
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-black/70">
                Deposit auto-calculated as <strong>50%</strong> of monthly rent.
              </div>
              <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
              >
                <Sparkles className="h-4 w-4" />
                Publish listing
              </button>
            </div>
          </div>
        </div>

        {/* Estimator / Preview */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <h3 className="font-semibold">Earnings estimate</h3>
            </div>
            <div className="text-3xl font-extrabold">
              ${estMonthly.toLocaleString()}
              <span className="text-sm font-normal text-black/60">/mo</span>
            </div>
            <p className="mt-1 text-sm text-black/70">
              After {fees}% fee at {occRate}% occupancy.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-semibold">Preview</div>
            <div className="overflow-hidden rounded-xl border border-black/10">
              <div className="relative h-28 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=60"
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="line-clamp-1 font-semibold">{title}</div>
                  <div className="text-sm">
                    <strong>${price}</strong>/mo
                  </div>
                </div>
                <div className="mt-1 text-xs text-black/60">
                  Private room · Deposit 50%
                </div>
                <Link
                  href="/landlord"
                  className="btn btn-outline mt-3 w-full text-center"
                >
                  Manage listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements / FAQ */}
      <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-semibold">Requirements</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-black/80">
            <li>Valid ID and proof of ownership/authorization</li>
            <li>Clear house rules and emergency contacts</li>
            <li>Photos (minimum 3) of the room and common areas</li>
            <li>Compliance with local tenancy laws</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-semibold">FAQ</h3>
          <div className="space-y-2 text-sm text-black/80">
            <div>
              <strong>How do deposits work?</strong>
              <p>We hold 50% of one month rent as a refundable deposit.</p>
            </div>
            <div>
              <strong>Who handles maintenance?</strong>
              <p>
                Renters submit tickets in the support portal; you’ll be notified
                and can coordinate fixes.
              </p>
            </div>
            <div>
              <strong>How are renters screened?</strong>
              <p>We run ID checks and basic screening before reservation.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
