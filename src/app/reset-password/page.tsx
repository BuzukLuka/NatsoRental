// src/app/reset-password/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/client";
import { useRouter, useSearchParams } from "next/navigation";

// (сонголт) static пререндерээс зайлсхийж CSR bailout анхааруулгыг намдаана
export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-center text-2xl font-bold">
              Reset Password
            </h1>
            <p className="text-sm text-black/60">Loading…</p>
          </div>
        </section>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token"); // e.g. /reset-password?token=XYZ

  const [form, setForm] = useState({ password: "", password2: "" });
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
    onError: (err: unknown) => {
      // 🔒 typesafe error extraction
      let msg = "Reset failed.";
      if (typeof err === "object" && err && "response" in err) {
        const e = err as { response?: { data?: any } };
        const d = e.response?.data;
        msg =
          (typeof d?.detail === "string" && d.detail) ||
          (d && typeof d === "object" ? Object.values(d).join(", ") : msg);
      }
      setError(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Missing or invalid reset token.");
      return;
    }
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
          <p className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-center text-sm text-green-700">
            Password reset successful! Redirecting to login...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!token && (
              <p className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                Missing token. Please use the reset link from your email.
              </p>
            )}

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
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow"
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
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
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
