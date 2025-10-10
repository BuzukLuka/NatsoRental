"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token"); // if Django sends ?token=XYZ in email

  const [form, setForm] = useState({
    password: "",
    password2: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      token: string | null;
      password: string;
      password2: string;
    }) => {
      const res = await api.post("/users/reset-password/", data);
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).join(", ") ||
        "Reset failed.";
      setError(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }

    mutate({ ...form, token });
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Reset Password</h1>

        {success ? (
          <p className="text-center text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
            Password reset successful! Redirecting to login...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password2: e.target.value }))
                }
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
              {isPending ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
