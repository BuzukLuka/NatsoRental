"use client";
import { useStore } from "@/lib/store";

export default function PaymentsPage() {
  const { payments, payRent } = useStore();
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-extrabold">Payments</h1>
      <div className="mt-4 card p-4">
        <button className="btn btn-primary" onClick={() => payRent(1200)}>
          Pay $1200 rent
        </button>
        <ul className="mt-4 space-y-2 text-sm">
          {payments.map((p) => (
            <li key={p.id} className="flex items-center justify-between">
              <span>{p.date}</span>
              <span>${p.amount}</span>
            </li>
          ))}
          {payments.length === 0 && (
            <li className="text-black/60">No payments yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
