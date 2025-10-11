// hooks/useServiceRequests.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import type { ServiceRequest } from "@/types/serviceRequests";

export function useServiceRequests(enabled: boolean) {
  return useQuery({
    queryKey: ["service-requests"],
    queryFn: async (): Promise<ServiceRequest[]> => {
      const res = await api.get("/service-requests/");
      // If your DRF doesn’t paginate, res.data is the array. If it paginates, adapt:
      return res.data.results ?? res.data;
    },
    enabled,
  });
}

export function useCreateServiceRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      booking_id: number;
      request_type: "cleaning" | "repair" | "maintenance" | "other";
      description?: string;
    }) => {
      const res = await api.post("/service-requests/", payload);
      return res.data as ServiceRequest;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
}

export function useMarkServiceRequestCompleted() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/service-requests/${id}/mark_completed/`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });
}
