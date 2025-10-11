"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { RoomList, User } from "@/types/api";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/hooks/useAuth";
import type { Filters } from "@/types";

// Context type
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

  // Auth hook handles user data
  const { user } = useAuth();

  // Filters state
  const [filters, setFilters] = useState<Filters>({});

  // Fetch rooms with React Query (auto refetch on filter change)
  const { data: rooms, isLoading } = useRooms(filters);

  // Manual refresh trigger (can be called after filters or other events)
  const refreshRooms = () => {
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
  };

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      user: user ?? null,
      filters,
      setFilters: (f: Partial<Filters>) =>
        setFilters((prev) => ({ ...prev, ...f })),
      rooms,
      isLoading,
      refreshRooms,
    }),
    [user, filters, rooms, isLoading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider />");
  return ctx;
}
