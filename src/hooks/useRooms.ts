"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/client";
import type { RoomDetail, RoomList } from "@/types/api";
import { Filters } from "@/types";

const buildQueryString = (filters: Filters) => {
  const params = new URLSearchParams();
  if (filters.q) params.append("search", filters.q);
  if (filters.priceMin) params.append("min_price", filters.priceMin.toString());
  if (filters.priceMax) params.append("max_price", filters.priceMax.toString());
  if (filters.type) params.append("type", filters.type);
  if (filters.tenure) params.append("tenure", filters.tenure);
  if (filters.petsAllowed) params.append("pets_allowed", "true");
  return params.toString();
};

export function useRooms(filters: Filters) {
  return useQuery({
    queryKey: ["rooms", filters],
    queryFn: async () => {
      const query = buildQueryString(filters);
      const res = await api.get<RoomList[]>(`/rooms/?${query}`);
      return res.data;
    },
  });
}

export function useRoom(slug: string) {
  return useQuery({
    queryKey: ["room", slug],
    queryFn: async (): Promise<RoomDetail> => {
      const res = await api.get(`/rooms/${slug}/`);
      return res.data;
    },
    enabled: !!slug,
  });
}
