// hooks/useIdentity.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";

export type Identity = {
  id: number;
  doc_type: "id_card" | "passport" | "driver_license";
  doc_front: string | null;
  doc_back: string | null;
  selfie: string | null;
  address_proof: string | null;
  status: "draft" | "submitted" | "approved" | "rejected";
  rejection_reason: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export function useIdentity(enabled = true) {
  return useQuery<Identity>({
    queryKey: ["identity"],
    queryFn: async () => (await api.get("/users/identity/")).data, // returns single object for user
    enabled,
  });
}

export function useUpdateIdentity(id: number | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fd: FormData) =>
      await api.patch(`/users/identity/${id}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["identity"] }),
  });
}

export function useSubmitIdentity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      await api.post(`/users/identity/${id}/submit/`),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["identity"] });
      await qc.invalidateQueries({ queryKey: ["me"] }); // in case you mirror anything
    },
  });
}
