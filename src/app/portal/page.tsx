"use client";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function PortalPage() {
  const { me, myReservations, scheduleReminder } = useStore();
  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="text-2xl font-extrabold">
        Welcome, {me?.name ?? "Guest"}
      </h1>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-4">
          <h3 className="font-bold">My Reservations</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {myReservations().map((r) => (
              <li key={r.id} className="flex items-center justify-between">
                <span>{r.propertyTitle}</span>
                <span className="badge">Deposit ${r.deposit}</span>
              </li>
            ))}
            {myReservations().length === 0 && (
              <li className="text-black/60">No reservations yet.</li>
            )}
          </ul>
        </div>
        <div className="card p-4">
          <h3 className="font-bold">Payments</h3>
          <p className="text-sm text-black/70">
            Pay rent, see history, and deposit status.
          </p>
          <Link href="/portal/payments" className="btn btn-outline mt-3 w-full">
            Manage payments
          </Link>
        </div>
        <div className="card p-4">
          <h3 className="font-bold">Maintenance</h3>
          <p className="text-sm text-black/70">
            Submit requests, track progress.
          </p>
          <Link
            href="/portal/maintenance"
            className="btn btn-outline mt-3 w-full"
          >
            Open maintenance
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h3 className="font-bold">Keys & Access</h3>
          <p className="text-sm text-black/70">
            Lost key penalty: <strong>$80</strong> (deducted from deposit)
          </p>
        </div>
        <div className="card p-4">
          <h3 className="font-bold">Reminders</h3>
          <p className="text-sm text-black/70">Set an auto reminder</p>
          <button
            className="btn btn-primary mt-2"
            onClick={() =>
              scheduleReminder({
                message: "Rent due in 3 days",
                daysFromNow: 3,
              })
            }
          >
            Rent due in 3 days
          </button>
        </div>
      </div>
    </div>
  );
}
