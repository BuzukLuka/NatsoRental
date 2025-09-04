"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  Settings,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  Home,
} from "lucide-react";
import Link from "next/link";

// Types
export type NotiType = "payment" | "message" | "system" | "listing";
export type Noti = {
  id: string;
  type: NotiType;
  title: string;
  body?: string;
  href?: string; // where to navigate
  createdAt: string; // ISO
  unread?: boolean;
};

// Mock data (swap to your API/store)
const seed: Noti[] = [
  {
    id: "n1",
    type: "payment",
    title: "Invoice paid successfully",
    body: "Your rent deposit for Brentwood room is confirmed.",
    href: "/payments/123",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5m ago
    unread: true,
  },
  {
    id: "n2",
    type: "message",
    title: "New message from Sarah (Kensington)",
    body: "Hi! The room is still available. When would you like to tour?",
    href: "/inbox/sarah",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    unread: true,
  },
  {
    id: "n3",
    type: "listing",
    title: "Inglewood Master room price changed",
    body: "Now $830/mo (was $850).",
    href: "/property/inglewood-master",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
  {
    id: "n4",
    type: "system",
    title: "Scheduled maintenance completed",
    body: "All services are back online.",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
  {
    id: "n5",
    type: "payment",
    title: "Refund processed",
    body: "Your application fee refund has been issued.",
    href: "/payments/456",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
  },
];

// helpers
function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function dateKey(iso: string) {
  const d = new Date(iso);
  // Today / Yesterday / YYYY-MM-DD
  const today = new Date();
  const isSame = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  if (isSame(d, today)) return "Today";
  if (isSame(d, y)) return "Yesterday";
  return d.toLocaleDateString();
}

function iconFor(t: NotiType) {
  const cls = "h-4 w-4";
  switch (t) {
    case "payment":
      return <CreditCard className={cls} />;
    case "message":
      return <MessageSquare className={cls} />;
    case "system":
      return <AlertTriangle className={cls} />;
    case "listing":
      return <Home className={cls} />;
  }
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-xs font-medium text-black shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function Toolbar({
  totalUnread,
  onMarkAll,
}: {
  totalUnread: number;
  onMarkAll: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-black/70">
        <Bell className="h-5 w-5" />
        <span>Notifications</span>
        <span className="text-black/40">•</span>
        <span>{totalUnread} unread</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMarkAll}
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm transition hover:shadow-md"
        >
          <CheckCheck className="h-4 w-4" /> Mark all read
        </button>
        <Link
          href="/settings/notifications"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm transition hover:shadow-md"
        >
          <Settings className="h-4 w-4" /> Settings
        </Link>
      </div>
    </div>
  );
}

function Tabs({
  value,
  onChange,
}: {
  value: "all" | NotiType;
  onChange: (v: "all" | NotiType) => void;
}) {
  const tabs: { key: "all" | NotiType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "message", label: "Messages" },
    { key: "payment", label: "Payments" },
    { key: "listing", label: "Listings" },
    { key: "system", label: "System" },
  ];
  return (
    <div className="mb-6 flex w-full gap-2 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm transition ${
            value === t.key
              ? "border-black/20 bg-black text-white shadow-md"
              : "border-black/10 bg-white text-black hover:shadow-md"
          }`}
        >
          {t.key !== "all" && iconFor(t.key)}
          {t.label}
        </button>
      ))}
    </div>
  );
}

function NotiCard({ n, onRead }: { n: Noti; onRead: (id: string) => void }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-xl bg-black/5 p-2">{iconFor(n.type)}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="line-clamp-1 font-semibold leading-tight">
              {n.title}
            </h3>
            {n.unread && (
              <span className="ml-1 inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500" />
            )}
          </div>
          {n.body && (
            <p className="mt-1 line-clamp-2 text-sm text-black/70">{n.body}</p>
          )}
          <div className="mt-2 flex items-center gap-2 text-xs text-black/60">
            <Pill>{n.type}</Pill>
            <span>•</span>
            <span>{timeAgo(n.createdAt)}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {n.href && (
            <Link
              href={n.href}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium shadow-sm transition hover:shadow-md"
              onClick={() => onRead(n.id)}
            >
              Open
            </Link>
          )}
          {n.unread && (
            <button
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium shadow-sm transition hover:shadow-md"
              onClick={() => onRead(n.id)}
            >
              Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [items, setItems] = useState<Noti[]>(seed);
  const [tab, setTab] = useState<"all" | NotiType>("all");

  const filtered = useMemo(
    () => items.filter((n) => (tab === "all" ? true : n.type === tab)),
    [items, tab]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Noti[]>();
    for (const n of filtered) {
      const k = dateKey(n.createdAt);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(n);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const totalUnread = items.filter((n) => n.unread).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold">Notifications</h1>
        <p className="text-sm text-black/70">All your updates in one place</p>
      </header>

      <Toolbar totalUnread={totalUnread} onMarkAll={markAllRead} />
      <Tabs value={tab} onChange={setTab} />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <Bell className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">No notifications</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-black/70">
            You’re all caught up. We’ll let you know when there’s something new.
          </p>
          <Link
            href="/browse"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
          >
            Browse homes
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map(([label, list]) => (
            <section key={label}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/60">
                {label}
              </div>
              <div className="flex flex-col gap-3">
                {list.map((n) => (
                  <NotiCard key={n.id} n={n} onRead={markRead} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
