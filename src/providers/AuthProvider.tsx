"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/client";
import type { Register } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: Register) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch user from backend if token exists
  const refreshUser = async () => {
    try {
      const res = await api.get("/users/me/");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.post("/users/login/", { username, password });
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    await refreshUser();
  };

  const register = async (data: Register) => {
    await api.post("/users/register/", data);
    // Optionally auto-login after register
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
  if (!ctx)
    throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
};
