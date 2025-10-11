import { useState } from "react";
import { Wrench, Sparkles, X } from "lucide-react";
import type { ServiceRequest } from "@/types/serviceRequests";

/* tiny status chip */
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

/* simple modal shell */
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "fixed inset-0 z-[2000] transition",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={[
          "absolute left-1/2 top-1/2 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2",
          "rounded-2xl border border-black/10 bg-white shadow-xl",
          "transition-transform",
          open ? "scale-100 opacity-100" : "scale-95 opacity-0",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            className="btn btn-sm btn-outline"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function ServicesContent({
  currentBookingId,
  roomTitle,
  requests,
  loadingRequests,
  createReq,
  completeReq,
}: {
  currentBookingId: number;
  roomTitle: string;
  requests: ServiceRequest[];
  loadingRequests: boolean;
  createReq: { mutateAsync: (p: any) => Promise<any>; isPending: boolean };
  completeReq: { mutateAsync: (id: number) => Promise<any> };
}) {
  const [open, setOpen] = useState(false);
  const [reqType, setReqType] = useState<
    "cleaning" | "repair" | "maintenance" | "other"
  >("cleaning");
  const [reqDesc, setReqDesc] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await createReq.mutateAsync({
        booking_id: currentBookingId,
        request_type: reqType,
        description: reqDesc || undefined,
      });
      setReqDesc("");
      setReqType("cleaning");
      setOpen(false);
      setSuccessMsg(
        "Request submitted successfully. We’ll notify you with updates."
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        Object.values(err?.response?.data || {}).join(", ") ||
        "Could not submit request.";
      setErrorMsg(msg);
    }
  };

  return (
    <>
      {/* top bar: action + context */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-black/60">
          Room: <span className="font-medium text-black">{roomTitle}</span>
        </div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          <Wrench className="h-4 w-4" />
          Request service
        </button>
      </div>

      {/* success/error alerts */}
      {successMsg && (
        <div className="mb-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-4 w-4" /> {successMsg}
          </span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* requests list */}
      <div className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold">Your requests</h3>
        </div>

        {loadingRequests ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-black/5"
              />
            ))}
          </div>
        ) : requests.length ? (
          <ol className="relative ml-3 border-l border-black/10">
            {requests.map((r, idx) => {
              const isLast = idx === requests.length - 1;
              const icon =
                r.request_type === "cleaning"
                  ? "🧹"
                  : r.request_type === "repair"
                  ? "🛠️"
                  : r.request_type === "maintenance"
                  ? "🧰"
                  : "➕";
              return (
                <li key={r.id} className="pl-6">
                  <span
                    className={[
                      "absolute -left-[7px] mt-4 h-3 w-3 rounded-full ring-4 ring-white",
                      r.status === "completed"
                        ? "bg-emerald-500"
                        : r.status === "in_progress"
                        ? "bg-blue-500"
                        : r.status === "canceled"
                        ? "bg-gray-400"
                        : "bg-amber-500",
                    ].join(" ")}
                  />
                  <div className="mb-4 rounded-xl border border-black/10 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="truncate text-sm font-semibold">
                            <span className="mr-1">{icon}</span>
                            {r.request_type.charAt(0).toUpperCase() +
                              r.request_type.slice(1)}
                          </div>
                          <StatusPill s={r.status} />
                        </div>
                        <div className="mt-0.5 line-clamp-2 text-xs text-black/70">
                          {r.description || "No description"}
                        </div>
                        <div className="mt-1 text-[11px] text-black/50">
                          {new Date(r.created_at).toLocaleString()}
                          {r.assigned_to && (
                            <> · Assigned worker ID: {r.assigned_to}</>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {r.status !== "completed" &&
                          r.status !== "canceled" && (
                            <button
                              onClick={async () => {
                                try {
                                  await completeReq.mutateAsync(r.id);
                                } catch {}
                              }}
                              className="btn btn-outline"
                            >
                              Mark completed
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                  {isLast && (
                    <div className="absolute -left-px bottom-0 h-4 w-[2px] bg-gradient-to-b from-black/10 to-transparent" />
                  )}
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="rounded-xl border border-dashed border-black/15 p-6 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="font-medium">No requests yet</div>
            <p className="mx-auto mt-1 max-w-sm text-sm text-black/70">
              Click “Request service” to submit cleaning, repair, or maintenance
              tasks.
            </p>
          </div>
        )}
      </div>

      {/* modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Request service">
        <form className="grid grid-cols-1 gap-4" onSubmit={submit}>
          {/* segmented control */}
          <div>
            <label className="mb-1 block text-sm font-medium text-black/80">
              Service type
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { value: "cleaning", label: "Cleaning", icon: "🧹" },
                { value: "repair", label: "Repair", icon: "🛠️" },
                { value: "maintenance", label: "Maint.", icon: "🧰" },
                { value: "other", label: "Other", icon: "➕" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setReqType(opt.value as any)}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm transition",
                    reqType === opt.value
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white hover:shadow",
                  ].join(" ")}
                  aria-pressed={reqType === opt.value}
                >
                  <span className="mr-1">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black/80">
              Description
            </label>
            <textarea
              value={reqDesc}
              onChange={(e) => setReqDesc(e.target.value)}
              placeholder="Short description e.g. 'Kitchen sink is leaking under the cabinet'"
              rows={4}
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow"
            />
            <div className="mt-1 text-right text-[11px] text-black/50">
              {reqDesc.length}/280
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createReq.isPending}
              className="btn btn-primary"
            >
              <Wrench className="h-4 w-4" />
              {createReq.isPending ? "Submitting…" : "Submit request"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
export default ServicesContent;
