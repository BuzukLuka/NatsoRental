// hooks/useNotifications.ts
"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/client";

/* =========================================================
   Types (UI-facing)
========================================================= */
export type NotiType = "payment" | "message" | "system" | "listing";

export type Notification = {
  id: number;
  type: NotiType; // derived from server's data.type or "system"
  title: string | null;
  body: string | null; // server: message
  href: string | null; // server: link
  created_at: string; // ISO
  read_at: string | null; // null => unread
  // optional raw
  is_read?: boolean;
  level?: "info" | "success" | "warning" | "error";
  data?: Record<string, any> | null;
};

type DRFPage<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

/* =========================================================
   Helpers
========================================================= */
function normalize(n: any): Notification {
  // Prefer data.type from backend; fall back to "system"
  const rawType = n?.type ?? n?.data?.type;
  const uiType: NotiType =
    rawType === "payment" || rawType === "message" || rawType === "listing"
      ? rawType
      : "system";

  return {
    id: Number(n?.id),
    type: uiType,
    title: n?.title ?? n?.verb ?? null,
    body: n?.body ?? n?.message ?? null,
    href: n?.href ?? n?.link ?? null,
    created_at: n?.created_at ?? new Date().toISOString(),
    read_at: n?.read_at ?? (n?.is_read ? new Date().toISOString() : null),
    is_read: !!n?.is_read,
    level: n?.level,
    data: n?.data ?? null,
  };
}

function nextPageFromUrl(next: string | null) {
  if (!next) return undefined;
  try {
    const u = new URL(
      next,
      typeof window === "undefined" ? "http://x" : window.location.origin
    );
    const p = u.searchParams.get("page");
    return p ? Number(p) : undefined;
  } catch {
    return undefined;
  }
}

/* =========================================================
   Queries / Mutations
========================================================= */

// If your Axios baseURL is `/api`, keep these relative ("/notifications/...").
// Endpoints mounted at path("api/notifications/", include("notifications.urls"))
export function useUnreadCount(enabled = true) {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await api.get<{ count: number }>(
        "/notifications/unread-count/"
      );
      return res.data?.count ?? 0;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled,
  });
}

export function useInfiniteNotifications(
  opts: {
    type?: NotiType | "all";
    unreadOnly?: boolean;
    enabled?: boolean;
  } = {}
) {
  const { type, unreadOnly, enabled = true } = opts;

  return useInfiniteQuery({
    queryKey: [
      "notifications",
      "list",
      { type: type ?? "all", unreadOnly: !!unreadOnly },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, any> = { page: pageParam };
      if (type && type !== "all") params.type = type;
      if (unreadOnly) params.unread = "true";

      const res = await api.get("/notifications/", { params });

      // Accept both paginated {results: [...]} and raw arrays [...]
      const data = res.data;
      if (Array.isArray(data)) {
        return {
          count: data.length,
          next: null,
          previous: null,
          results: data as Notification[],
        };
      }
      return data as DRFPage<Notification>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next) return undefined;
      try {
        const u = new URL(lastPage.next, window.location.origin);
        const p = u.searchParams.get("page");
        return p ? Number(p) : undefined;
      } catch {
        return undefined;
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/notifications/${id}/mark-read/`);
    },
    onSuccess: (_data, id) => {
      const now = new Date().toISOString();

      // Optimistically update cached pages
      qc.setQueriesData<{ pages: DRFPage<Notification>[]; pageParams: any[] }>(
        { queryKey: ["notifications", "list"] as any, exact: false },
        (old) => {
          if (!old) return old;
          const pages = old.pages.map((pg) => ({
            ...pg,
            results: pg.results.map((n) =>
              n.id === id
                ? { ...n, read_at: n.read_at ?? now, is_read: true }
                : n
            ),
          }));
          return { ...old, pages };
        }
      );

      // Refresh unread count
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/notifications/mark-all-read/");
    },
    onSuccess: () => {
      const now = new Date().toISOString();

      // Optimistically mark all cached as read
      qc.setQueriesData<{ pages: DRFPage<Notification>[]; pageParams: any[] }>(
        { queryKey: ["notifications", "list"] as any, exact: false },
        (old) => {
          if (!old) return old;
          const pages = old.pages.map((pg) => ({
            ...pg,
            results: pg.results.map((n) =>
              n.read_at ? n : { ...n, read_at: now, is_read: true }
            ),
          }));
          return { ...old, pages };
        }
      );

      // Sync with server
      qc.setQueryData(["notifications", "unread-count"], 0);
      qc.invalidateQueries({ queryKey: ["notifications", "list"] });
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
}
