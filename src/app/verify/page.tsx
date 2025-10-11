// app/verify-identity/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  FileCheck2,
  FileImage,
  IdCard,
  ShieldCheck,
  Upload,
  X,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import {
  useIdentity,
  useSubmitIdentity,
  useUpdateIdentity,
} from "@/hooks/useIdentity";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-black/80">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function VerifyIdentityPage() {
  const { isAuthenticated } = useAuth();
  const { data: identity, isLoading } = useIdentity(isAuthenticated);
  const submit = useSubmitIdentity();
  const updater = useUpdateIdentity(identity?.id);

  const [docType, setDocType] = useState<
    "id_card" | "passport" | "driver_license"
  >("id_card");
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [address, setAddress] = useState<File | null>(null);

  const locked = useMemo(() => {
    if (!identity) return false;
    return identity.status === "submitted" || identity.status === "approved";
  }, [identity]);

  useEffect(() => {
    if (identity?.doc_type) setDocType(identity.doc_type);
  }, [identity?.doc_type]);

  const onSaveDraft = async () => {
    if (!identity?.id) return;
    const fd = new FormData();
    fd.append("doc_type", docType);
    if (front) fd.append("doc_front", front);
    if (back) fd.append("doc_back", back);
    if (selfie) fd.append("selfie", selfie);
    if (address) fd.append("address_proof", address);
    await updater.mutateAsync(fd);
  };

  const onSubmit = async () => {
    if (!identity?.id) return;
    await onSaveDraft(); // make sure files are uploaded
    await submit.mutateAsync(identity.id);
  };

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
        <Section title="Verify identity">
          <p className="text-sm text-black/70">
            Please{" "}
            <Link href="/login" className="underline">
              log in
            </Link>{" "}
            to continue.
          </p>
        </Section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">
          <ShieldCheck className="h-4 w-4" />
          Trust & safety
        </div>
        <h1 className="mt-2 text-2xl font-extrabold">Verify your identity</h1>
        <p className="text-sm text-black/70">
          Upload a government ID and a selfie to earn a verified badge.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Section title="Status">
          {isLoading ? (
            <div className="text-sm text-black/60">Loading…</div>
          ) : identity ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ${
                  identity.status === "approved"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : identity.status === "rejected"
                    ? "bg-red-50 text-red-700 ring-red-200"
                    : identity.status === "submitted"
                    ? "bg-blue-50 text-blue-700 ring-blue-200"
                    : "bg-black/5 text-black/70 ring-black/10"
                }`}
              >
                <BadgeCheck className="h-4 w-4" />
                {identity.status}
              </span>
              {identity.status === "rejected" && identity.rejection_reason ? (
                <span className="inline-flex items-center gap-1 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  {identity.rejection_reason}
                </span>
              ) : null}
            </div>
          ) : null}
        </Section>

        <Section title="1) Document type">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { v: "id_card", label: "ID Card" },
              { v: "passport", label: "Passport" },
              { v: "driver_license", label: "Driver License" },
            ].map((opt) => (
              <button
                key={opt.v}
                disabled={locked}
                onClick={() => setDocType(opt.v as any)}
                className={[
                  "rounded-xl border px-3 py-2 text-sm transition",
                  docType === opt.v
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white hover:shadow",
                  locked ? "opacity-60" : "",
                ].join(" ")}
                type="button"
              >
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4" />
                  {opt.label}
                </div>
              </button>
            ))}
          </div>
        </Section>

        <Section title="2) Upload images">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Labeled label="Front of document">
              <label className="flex h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed border-black/20 text-sm text-black/60 hover:bg-black/5">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={locked}
                  onChange={(e) => setFront(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />{" "}
                  {front ? front.name : "Choose file"}
                </div>
              </label>
              {identity?.doc_front && !front && (
                <div className="mt-2 text-xs text-black/60">
                  Existing file on server ✓
                </div>
              )}
            </Labeled>

            <Labeled label="Back of document (if applicable)">
              <label className="flex h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed border-black/20 text-sm text-black/60 hover:bg-black/5">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={locked}
                  onChange={(e) => setBack(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />{" "}
                  {back ? back.name : "Choose file"}
                </div>
              </label>
              {identity?.doc_back && !back && (
                <div className="mt-2 text-xs text-black/60">
                  Existing file on server ✓
                </div>
              )}
            </Labeled>

            <Labeled label="Selfie (no hat/sunglasses)">
              <label className="flex h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed border-black/20 text-sm text-black/60 hover:bg-black/5">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={locked}
                  onChange={(e) => setSelfie(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />{" "}
                  {selfie ? selfie.name : "Choose file"}
                </div>
              </label>
              {identity?.selfie && !selfie && (
                <div className="mt-2 text-xs text-black/60">
                  Existing file on server ✓
                </div>
              )}
            </Labeled>

            <Labeled label="Proof of address (optional)">
              <label className="flex h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed border-black/20 text-sm text-black/60 hover:bg-black/5">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  disabled={locked}
                  onChange={(e) => setAddress(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4" />{" "}
                  {address ? address.name : "Choose file"}
                </div>
              </label>
              {identity?.address_proof && !address && (
                <div className="mt-2 text-xs text-black/60">
                  Existing file on server ✓
                </div>
              )}
            </Labeled>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={onSaveDraft}
              disabled={locked || updater.isPending}
              className="btn btn-outline"
              type="button"
            >
              {updater.isPending ? "Saving…" : "Save draft"}
            </button>
            <button
              onClick={onSubmit}
              disabled={locked || submit.isPending}
              className="btn btn-primary"
              type="button"
            >
              {submit.isPending ? "Submitting…" : "Submit for review"}
            </button>
          </div>

          {locked && (
            <div className="mt-3 rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-xs text-black/70">
              Your submission is locked while under review or approved.
            </div>
          )}
        </Section>

        <Section title="What we check">
          <ul className="list-disc space-y-2 pl-5 text-sm text-black/80">
            <li>Full name and birthdate match your account information.</li>
            <li>Document is valid, readable, and not visibly altered.</li>
            <li>Selfie appears to match the document photo.</li>
          </ul>
          <p className="mt-2 text-xs text-black/60">
            We store documents securely and only use them to verify your
            identity. See our{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </Section>
      </div>
    </main>
  );
}
