// src/providers/AppProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { RoomList, User } from "@/types/api";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/hooks/useAuth";
import type { Filters } from "@/types";

interface AppContextValue {
  user: User | null;
  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  rooms: RoomList[] | undefined;
  isLoading: boolean;
  refreshRooms: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Filters
  const [filters, setFilters] = useState<Filters>({});

  // Rooms (refetch on filters change)
  const { data: rooms, isLoading } = useRooms(filters);

  // ✅ Stable callback to satisfy react-hooks/exhaustive-deps
  const refreshRooms = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
  }, [queryClient]);

  const value = useMemo<AppContextValue>(
    () => ({
      user: user ?? null,
      filters,
      setFilters: (f: Partial<Filters>) =>
        setFilters((prev) => ({ ...prev, ...f })),
      rooms,
      isLoading,
      refreshRooms,
    }),
    [user, filters, rooms, isLoading, refreshRooms]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider />");
  return ctx;
}
