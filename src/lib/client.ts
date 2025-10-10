// src/lib/client.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api", // ✅ points to Django API, not Next.js
  timeout: 10000,
  withCredentials: true, // ✅ allow cookie-based JWT
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Automatically attach token if stored (for fallback)
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Global error handler (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized — consider redirecting to /login");
    }
    return Promise.reject(error);
  }
);

export default api;
