"use client";

import Link from "next/link";
import { Wrench, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow">
        <Wrench className="h-6 w-6" />
      </div>

      <h1 className="text-2xl font-extrabold">
        This page is under development
      </h1>
      <p className="mt-2 max-w-xl text-black/70">
        We’re working hard to finish this section. Please check back soon.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:translate-y-[-1px] hover:shadow-md"
        >
          Browse places
        </Link>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-black/15 bg-black/[0.02] px-4 py-3 text-left text-sm">
        <p className="font-semibold">Need something specific?</p>
        <ul className="mt-1 list-disc pl-5 text-black/70">
          <li>Try the navigation above</li>
          <li>Or contact support from the menu</li>
        </ul>
      </div>
    </main>
  );
}
