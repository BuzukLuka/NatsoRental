"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// Landlord room management hooks
export function useMyRooms() {
  return useQuery({
    queryKey: ["my-rooms"],
    queryFn: async (): Promise<RoomList[]> => {
      const res = await api.get("/rooms/");
      return res.data;
    },
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post("/rooms/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, formData }: { slug: string; formData: FormData }) => {
      const res = await api.patch(`/rooms/${slug}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      await api.delete(`/rooms/${slug}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// Property types
export function usePropertyTypes() {
  return useQuery({
    queryKey: ["property-types"],
    queryFn: async () => {
      const res = await api.get("/property-types/");
      return res.data;
    },
  });
}
