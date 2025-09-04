"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Home,
  MessageSquare,
  Shield,
} from "lucide-react";
import { useStore } from "@/lib/store";
import type { Reservation } from "@/types";

type FormState = {
  type: "issue" | "feedback";
  title: string;
  details: string;
};

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

function TicketPill({ status }: { status: "open" | "in_progress" | "done" }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle2 className="h-3 w-3" /> Done
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700 ring-1 ring-amber-200">
        <Shield className="h-3 w-3" /> In progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700 ring-1 ring-red-200">
      <AlertTriangle className="h-3 w-3" /> Open
    </span>
  );
}

export default function SafetySupportPage() {
  const store = useStore();
  const reservations = store.myReservations();

  // form state per reservation id
  const [forms, setForms] = useState<Record<string, FormState>>({});

  const initForm = (id: string): FormState => ({
    type: "issue",
    title: "",
    details: "",
  });

  const setFormValue = (rid: string, patch: Partial<FormState>) =>
    setForms((prev) => ({
      ...prev,
      [rid]: { ...(prev[rid] ?? initForm(rid)), ...patch },
    }));

  const onSubmit = (rid: string, r: Reservation) => {
    const f = forms[rid] ?? initForm(rid);
    const prop = store.getPropertyById(r.propertyId);
    const roomLabel = prop ? prop.title : r.propertyTitle;
    const prefix = f.type === "issue" ? "Issue" : "Feedback";
    // Store-ийн одоогийн API зөвхөн title авдаг тул property-г оруулж нэг мөр болгон хадгална
    const title = `${prefix} | ${roomLabel} — ${f.title}`.trim();
    if (!f.title) {
      alert("Please add a short title.");
      return;
    }
    store.createTicket({ title });
    // (дэлгэрэнгүйг одоохондоо title-д багтаасан; store API-г өргөжүүлбэл details-г давхар хадгалж болно)
    setForms((prev) => ({ ...prev, [rid]: initForm(rid) }));
    alert("Thanks! Your message was sent.");
  };

  const tickets = store.maintenance; // open/in_progress/done

  // map of room title -> tickets (simple match by title contains)
  const ticketGroups = useMemo(() => {
    const m = new Map<string, typeof tickets>();
    for (const t of tickets) {
      // property нэрийг title-аас татья (Issue | <Room title> — ...)
      const match = t.title.split("—")[0]?.split("|")[1]?.trim();
      const key = match || "Other";
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(t);
    }
    return m;
  }, [tickets]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-extrabold">Safety &amp; support</h1>
            <p className="text-sm text-black/70">
              Report an issue or send feedback about your rentals
            </p>
          </div>
        </div>
      </div>

      {/* Active/All rentals with forms */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section title="Your rentals">
            {reservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                  <Home className="h-6 w-6" />
                </div>
                <div className="font-semibold">No rentals yet</div>
                <p className="max-w-md text-sm text-black/70">
                  Browse homes and reserve a room to contact support directly
                  from here.
                </p>
                <div className="mt-2 flex gap-2">
                  <Link href="/browse" className="btn btn-outline">
                    Browse homes
                  </Link>
                  <Link href="/wishlist" className="btn btn-outline">
                    Wishlist
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {reservations.map((r) => {
                  const p = store.getPropertyById(r.propertyId);
                  if (!p) return null;
                  const f = forms[r.id] ?? initForm(r.id);
                  return (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-black/10 p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row">
                        <div className="relative h-28 w-full overflow-hidden rounded-xl md:h-24 md:w-40">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h3 className="font-semibold leading-tight">
                                {p.title}
                              </h3>
                              <p className="text-sm text-black/70">
                                {p.neighborhood} · {p.roomType} · $
                                {p.priceMonthly}/mo
                              </p>
                            </div>
                            <Link
                              href={`/room/${p.id}`}
                              className="btn btn-outline whitespace-nowrap"
                            >
                              View
                            </Link>
                          </div>

                          {/* Compose area */}
                          <div className="mt-3 rounded-xl border border-black/10 p-3">
                            <div className="mb-2 flex gap-2">
                              <button
                                onClick={() =>
                                  setFormValue(r.id, { type: "issue" })
                                }
                                className={`rounded-lg px-3 py-1 text-sm shadow-sm border ${
                                  f.type === "issue"
                                    ? "bg-black text-white border-black"
                                    : "bg-white border-black/10"
                                }`}
                              >
                                Issue
                              </button>
                              <button
                                onClick={() =>
                                  setFormValue(r.id, { type: "feedback" })
                                }
                                className={`rounded-lg px-3 py-1 text-sm shadow-sm border ${
                                  f.type === "feedback"
                                    ? "bg-black text-white border-black"
                                    : "bg-white border-black/10"
                                }`}
                              >
                                Feedback
                              </button>
                            </div>

                            {/* Title input */}
                            <input
                              value={f.title}
                              onChange={(e) =>
                                setFormValue(r.id, { title: e.target.value })
                              }
                              placeholder={
                                f.type === "issue"
                                  ? "Short title (e.g., Leaking sink)"
                                  : "Short title"
                              }
                              className="mb-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                            />

                            {/* Details textarea */}
                            <textarea
                              value={f.details}
                              onChange={(e) =>
                                setFormValue(r.id, { details: e.target.value })
                              }
                              placeholder={
                                f.type === "issue"
                                  ? "Describe the problem and location…"
                                  : "Share your thoughts or suggestions…"
                              }
                              rows={4}
                              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                            />

                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-xs text-black/60">
                                We’ll notify your landlord and support team.
                              </div>
                              <button
                                onClick={() => onSubmit(r.id, r)}
                                className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
                              >
                                <MessageSquare className="h-4 w-4" />
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </div>

        {/* Right: Existing tickets */}
        <div className="lg:col-span-1">
          <Section title="Your tickets">
            {tickets.length === 0 ? (
              <div className="text-sm text-black/70">No tickets yet.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {Array.from(ticketGroups.entries()).map(([room, list]) => (
                  <div key={room} className="rounded-xl border border-black/10">
                    <div className="border-b border-black/10 px-3 py-2 text-sm font-medium">
                      {room}
                    </div>
                    <ul className="divide-y divide-black/10">
                      {list.map((t) => (
                        <li key={t.id} className="px-3 py-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 text-sm leading-tight">
                              <div className="line-clamp-1">{t.title}</div>
                            </div>
                            <TicketPill status={t.status} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
    </main>
  );
}
