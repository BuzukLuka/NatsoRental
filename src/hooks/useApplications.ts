// hooks/useApplications.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import api from "@/lib/client";

export type CreateApplicationInput = {
  room: number; // room id
  full_name: string;
  phone?: string;
  move_in_date?: string; // "YYYY-MM-DD"
  employer?: string;
  monthly_income?: string; // string is fine; backend Decimal
  has_pets?: boolean;
  notes?: string;
};

export function useCreateApplication() {
  return useMutation({
    mutationFn: async (payload: CreateApplicationInput) => {
      const res = await api.post("/applications/", payload);
      return res.data;
    },
  });
}
