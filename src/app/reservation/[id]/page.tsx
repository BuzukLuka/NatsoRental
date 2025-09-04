"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

export default function ReservationPage() {
  const params = useParams<{ id: string }>(); // Next 13.4+ supports the generic
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // normalize just in case
  const router = useRouter();

  const { getPropertyById, reserve } = useStore();
  const property = getPropertyById(id); // type: Property | undefined

  const [open, setOpen] = useState(false);

  if (!property) {
    return <div className="p-6">Not found.</div>;
  }

  // From here, `property` is narrowed to Property
  const onReserve = () => {
    reserve(property.id);
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-extrabold">Reservation &amp; Deposit</h1>
      <p className="text-sm text-black/70">Property: {property.title}</p>

      <div className="card mt-4 p-4">
        <p>
          Deposit amount: <strong>${property.deposit}</strong>
        </p>
        <p className="text-sm text-black/70">
          Fully refundable minus penalties (lost keys $80, damages, late rent,
          etc.)
        </p>
        <button className="btn btn-primary mt-3" onClick={onReserve}>
          Pay deposit &amp; sign →
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Reservation confirmed!"
      >
        <p className="text-sm">
          We emailed a welcome packet with smart lock info and move-in
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
