"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { Camera, Save, ShieldCheck } from "lucide-react";

/* ------------------ Types (aligns with your UserSerializer) ------------------ */

type UserRole = "admin" | "staff" | "owner" | "renter" | "worker";

type User = {
  id: number;
  username: string;
  email: string;

  name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar: string | null;
  bio: string | null;

  role: UserRole;
  role_label: string;
  is_worker: boolean;
  is_owner: boolean;
  is_renter: boolean;
  is_platform_staff: boolean;

  company_name: string | null;
  address: string | null;
  verified: boolean;
  joined_via_invite: boolean;
};

type Dashboard = {
  user: User;
  // ... other dashboard fields omitted
};

/* ------------------------------- UI helpers -------------------------------- */

function Badge({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: "neutral" | "success" | "warn";
}) {
  const cls =
    variant === "success"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      : variant === "warn"
      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      : "bg-black/5 text-black/70 ring-1 ring-black/10";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${cls}`}
    >
      {children}
    </span>
  );
}

/* --------------------------------- Page ----------------------------------- */

export default function SettingsPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch dashboard then grab user
  const { data, isLoading } = useQuery<Dashboard>({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/users/me/")).data,
    enabled: isAuthenticated,
  });

  const me = data?.user;

  const [form, setForm] = useState<Partial<User> & { password?: string }>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();

      // include only changed fields
      (
        [
          "name",
          "first_name",
          "last_name",
          "phone",
          "bio",
          "company_name",
          "address",
          "role", // backend will reject if not platform staff
        ] as const
      ).forEach((k) => {
        const v = form[k];
        if (v !== undefined && v !== null) fd.append(k, String(v));
      });

      if (form.password) fd.append("password", form.password);
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
        err?.response?.data?.detail ||
        (err?.response?.data
          ? Object.values(err.response.data as Record<string, any>)
              .flat()
              .join(", ")
          : null) ||
        "Update failed.";
      setError(String(msg));
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

  if (isLoading || !me) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 text-center text-black/70">
        Loading profile…
      </main>
    );
  }

  const canChangeRole = me.is_platform_staff;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {me.verified ? (
            <Badge variant="success">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </Badge>
          ) : (
            <Badge variant="neutral">Not verified</Badge>
          )}
          <Badge variant="neutral">{me.role_label}</Badge>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
      >
        {/* Avatar */}
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

        {/* Name & Phone */}
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

        {/* First/Last */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black/80">
              First Name
            </label>
            <input
              type="text"
              defaultValue={me.first_name || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, first_name: e.target.value }))
              }
              className="w-full rounded-xl border border-black/10 px-3 py-2 focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black/80">
              Last Name
            </label>
            <input
              type="text"
              defaultValue={me.last_name || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, last_name: e.target.value }))
              }
              className="w-full rounded-xl border border-black/10 px-3 py-2 focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </div>

        {/* Company & Address */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black/80">
              Company
            </label>
            <input
              type="text"
              defaultValue={me.company_name || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, company_name: e.target.value }))
              }
              className="w-full rounded-xl border border-black/10 px-3 py-2 focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black/80">
              Address
            </label>
            <input
              type="text"
              defaultValue={me.address || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              className="w-full rounded-xl border border-black/10 px-3 py-2 focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </div>

        {/* Role (disabled for non-staff) */}
        <div>
          <label className="block text-sm font-medium text-black/80">
            Role
          </label>
          <select
            defaultValue={me.role}
            disabled={!canChangeRole}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value as UserRole }))
            }
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 focus:ring-2 focus:ring-brand-yellow disabled:opacity-60"
            title={
              !canChangeRole ? "Only platform staff can change role" : undefined
            }
          >
            <option value="renter">Renter</option>
            <option value="owner">Owner</option>
            <option value="worker">Worker</option>
            <option value="staff">Platform Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-black/80">Bio</label>
          <textarea
            rows={4}
            defaultValue={me.bio || ""}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            className="w-full rounded-xl border border-black/10 px-3 py-2 focus:ring-2 focus:ring-brand-yellow"
            placeholder="Tell hosts a bit about yourself…"
          />
        </div>

        {/* Password change (optional) */}
        <div>
          <label className="block text-sm font-medium text-black/80">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            className="w-full rounded-xl border border-black/10 px-3 py-2 focus:ring-2 focus:ring-brand-yellow"
          />
          <p className="mt-1 text-xs text-black/50">
            Leave empty to keep your current password.
          </p>
        </div>

        {/* Messages */}
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

        {/* Save */}
        <div className="flex gap-3 justify-end items-center">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:translate-y-[-1px] hover:shadow-md disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 text-sm font-medium text-black hover:translate-y-[-1px] hover:shadow-md"
          >
            Return
          </button>
        </div>

        {/* Small meta row */}
        <div className="text-xs text-black/50">
          Joined via invite: {me.joined_via_invite ? "Yes" : "No"}
        </div>
      </form>
    </main>
  );
}
