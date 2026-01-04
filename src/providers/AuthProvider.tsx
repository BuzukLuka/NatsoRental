// src/providers/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/client";
import type { Register, User } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: Register) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache user data in memory to reduce /me calls
let cachedUser: User | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Check if we have auth cookies (can't read HttpOnly cookies in JS)
  // So we check localStorage as fallback indicator
  const hasToken =
    typeof window !== "undefined" &&
    (!!localStorage.getItem("access") ||
     !!localStorage.getItem("refresh") ||
     // Assume logged in if we have cached user (from previous session with cookies)
     !!cachedUser);

  const refreshUser = useCallback(async (forceRefresh = false) => {
    // Use cached data if available and fresh
    const now = Date.now();
    if (!forceRefresh && cachedUser && (now - lastFetchTime) < CACHE_DURATION) {
      setUser(cachedUser);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/users/me/");
      const userData = (res.data?.user as User) ?? null;

      // Update cache
      cachedUser = userData;
      lastFetchTime = Date.now();
      setUser(userData);
    } catch (error: any) {
      // If 401, tokens are invalid - clear everything
      if (error.response?.status === 401) {
        cachedUser = null;
        lastFetchTime = 0;
        setUser(null);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } else {
        // For other errors, keep existing user data
        console.error("Failed to fetch user:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch user if we have tokens and no cached data
    if (hasToken && !cachedUser) {
      void refreshUser();
    } else if (hasToken && cachedUser) {
      // Use cached data immediately
      setUser(cachedUser);
    }
  }, [hasToken, refreshUser]);

  const login = async (username: string, password: string) => {
    const res = await api.post("/users/login/", { username, password });

    // Backend sets HttpOnly cookies automatically
    // Store tokens in localStorage as fallback/indicator (optional)
    if (res.data.access) {
      localStorage.setItem("access", res.data.access as string);
    }
    if (res.data.refresh) {
      localStorage.setItem("refresh", res.data.refresh as string);
    }

    // Force refresh to get fresh user data
    await refreshUser(true);
  };

  const register = async (data: Register) => {
    await api.post("/users/register/", data);
  };

  const logout = async () => {
    try {
      await api.post("/users/logout/");
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear everything
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    cachedUser = null;
    lastFetchTime = 0;
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
        refreshUser: () => refreshUser(true),
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
