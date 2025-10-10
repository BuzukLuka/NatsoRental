import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import type { Booking } from "@/types/api";

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async (): Promise<Booking[]> => {
      const res = await api.get("/bookings/");
      return res.data;
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Booking>) => {
      const res = await api.post("/bookings/", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/bookings/${id}/`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });
}
