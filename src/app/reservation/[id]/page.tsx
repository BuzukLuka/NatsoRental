"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

export default function ReservationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getPropertyById, reserve } = useStore();
  const p = getPropertyById(id);
  const [open, setOpen] = useState(false);
  if (!p) return <div className="p-6">Not found.</div>;

  function onReserve() {
    reserve(p.id);
    setOpen(true);
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-extrabold">Reservation & Deposit</h1>
      <p className="text-sm text-black/70">Property: {p.title}</p>

      <div className="card mt-4 p-4">
        <p>
          Deposit amount: <strong>${p.deposit}</strong>
        </p>
        <p className="text-sm text-black/70">
          Fully refundable minus penalties (lost keys $80, damages, late rent,
          etc.)
        </p>
        <button className="btn btn-primary mt-3" onClick={onReserve}>
          Pay deposit & sign →
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Reservation confirmed!"
      >
        <p className="text-sm">
          We emailed a welcome packet with smart lock info and move‑in
          checklist.
        </p>
        <div className="mt-4 flex gap-2">
          <button className="btn btn-outline" onClick={() => setOpen(false)}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/portal")}
          >
            Go to Portal
          </button>
        </div>
      </Modal>
    </div>
  );
}
