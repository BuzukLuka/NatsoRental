"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/client";
import type { RoomDetail, RoomList } from "@/types/api";
import { Filters } from "@/types";
import { buildRoomQuery } from "@/utils/queryParams";

export function useRooms(filters: Filters) {
  return useQuery({
    queryKey: ["rooms", filters],
    queryFn: async () => {
      const qs = buildRoomQuery(filters);
      const res = await api.get(`/rooms/?${qs}`);
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
