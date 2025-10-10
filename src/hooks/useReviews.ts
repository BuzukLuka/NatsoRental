import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import type { RoomReview } from "@/types/api";

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async (): Promise<RoomReview[]> => {
      const res = await api.get("/reviews/");
      return res.data;
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<RoomReview>) => {
      const res = await api.post("/reviews/", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
