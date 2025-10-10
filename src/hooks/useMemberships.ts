import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import type { MembershipPlan, HostMembership } from "@/types/api";

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async (): Promise<MembershipPlan[]> => {
      const res = await api.get("/plans/");
      return res.data;
    },
  });
}

export function useMemberships() {
  return useQuery({
    queryKey: ["memberships"],
    queryFn: async (): Promise<HostMembership[]> => {
      const res = await api.get("/memberships/");
      return res.data;
    },
  });
}

export function useCreateMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<HostMembership>) => {
      const res = await api.post("/memberships/", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memberships"] }),
  });
}
