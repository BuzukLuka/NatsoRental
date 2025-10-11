// components/ApplyDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCreateApplication } from "@/hooks/useApplications";

type Props = {
  open: boolean;
  onClose: () => void;
  roomId: number;
  roomTitle: string;
};

export default function ApplyDrawer({
  open,
  onClose,
  roomId,
  roomTitle,
}: Props) {
  const createApp = useCreateApplication();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [employer, setEmployer] = useState("");
  const [income, setIncome] = useState("");
  const [hasPets, setHasPets] = useState(false);
  const [notes, setNotes] = useState("");

  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => setMounted(true), []);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    // auto dismiss
    setTimeout(() => setToast(null), 3000);
  };

  const submitting = createApp.isPending;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createApp.mutateAsync({
        room: roomId,
        full_name: fullName,
        phone,
        move_in_date: moveIn || undefined,
        employer: employer || undefined,
        monthly_income: income || undefined,
        has_pets: hasPets,
        notes: notes || undefined,
      });

      // reset form (optional)
      setFullName("");
      setPhone("");
      setMoveIn("");
      setEmployer("");
      setIncome("");
      setHasPets(false);
      setNotes("");

      showToast(
        "success",
        "Application submitted 🎉 We’ll notify you after review."
      );
      // close drawer shortly after success
      setTimeout(onClose, 400);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        showToast("error", "Please sign in to apply.");
      } else {
        showToast("error", "Could not submit application. Please try again.");
      }
    }
  };

  const Drawer = (
    <div
      className={`fixed inset-0 z-[2000] transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="text-lg font-bold">Apply / Screening</h3>
            <p className="text-sm text-black/60">Room: {roomTitle}</p>
          </div>
          <button className="btn btn-sm btn-outline" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="space-y-3 p-4" onSubmit={submit}>
          <div>
            <label className="text-xs text-black/60">Full name*</label>
            <input
              className="input input-bordered w-full"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs text-black/60">Phone</label>
              <input
                className="input input-bordered w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-black/60">Move-in date</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={moveIn}
                onChange={(e) => setMoveIn(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-black/60">
              Employer / Workplace
            </label>
            <input
              className="input input-bordered w-full"
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              placeholder="ACME Inc. (or 'Self-employed', 'Student')"
            />
          </div>

          <div>
            <label className="text-xs text-black/60">
              Monthly income (USD)
            </label>
            <input
              className="input input-bordered w-full"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 2500.00"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="hasPets"
              type="checkbox"
              className="checkbox"
              checked={hasPets}
              onChange={(e) => setHasPets(e.target.checked)}
            />
            <label htmlFor="hasPets" className="text-sm">
              I have pets
            </label>
          </div>

          <div>
            <label className="text-xs text-black/60">Notes</label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything the host should know?"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>

          <p className="text-xs text-black/50">
            By submitting, you consent to the host reviewing your application
            and contacting references you provide.
          </p>
        </form>
      </div>

      {/* Toast (floating, bottom-right) */}
      {toast && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[2100] space-y-2">
          <div
            className={`pointer-events-auto max-w-sm rounded-xl border p-3 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-black/10">
                {toast.type === "success" ? "✅" : "⚠️"}
              </div>
              <div className="flex-1 text-sm">{toast.msg}</div>
              <button
                onClick={() => setToast(null)}
                className="ml-2 text-black/50 hover:text-black"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!mounted) return null;
  return createPortal(Drawer, document.body); // portal so it sits on top of header
}
