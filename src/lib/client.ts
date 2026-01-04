// src/lib/client.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  timeout: 10000,
  withCredentials: true, // CRITICAL: Allow HttpOnly cookie transmission
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Helper to get CSRF token from cookies (if needed)
function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request interceptor: Attach CSRF token and fallback Bearer token
api.interceptors.request.use(
  (config) => {
    // Attach CSRF token for POST/PUT/PATCH/DELETE requests
    const csrfToken = getCsrfToken();
    if (csrfToken && config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    // Fallback: Attach Bearer token from localStorage if cookie auth fails
    // The backend will prefer HttpOnly cookies over this
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Try to refresh the token using HttpOnly cookie
      // Backend will read refresh_token from cookie automatically
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/users/token/refresh/`,
        {}, // Empty body - token comes from HttpOnly cookie
        { withCredentials: true }
      );

      // Backend sets new access_token in HttpOnly cookie automatically
      // If response contains tokens (backward compatibility), store them
      if (response.data?.access) {
        localStorage.setItem("access", response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
      }

      // Process queued requests
      processQueue();
      isRefreshing = false;

      // Retry the original request (now with fresh cookie)
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear tokens and redirect to login
      processQueue(refreshError);
      isRefreshing = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        // Only redirect if not already on login/register pages
        const currentPath = window.location.pathname;
        if (
          !currentPath.includes("/login") &&
          !currentPath.includes("/register")
        ) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
