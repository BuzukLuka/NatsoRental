"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/client";

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  password2: string;
  name?: string;
  phone?: string;
  role?: "renter" | "owner" | "worker";
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterPayload>({
    username: "",
    email: "",
    password: "",
    password2: "",
    name: "",
    phone: "",
    role: "renter",
  });

  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const res = await api.post("/users/register/", data);
      return res.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).join(", ") ||
        "Registration failed.";
      setError(msg);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }

    mutate(form);
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name (optional)
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone (optional)
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              >
                <option value="renter">Renter</option>
                <option value="owner">Owner</option>
                <option value="worker">Worker</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              />
            </div>
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
            {isPending ? "Creating account..." : "Sign Up"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-yellow hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
