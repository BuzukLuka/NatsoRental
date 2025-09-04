"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, Heart, Bell, Plus } from "lucide-react";
import ProfileMenu from "../ProfileMenu";

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
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

  const base =
    "sticky top-0 z-[1000] border-b border-black/10 bg-white/80 backdrop-blur";
  const elevated =
    "shadow-[0_6px_0_#00000010] supports-[backdrop-filter]:bg-white/70";

  return (
    <header className={cx(base, scrolled && elevated)} aria-label="Main header">
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
              className="md:h-[48px] md:w-[48px]" // ямар ч урд зайгүй, тогтмол
              priority
            />
            <span className="truncate text-lg font-extrabold md:text-xl">
              Natso <span className="text-brand-yellow">Room</span>
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <nav className="flex items-center gap-1 md:gap-2">
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

          <Link
            href="/host"
            className="hidden rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold transition hover:shadow md:inline-flex"
          >
            <Plus size={16} />
            List your place
          </Link>

          {/* Profile — List your place-ийн яг ард */}
          <ProfileMenu />
        </nav>
      </div>

      {/* Mobile sheet (анхны SSR дээр ч ижил markup гарна) */}
      <div
        ref={mobileRef}
        className={cx(
          "md:hidden transition-[max-height] overflow-hidden border-b border-black/10",
          mobileOpen ? "max-h-96" : "max-h-0"
        )}
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
            className="block rounded-xl border border-black/10 bg-white px-3 py-2 font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            List your place
          </Link>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
