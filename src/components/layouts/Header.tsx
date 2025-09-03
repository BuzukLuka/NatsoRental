"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, Heart, Bell, Plus } from "lucide-react";
import ProfileMenu from "../ProfileMenu"; // updated below

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMobileOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!mobileRef.current) return;
      if (!mobileRef.current.contains(e.target as Node)) setMobileOpen(false);
    };
    if (mobileOpen) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onClick);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [mobileOpen]);

  return (
    <header
      className={[
        "sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur",
        scrolled
          ? "shadow-[0_6px_0_#00000010] supports-[backdrop-filter]:bg-white/70"
          : "",
      ].join(" ")}
      aria-label="Main header"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 md:gap-4 md:px-4">
        {/* Left: Brand */}
        <div className="flex min-w-0 items-center gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Natso"
              width={36}
              height={36}
              className="rounded-lg border border-black/10 md:h-[48px] md:w-[48px]"
              priority
            />
            <span className="truncate text-lg font-extrabold md:text-xl">
              Natso <span className="text-brand-yellow">Rental</span>
            </span>
          </Link>
        </div>

        {/* Center: Search (hidden on small, use icon instead) */}
        <div className="hidden flex-1 md:block">
          {/* Keep your existing SearchBar component */}
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <Search size={18} />
            </div>
            {/* Your SearchBar mounts here */}
            <div className="pl-9">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* Replace with your real component */}
              {/* <SearchBar /> */}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <nav className="flex items-center gap-1 md:gap-2">
          {/* Quick search on mobile */}
          <Link
            href="/search"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white"
            aria-label="Search"
          >
            <Search size={18} />
          </Link>

          <Link
            className="hidden rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold transition hover:shadow md:inline-flex"
            href="/browse"
          >
            Browse
          </Link>
          <Link
            className="hidden rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold transition hover:shadow md:inline-flex"
            href="/investors"
          >
            Investors
          </Link>
          <Link
            className="hidden rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold transition hover:shadow md:inline-flex"
            href="/landlord"
          >
            Landlord
          </Link>

          {/* Icons */}
          <Link
            href="/wishlists"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white"
            aria-label="Wishlists"
          >
            <Heart size={18} />
          </Link>
          <Link
            href="/notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-yellow px-1 text-[10px] font-bold leading-none text-black">
              3
            </span>
          </Link>

          {/* CTA */}
          <Link
            href="/host"
            className="hidden items-center gap-2 rounded-xl border-2 border-black bg-[#FFD12E] px-3 py-2 text-sm font-extrabold text-black shadow-[4px_4px_0_#000] transition active:translate-y-[2px] active:shadow-[2px_2px_0_#000] md:inline-flex"
          >
            <Plus size={16} />
            List your place
          </Link>

          {/* Profile */}
          <ProfileMenu />
        </nav>
      </div>

      {/* Mobile sheet */}
      <div
        ref={mobileRef}
        className={[
          "md:hidden transition-[max-height] overflow-hidden border-b border-black/10",
          mobileOpen ? "max-h-96" : "max-h-0",
        ].join(" ")}
      >
        <div className="space-y-2 px-3 pb-3 pt-2">
          <Link
            href="/browse"
            className="block rounded-xl border border-black/10 bg-white px-3 py-2 font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            Browse
          </Link>
          <Link
            href="/landlord"
            className="block rounded-xl border border-black/10 bg-white px-3 py-2 font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            Landlord
          </Link>
          <Link
            href="/host"
            className="block rounded-xl border-2 border-black bg-[#FFD12E] px-3 py-2 text-center font-extrabold text-black shadow-[4px_4px_0_#000]"
            onClick={() => setMobileOpen(false)}
          >
            List your place
          </Link>
        </div>
      </div>
    </header>
  );
}
