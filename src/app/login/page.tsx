"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(form.username, form.password);
      router.push("/"); // ✅ redirect to home after login
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid credentials.");
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
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
            <Link
              href="/register"
              className="font-medium text-brand-yellow hover:underline"
            >
              Sign up
            </Link>
          </p>

          <p className="text-center text-sm text-gray-500">
            <Link
              href="/forgot-password"
              className="font-medium text-gray-600 hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
