"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import type { User } from "@/types/api";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/users/me/");
      return res.data;
    },
    retry: false,
  });

  const login = useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const res = await api.post("/users/login/", body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await api.post("/accounts/logout/");
    },
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
    },
  });

  return { user, login, logout };
}

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/accounts/me/");
      return res.data;
    },
  });
}
