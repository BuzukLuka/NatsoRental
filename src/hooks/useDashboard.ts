import { useQuery } from "@tanstack/react-query";
import api from "@/lib/client";
import type { Dashboard } from "@/types/dashboard";

export function useDashboard(enabled = true) {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async (): Promise<Dashboard> => {
      const res = await api.get("/users/me/");
      return res.data;
    },
    enabled,
  });
}
