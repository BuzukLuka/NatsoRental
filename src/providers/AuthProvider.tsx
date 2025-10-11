// src/providers/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/client";
import type { Register, User } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; // UI-г блоклохгүй; зөвхөн “auth refresh явж байна” гэдгийг хэлнэ
  login: (username: string, password: string) => Promise<void>;
  register: (data: Register) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // ⛑️ өмнө нь true байснаас UI блоколж байсан
  const queryClient = useQueryClient();

  // URIDCHILSAN: access token байгаа эсэх
  const hasToken =
    typeof window !== "undefined" &&
    (!!localStorage.getItem("access") || !!localStorage.getItem("refresh"));

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/me/");
      setUser((res.data?.user as User) ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // token байвал background-д шинэчил; UI-г нуухгүй
    if (hasToken) {
      void refreshUser();
    }
    // token байхгүй бол шууд “зочин” төлөвөөр рэндэрлэ
  }, [hasToken]);

  const login = async (username: string, password: string) => {
    const res = await api.post("/users/login/", { username, password });
    localStorage.setItem("access", res.data.access as string);
    localStorage.setItem("refresh", res.data.refresh as string);
    await refreshUser();
  };

  const register = async (data: Register) => {
    await api.post("/users/register/", data);
  };

  const logout = async () => {
    try {
      await api.post("/users/logout/");
    } catch {}
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
};
