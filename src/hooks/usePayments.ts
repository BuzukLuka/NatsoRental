import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import type { Payment } from "@/types/api";

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async (): Promise<Payment[]> => {
      const res = await api.get("/payments/");
      return res.data;
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Payment>) => {
      const res = await api.post("/payments/", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });
}
