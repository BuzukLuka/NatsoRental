"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  // 👇 add this
  const [showPw, setShowPw] = useState(false);
  const togglePw = () => setShowPw((s) => !s);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form.username, form.password);
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid credentials.");
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
            />
          </div>

          {/* Password with eye toggle */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 pr-11 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              />

              {/* Eye button */}
              <button
                type="button"
                onClick={togglePw}
                aria-label={showPw ? "Hide password" : "Show password"}
                aria-pressed={showPw}
                title={showPw ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-2 my-auto grid h-8 w-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              >
                {/* Eye / Eye-off inline SVG (no extra deps) */}
                {showPw ? (
                  // Eye Off
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10.58 10.58a3 3 0 004.24 4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 10.5 7.5a11.08 11.08 0 01-3.22 4.9M6.7 6.7A11.1 11.1 0 001.5 12.5 11.06 11.06 0 006.6 17.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  // Eye
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-yellow py-2 font-semibold text-black hover:shadow disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link href="/register" className="font-medium text-brand-yellow hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-center text-sm text-gray-500">
            <Link href="/forgot-password" className="font-medium text-gray-600 hover:underline">
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
