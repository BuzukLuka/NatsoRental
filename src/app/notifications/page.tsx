// app/notifications/page.tsx
"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Settings,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  Home,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  useInfiniteNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useUnreadCount,
  type NotiType,
  type Notification,
} from "@/hooks/useNotifications";

/* ────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────── */
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
  const today = new Date();
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  if (same(d, today)) return "Today";
  if (same(d, y)) return "Yesterday";
  return d.toLocaleDateString();
}
function isUnread(n: Notification) {
  return !n?.read_at;
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

/* ────────────────────────────────────────────────────────────
   Small UI bits
──────────────────────────────────────────────────────────── */
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
  markingAll,
}: {
  totalUnread: number;
  onMarkAll: () => void;
  markingAll: boolean;
}) {
  return (
    <div className="sticky top-16 z-[5] mb-4 rounded-2xl border border-black/10 bg-white/80 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-black/70">
          <Bell className="h-5 w-5" />
          <span className="font-semibold">Notifications</span>
          <span className="text-black/40">•</span>
          <span>{totalUnread} unread</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAll}
            disabled={markingAll || totalUnread === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm transition hover:translate-y-[-1px] hover:shadow-md disabled:opacity-60"
          >
            {markingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark all read
          </button>
          <Link
            href="/settings/notifications"
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </div>
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
    <div
      role="tablist"
      aria-label="Notification filters"
      className="mb-6 flex w-full gap-2 overflow-x-auto"
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
            value === t.key
              ? "border-black/20 bg-black text-white shadow-md"
              : "border-black/10 bg-white text-black hover:shadow-md"
          }`}
        >
          {t.key !== "all" && iconFor(t.key as NotiType)}
          {t.label}
        </button>
      ))}
    </div>
  );
}

function NotiRow({
  n,
  onRead,
  marking,
}: {
  n: Notification;
  onRead: (id: number) => void;
  marking?: boolean;
}) {
  const unread = isUnread(n);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-md">
      {unread && (
        <span className="absolute left-0 top-0 h-full w-1 bg-amber-500" />
      )}
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 rounded-xl p-2 ring-1 ring-black/10 ${
            unread ? "bg-amber-50" : "bg-black/5"
          }`}
        >
          {iconFor(n?.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="line-clamp-1 font-semibold leading-tight">
              {n?.title}
            </h3>
          </div>
          {n?.body && (
            <p className="mt-1 line-clamp-2 text-sm text-black/70">{n.body}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-black/60">
            <Pill>{n?.type}</Pill>
            <span>•</span>
            <span>{timeAgo(n?.created_at)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {n?.href && (
            <Link
              href={n.href}
              className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
              onClick={() => unread && onRead(n.id)}
            >
              Open <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
          {unread && (
            <button
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium shadow-sm transition hover:translate-y-[-1px] hover:shadow-md disabled:opacity-60"
              onClick={() => onRead(n.id)}
              disabled={marking}
            >
              {marking ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Mark read"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────── */
import { useState } from "react";

export default function NotificationsPage() {
  const [tab, setTab] = useState<"all" | NotiType>("all");

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteNotifications({ type: tab });

  const unreadCount = useUnreadCount();

  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const flat = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.results);
  }, [data]);

  const grouped = useMemo(() => {
    const map = new Map<string, Notification[]>();
    for (const n of flat) {
      const k = dateKey(n?.created_at);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(n);
    }
    return Array.from(map.entries());
  }, [flat]);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <header className="mb-2">
        <h1 className="text-2xl font-extrabold">Notifications</h1>
        <p className="text-sm text-black/70">All your updates in one place</p>
      </header>

      <Toolbar
        totalUnread={unreadCount.data ?? 0}
        onMarkAll={() => markAll.mutate()}
        markingAll={markAll.isPending}
      />
      <Tabs value={tab} onChange={setTab} />

      {isLoading ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
          Loading…
        </div>
      ) : flat.length === 0 ? (
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
        <>
          <div className="flex flex-col gap-4">
            {grouped.map(([label, list]) => (
              <section key={label}>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/60">
                  {label}
                </div>
                <div className="flex flex-col gap-3">
                  {list.map((n) => (
                    <NotiRow
                      key={n?.id}
                      n={n}
                      onRead={(id) => markOne.mutate(id)}
                      marking={markOne.isPending}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center">
            {hasNextPage ? (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm transition hover:translate-y-[-1px] hover:shadow-md disabled:opacity-60"
              >
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </button>
            ) : (
              <div className="text-xs text-black/50">No more notifications</div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
