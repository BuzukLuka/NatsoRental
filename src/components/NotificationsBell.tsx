// components/NotificationsBell.tsx
"use client";

import {
  Bell,
  ExternalLink,
  Loader2,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useInfiniteNotifications,
  useUnreadCount,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  type Notification as APINotification, // your type if exported
} from "@/hooks/useNotifications";

/* --- Small helpers & tolerant getters ---------------------------- */

type NotiType = "payment" | "message" | "system" | "listing";

function iconFor(t?: string) {
  const cls = "h-3.5 w-3.5";
  switch (t) {
    case "payment":
      return <CreditCard className={cls} />;
    case "message":
      return <MessageSquare className={cls} />;
    case "system":
      return <AlertTriangle className={cls} />;
    case "listing":
      return <Home className={cls} />;
    default:
      return <Bell className={cls} />;
  }
}

function timeAgoSafe(iso?: string) {
  if (!iso) return "";
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(ms).toLocaleDateString();
}

/** Some backends use `read_at`, others boolean `is_read`. */
function isUnread(n: any): boolean {
  if (!n) return false;
  if ("read_at" in n) return !n.read_at;
  if ("is_read" in n) return !n.is_read;
  return true; // default to unread if unknown
}

/** Some backends use `href`, others `link`. */
function getHref(n: any): string | undefined {
  return n?.href ?? n?.link ?? undefined;
}

/** Some backends camelCase createdAt. */
function getCreatedAt(n: any): string | undefined {
  return n?.created_at ?? n?.createdAt ?? undefined;
}

/** Some backends use `type`, others may use `level`/`category`. */
function getType(n: any): NotiType | undefined {
  return (n?.type ?? n?.level ?? n?.category) as NotiType | undefined;
}

/* ---------------------------------------------------------------- */

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);

  // Badge count
  const unreadCount = useUnreadCount();

  // Fetch only when open
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteNotifications({ enabled: open, type: "all" });

  const markAll = useMarkAllNotificationsRead();
  const markOne = useMarkNotificationRead();

  // Safely flatten pages → results[]; tolerate missing results
  const items = useMemo<any[]>(
    () =>
      (data?.pages ?? [])
        .flatMap((p: any) => (Array.isArray(p?.results) ? p.results : []))
        .filter(Boolean),
    [data]
  );

  // Close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={popRef}>
      <button
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white"
        aria-label="Notifications"
        onClick={() => setOpen((s) => !s)}
      >
        <Bell size={18} />
        {(unreadCount.data ?? 0) > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-yellow px-1 text-[10px] font-bold leading-none text-black">
            {unreadCount.data}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-[340px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 z-[2000]"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between gap-2 border-b border-black/10 px-3 py-2">
            <div className="text-sm font-semibold">Notifications</div>
            <button
              className="text-xs underline disabled:opacity-40"
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending || (unreadCount.data ?? 0) === 0}
            >
              {markAll.isPending ? "Marking…" : "Mark all read"}
            </button>
          </div>

          <div className="max-h-[360px] overflow-auto">
            {isLoading ? (
              <div className="flex items-center gap-2 p-3 text-sm text-black/60">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : items.length === 0 ? (
              <div className="p-3 text-sm text-black/60">No notifications</div>
            ) : (
              <>
                {items.map((n) => {
                  const unread = isUnread(n);
                  const href = getHref(n);
                  const createdAt = getCreatedAt(n);
                  const type = getType(n);
                  return (
                    <div
                      key={n.id ?? Math.random()}
                      className={`flex items-start gap-2 px-3 py-2 border-b border-black/5 ${
                        unread ? "bg-yellow-50/40" : ""
                      }`}
                    >
                      <div
                        className={`mt-1 rounded-xl p-2 ring-1 ring-black/10 ${
                          unread ? "bg-amber-50" : "bg-black/5"
                        }`}
                        title={type}
                      >
                        {iconFor(type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">
                          {n.title ?? n.verb ?? "Notification"}
                        </div>
                        {n.body && (
                          <div className="text-xs text-black/70 line-clamp-2">
                            {n.body}
                          </div>
                        )}
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-black/50">
                          <span>{timeAgoSafe(createdAt)}</span>
                          {unread && (
                            <button
                              className="underline"
                              onClick={() => n.id && markOne.mutate(n.id)}
                              disabled={markOne.isPending}
                            >
                              {markOne.isPending ? "…" : "Mark read"}
                            </button>
                          )}
                          {href && (
                            <Link
                              className="inline-flex items-center gap-1 underline"
                              href={href}
                              onClick={() => unread && n.id && markOne.mutate(n.id)}
                            >
                              Open <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="p-2 text-center">
                  {hasNextPage ? (
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs shadow-sm transition hover:translate-y-[-1px] hover:shadow-md disabled:opacity-60"
                    >
                      {isFetchingNextPage ? "Loading…" : "Load more"}
                    </button>
                  ) : (
                    <Link href="/notifications" className="text-sm underline">
                      View all
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
