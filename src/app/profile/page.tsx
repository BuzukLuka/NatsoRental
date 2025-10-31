// src/app/profile/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CreditCard,
  BadgeCheck,
  Home,
  Mail,
  User as UserIcon,
  MapPin,
  Building2,
  IdCard,
  CalendarDays,
  DollarSign,
  LayoutList,
  Wrench,
  ReceiptText,
} from "lucide-react";
import api from "@/lib/client";
import { useAuth } from "@/providers/AuthProvider";
import { useDashboard } from "@/hooks/useDashboard";
import {
  useServiceRequests,
  useCreateServiceRequest,
  useMarkServiceRequestCompleted,
} from "@/hooks/useServiceRequests";
import type { ServiceRequest } from "@/types/serviceRequests";
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import ServicesContent from "@/components/ServicesComponent";
import type { User } from "@/types/api";

/** -------- Local type to normalize dash.user + auth.user -------- */
type ProfileUser = User & {
  // allow them to be optional if dash.user is slimmer
  company_name?: string | null;
  address?: string | null;
};

/* ---------- tiny helpers ---------- */
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
function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warn";
}) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1";
  const toneCls =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-black/5 text-black/70 ring-black/10";
  return <span className={`${base} ${toneCls}`}>{children}</span>;
}
const StatusPill = ({ s }: { s: ServiceRequest["status"] }) => {
  const map = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    in_progress: "bg-blue-50 text-blue-700 ring-blue-200",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    canceled: "bg-gray-100 text-gray-600 ring-gray-200",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${map[s]}`}
    >
      {s.replace("_", " ")}
    </span>
  );
};
/* ---------------------------------- */

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { data: dash, isLoading } = useDashboard(isAuthenticated);

  // Tabs
  const [tab, setTab] = useState<"overview" | "services" | "payments">(
    "overview"
  );

  // Pay now
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Services
  const { data: requests, isLoading: loadingRequests } =
    useServiceRequests(isAuthenticated);
  const createReq = useCreateServiceRequest();
  const completeReq = useMarkServiceRequestCompleted();

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

  // ✅ Normalize the profile object to a single friendly type for this page
  const profile = (dash?.user ?? user) as ProfileUser | null;
  const current = dash?.current_rental ?? null;

  const handlePay = async () => {
    if (!current?.id) return;
    setPayError(null);
    setPaying(true);
    try {
      const res = await api.post("/payments/create-session/", {
        booking_id: current.id,
      });
      const url = (res.data as { checkout_url?: string })?.checkout_url;
      if (url) window.location.href = url;
      else throw new Error("No checkout_url returned");
    } catch (e: unknown) {
      // narrow unknown safely
      let message = "Could not start checkout. Please try again.";
      if (
        e &&
        typeof e === "object" &&
        "response" in e &&
        (e as any).response?.data?.detail
      ) {
        message = (e as any).response.data.detail as string;
      }
      setPayError(message);
      setPaying(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Profile</h1>
        </div>
        <Link href="/settings" className="btn btn-outline">
          Edit profile
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: Account card */}
        <div className="lg:col-span-1">
          <Section title="Account">
            <div className="mb-3 flex items-center gap-3">
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
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
              <div className="min-w-0">
                <div className="truncate font-semibold">
                  {profile?.name ||
                    `${profile?.first_name ?? ""} ${
                      profile?.last_name ?? ""
                    }`.trim() ||
                    profile?.username}
                </div>
                <div className="flex items-center gap-1 text-sm text-black/70">
                  <Mail className="h-4 w-4" /> {profile?.email}
                </div>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              <Pill>
                <IdCard className="h-3.5 w-3.5" />
                {profile?.role ?? "—"}
              </Pill>
              {profile?.verified ? (
                <Pill tone="success">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </Pill>
              ) : (
                <Pill>Not verified</Pill>
              )}
            </div>

            <Row
              label="Bookings"
              value={isLoading ? "…" : dash?.stats.bookings_count ?? 0}
            />
            <Row
              label="Payments"
              value={isLoading ? "…" : dash?.stats.payments_count ?? 0}
            />
            {profile?.company_name ? (
              <Row label="Company" value={profile.company_name} />
            ) : null}
            {profile?.address ? (
              <Row
                label="Address"
                value={
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.address}
                  </span>
                }
              />
            ) : null}
          </Section>

          {profile?.bio ? (
            <Section title="About">
              <p className="whitespace-pre-wrap text-sm text-black/80">
                {profile.bio}
              </p>
            </Section>
          ) : null}
        </div>

        {/* Right: Tabs + Panels */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Tabs
            tabs={[
              {
                value: "overview",
                label: "Overview",
                icon: <LayoutList className="h-4 w-4" />,
              },
              {
                value: "services",
                label: "Services",
                icon: <Wrench className="h-4 w-4" />,
              },
              {
                value: "payments",
                label: "Payments",
                icon: <ReceiptText className="h-4 w-4" />,
              },
            ]}
            value={tab}
            onChange={(v) => setTab(v as "overview" | "services" | "payments")}
            className="sticky top-[64px] z-[5] bg-transparent"
          />

          {/* OVERVIEW */}
          <TabPanel value="overview" activeValue={tab} labelledBy="overview">
            <Section title="Current rental">
              {isLoading ? (
                <div className="text-sm text-black/60">Loading...</div>
              ) : current ? (
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative h-28 w-full overflow-hidden rounded-xl md:h-24 md:w-40">
                    <Image
                      src={current.room.thumbnail || "/placeholder.png"}
                      alt="Thumbnail"

                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold leading-tight">
                            {current.room.title}
                          </h3>
                          <Pill
                            tone={
                              current.status === "confirmed" ||
                              current.status === "checked_in"
                                ? "success"
                                : "neutral"
                            }
                          >
                            <BadgeCheck className="h-3.5 w-3.5" />
                            {current.status}
                          </Pill>
                          {current.payment_status && (
                            <Pill
                              tone={
                                current.payment_status === "paid"
                                  ? "success"
                                  : "warn"
                              }
                            >
                              <DollarSign className="h-3.5 w-3.5" />
                              {current.payment_status}
                            </Pill>
                          )}
                        </div>
                        <p className="text-sm text-black/70">
                          {current.room.address}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/60">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {current.check_in} → {current.check_out} (
                            {(() => {
                              const checkIn = new Date(current.check_in);
                              const checkOut = new Date(current.check_out);
                              const diff =
                                (checkOut.getTime() - checkIn.getTime()) /
                                (1000 * 60 * 60 * 24);
                              return Math.ceil(diff);
                            })()}{" "}
                            nights)
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {current.room.property_type?.name}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/rooms/${current.room.slug}`}
                        className="btn btn-outline whitespace-nowrap"
                      >
                        View
                      </Link>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-black/60">$</span>
                        <span className="text-lg font-extrabold">
                          {current.room.price_per_month}
                        </span>
                        <span className="text-black/60">/mo</span>
                      </div>
                      <button
                        onClick={handlePay}
                        disabled={paying}
                        className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-md disabled:opacity-60"
                      >
                        <CreditCard className="h-4 w-4" />
                        {paying ? "Redirecting…" : "Pay this month"}
                      </button>
                    </div>

                    {payError && (
                      <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {payError}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                    <Home className="h-6 w-6" />
                  </div>
                  <div className="font-semibold">No active rental</div>
                  <p className="max-w-md text-sm text-black/70">
                    Reserve a room to see it here. You can browse available
                    homes and add to your wishlist.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Link href="/browse" className="btn btn-outline">
                      Browse homes
                    </Link>
                  </div>
                </div>
              )}
            </Section>

            <Section title="Rental history">
              {isLoading ? (
                <div className="text-sm text-black/60">Loading...</div>
              ) : dash?.recent_bookings?.length ? (
                <div className="flex flex-col gap-3">
                  {dash.recent_bookings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-black/10 p-3"
                    >
                      <div className="min-w-0">
                        <div className="line-clamp-1 font-medium leading-tight">
                          {b.room.title}
                        </div>
                        <div className="text-xs text-black/60">
                          {b.room.address} · ${b.total_price}
                        </div>
                      </div>
                      <Link
                        href={`/rooms/${b.room.slug}`}
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
          </TabPanel>

          {/* SERVICES */}
          <TabPanel value="services" activeValue={tab} labelledBy="services">
            <Section title="Services & maintenance">
              {!current ? (
                <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/70">
                  You need an active rental to request a service.
                </div>
              ) : (
                <ServicesContent
                  currentBookingId={current.id}
                  roomTitle={current.room.title}
                  requests={
                    requests?.filter((r) => r.booking_id === current.id) ?? []
                  }
                  loadingRequests={loadingRequests}
                  createReq={createReq}
                  completeReq={completeReq}
                />
              )}
            </Section>
          </TabPanel>

          {/* PAYMENTS */}
          <TabPanel value="payments" activeValue={tab} labelledBy="payments">
            <Section title="Payment history">
              {isLoading ? (
                <div className="text-sm text-black/60">Loading...</div>
              ) : dash?.recent_payments?.length ? (
                <div className="overflow-hidden rounded-xl border border-black/10">
                  <table className="w-full text-sm">
                    <thead className="bg-black/5 text-left">
                      <tr>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Amount</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Txn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dash.recent_payments.map((p) => (
                        <tr key={p.id} className="border-t border-black/5">
                          <td className="px-3 py-2">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2">${p.amount}</td>
                          <td className="px-3 py-2 text-black/60">
                            {p.status}
                          </td>
                          <td className="break-all px-3 py-2 text-xs text-black/60">
                            {p.transaction_id || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-black/70">No payments yet.</div>
              )}
            </Section>
          </TabPanel>
        </div>
      </div>
    </main>
  );
}
