"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await api.post("/users/forgot-password/", data);
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).join(", ") ||
        "Something went wrong.";
      setError(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutate({ email });
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Forgot Password</h1>

        {success ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-gray-600">
              If an account with <strong>{email}</strong> exists, we’ve sent a
              reset link to your email.
            </p>
            <Link
              href="/login"
              className="inline-block rounded-xl bg-brand-yellow px-4 py-2 font-semibold text-black hover:shadow"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter your email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              disabled={isPending}
              className="w-full rounded-xl bg-brand-yellow py-2 font-semibold text-black hover:shadow disabled:opacity-70"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
              <Link
                href="/login"
                className="font-medium text-brand-yellow hover:underline"
              >
                Back to login
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
