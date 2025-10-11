// src/app/payment-success/page.tsx
"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/client";

// (сонголт) static пререндерээс зайлсхийх
export const dynamic = "force-dynamic";

type PaymentStatus = "pending" | "paid" | "failed" | "unknown";

type PaymentLookupResponse = {
  id: number;
  status: PaymentStatus;
  amount: string;
  transaction_id?: string | null;
  stripe_session_id?: string | null;
  booking?: {
    id: number;
    status: string;
    check_in: string;
    check_out: string;
    total_price: string;
    room: { id: number; slug: string; title: string };
  } | null;
};

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-extrabold">Payment</h1>
      <p className="mb-6 text-sm text-black/70">
        We’re confirming your payment details. If this page doesn’t update, use
        the button below to go back to your bookings.
      </p>

      {/* ✅ useSearchParams() дотор нь ажиллах тул заавал Suspense */}
      <Suspense
        fallback={
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/70">
            Loading payment details…
          </div>
        }
      >
        <PaymentSuccessInner />
      </Suspense>

      <div className="mt-8">
        <a href="/account/bookings" className="btn btn-outline">
          Go to My Bookings
        </a>
      </div>
    </main>
  );
}

function PaymentSuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<PaymentStatus>("unknown");
  const [data, setData] = useState<PaymentLookupResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const attempts = useRef(0);
  let timer: ReturnType<typeof setTimeout> | null = null;

  // Poll backend until webhook marks it as paid (or timeout)
  useEffect(() => {
    if (!sessionId) {
      setError("Missing session_id in the URL.");
      setLoading(false);
      return;
    }

    const check = async () => {
      try {
        const res = await api.get<PaymentLookupResponse>(
          "/payments/by-session/",
          {
            params: { session_id: sessionId },
          }
        );
        setData(res.data);
        setStatus(res.data.status);

        if (res.data.status === "paid") {
          setLoading(false);
          if (timer) clearTimeout(timer);
          return;
        }

        attempts.current += 1;
        if (attempts.current < 15) {
          timer = setTimeout(check, 2000);
        } else {
          setLoading(false);
          setError(
            "Payment is still pending. You can check your bookings later."
          );
        }
      } catch {
        attempts.current += 1;
        if (attempts.current < 5) {
          timer = setTimeout(check, 2000);
        } else {
          setLoading(false);
          setError(
            "Could not verify payment. Please refresh or check your bookings."
          );
        }
      }
    };

    check();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sessionId]);

  const copySession = async () => {
    if (!sessionId) return;
    try {
      await navigator.clipboard.writeText(sessionId);
    } catch {
      /* noop */
    }
  };

  const StatusPill = ({ value }: { value: PaymentStatus }) => {
    const map: Record<PaymentStatus, string> = {
      paid: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      unknown: "bg-gray-100 text-gray-800 border-gray-200",
    };
    const label = value.charAt(0).toUpperCase() + value.slice(1);
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${map[value]}`}
      >
        {value === "paid" && "✅"}
        {value === "pending" && "⏳"}
        {value === "failed" && "⚠️"}
        {value === "unknown" && "❔"}
        {label}
      </span>
    );
  };

  const summary = useMemo(
    () => [
      ["Status", loading ? "pending" : error ? "unknown" : status],
      ["Session", sessionId ?? "—"],
      ["Booking", data?.booking?.id ?? "—"],
      [
        "Amount",
        data?.booking?.total_price
          ? `$${data.booking.total_price}`
          : data?.amount
          ? `$${data.amount}`
          : "—",
      ],
      ["Transaction", data?.transaction_id ?? "—"],
    ],
    [loading, error, status, sessionId, data]
  );

  return (
    <>
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-50 p-6 ring-1 ring-black/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">
              Stripe Checkout confirmation
            </h2>
            <p className="text-black/60">We’re confirming your payment.</p>
          </div>
          <div>
            <StatusPill
              value={loading ? "pending" : error ? "unknown" : status}
            />
          </div>
        </div>

        {sessionId && (
          <div className="mt-3 flex items-center gap-2 text-sm text-black/60">
            <span className="truncate">Session:</span>
            <code className="truncate rounded-md bg-black/5 px-2 py-1">
              {sessionId}
            </code>
            <button
              className="btn btn-outline btn-sm ml-2"
              onClick={copySession}
            >
              Copy
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      {!sessionId ? (
        <div className="card mt-6 border border-red-200 bg-red-50 p-5">
          <h3 className="font-semibold text-red-700">Missing session_id</h3>
          <p className="mt-1 text-sm text-red-700/80">
            We couldn’t read your payment session. Please return to your
            bookings.
          </p>
          <div className="mt-4">
            <button
              className="btn btn-outline"
              onClick={() => router.push("/account/bookings")}
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="card mt-6 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-black/10" />
            <div>
              <p className="font-semibold">Finalizing your booking…</p>
              <p className="text-sm text-black/60">
                Waiting for Stripe confirmation
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="h-16 animate-pulse rounded-lg bg-black/5" />
            <div className="h-16 animate-pulse rounded-lg bg-black/5" />
            <div className="h-16 animate-pulse rounded-lg bg-black/5" />
          </div>
          <p className="mt-4 text-xs text-black/50">
            If this takes more than ~30 seconds, you can safely refresh.
          </p>
        </div>
      ) : error ? (
        <div className="card mt-6 border border-red-200 bg-red-50 p-5">
          <h3 className="font-semibold text-red-700">
            We’re having trouble verifying your payment
          </h3>
          <p className="mt-1 text-sm text-red-700/80">{error}</p>
          <div className="mt-4 flex gap-2">
            <button
              className="btn btn-outline"
              onClick={() => router.push("/account/bookings")}
            >
              Go to My Bookings
            </button>
            <button className="btn" onClick={() => router.refresh()}>
              Refresh
            </button>
          </div>
        </div>
      ) : status === "paid" && data ? (
        <div className="card mt-6 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-green-100 text-green-700">
              ✅
            </div>
            <div>
              <h3 className="font-semibold text-green-700">
                Payment confirmed
              </h3>
              <p className="text-sm text-black/60">
                Your booking has been secured.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-black/50">
                Room
              </p>
              <p className="mt-1 font-medium">
                {data.booking?.room.title ?? "—"}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-black/50">
                Booking ID
              </p>
              <p className="mt-1 font-medium">{data.booking?.id ?? "—"}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-black/50">
                Dates
              </p>
              <p className="mt-1 font-medium">
                {data.booking?.check_in} → {data.booking?.check_out}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-black/50">
                Total Paid
              </p>
              <p className="mt-1 font-semibold">
                ${data.booking?.total_price ?? data.amount}
              </p>
            </div>
            <div className="rounded-lg border p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-black/50">
                Transaction
              </p>
              <p className="mt-1 break-all font-mono text-sm">
                {data.transaction_id || "—"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={() => router.push("/account/bookings")}
            >
              View My Bookings
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                const slug = data.booking?.room.slug;
                if (slug) router.push(`/rooms/${slug}`);
              }}
              disabled={!data.booking?.room.slug}
            >
              Back to Room
            </button>
          </div>
        </div>
      ) : (
        <div className="card mt-6 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-yellow-100 text-yellow-800">
              ⏳
            </div>
            <div>
              <h3 className="font-semibold">Payment status: {status}</h3>
              <p className="text-sm text-black/60">
                You can check your bookings any time.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button
              className="btn btn-outline"
              onClick={() => router.push("/account/bookings")}
            >
              View My Bookings
            </button>
          </div>
        </div>
      )}

      {/* Quick summary table */}
      <div className="mt-8 overflow-hidden rounded-xl border border-black/10">
        <table className="w-full text-sm">
          <tbody>
            {summary.map(([k, v]) => (
              <tr key={k} className="border-t border-black/5">
                <td className="px-3 py-2 text-black/60">{k}</td>
                <td className="px-3 py-2">{v as React.ReactNode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
