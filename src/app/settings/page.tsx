"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { Camera, Save } from "lucide-react";

type Me = {
  id: number;
  username: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: "admin" | "staff" | "owner" | "renter" | "worker";
};

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Me>({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/users/me/")).data,
    enabled: isAuthenticated,
  });

  const [form, setForm] = useState<Partial<Me>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== undefined && val !== null) fd.append(key, val as string);
      });
      if (avatarFile) fd.append("avatar", avatarFile);

      return await api.patch("/users/me/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      setMessage("Profile updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).join(", ") ||
        "Update failed.";
      setError(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    mutation.mutate();
  };

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-black/70">
            Please{" "}
            <a href="/login" className="underline">
              log in
            </a>{" "}
            to access your settings.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 text-center text-black/70">
        Loading profile…
      </main>
    );
  }

  const me = data!;
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Account Settings</h1>
        <p className="text-sm text-black/70">
          Update your personal details and account info.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
      >
        {/* Avatar Upload */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16">
            <Image
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : me.avatar || "/Profile_avatar_placeholder_large.png"
              }
              alt="Avatar"
              fill
              className="rounded-full object-cover border border-black/10"
            />
            <label className="absolute bottom-0 right-0 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-brand-yellow text-black shadow-sm hover:opacity-90">
              <Camera size={14} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setAvatarFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
          </div>
          <div>
            <div className="font-semibold">{me.username}</div>
            <div className="text-xs text-black/60">{me.email}</div>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black/80">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={me.name || ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-black/10 px-3 py-2 focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black/80">
              Phone
            </label>
            <input
              type="text"
              defaultValue={me.phone || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              className="w-full rounded-xl border border-black/10 px-3 py-2 focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-black/80">
            Role
          </label>
          <select
            defaultValue={me.role}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value as Me["role"] }))
            }
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 focus:ring-2 focus:ring-brand-yellow"
          >
            <option value="renter">Renter</option>
            <option value="owner">Owner</option>
            <option value="worker">Worker</option>
          </select>
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:translate-y-[-1px] hover:shadow-md disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
