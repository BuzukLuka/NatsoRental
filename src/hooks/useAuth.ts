import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import type { Register, TokenPair } from "@/types/api";

interface LoginPayload {
  username: string;
  password: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: Register) => {
      const res = await api.post("/users/register/", payload);
      return res.data;
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await api.post<TokenPair>("/users/login/", payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/users/logout/");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
    onSuccess: () => queryClient.removeQueries(),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await api.get("/users/me/");
      return res.data;
    },
  });
}
