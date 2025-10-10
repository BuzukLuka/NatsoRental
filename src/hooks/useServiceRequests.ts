import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import type { ServiceRequest } from "@/types/api";

export function useServiceRequests() {
  return useQuery({
    queryKey: ["service-requests"],
    queryFn: async (): Promise<ServiceRequest[]> => {
      const res = await api.get("/service-requests/");
      return res.data;
    },
  });
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ServiceRequest>) => {
      const res = await api.post("/service-requests/", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-requests"] }),
  });
}

export function useMarkServiceCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/service-requests/${id}/mark_completed/`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-requests"] }),
  });
}
