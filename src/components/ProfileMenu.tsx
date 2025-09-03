"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  User,
  LogOut,
  Settings,
  Star,
  Briefcase,
  Heart,
  MessageSquare,
  BadgeCheck,
  CalendarDays,
  Shield,
} from "lucide-react";

type MenuItem =
  | {
      type: "link";
      href: string;
      label: string;
      icon?: React.ReactNode;
      accent?: boolean;
      badge?: string;
    }
  | { type: "separator" };

const primaryItems: MenuItem[] = [
  {
    type: "link",
    href: "/profile",
    label: "Your profile",
    icon: <User size={16} />,
  },
  {
    type: "link",
    href: "/trips",
    label: "Trips & bookings",
    icon: <CalendarDays size={16} />,
  },
  {
    type: "link",
    href: "/wishlists",
    label: "Wishlists",
    icon: <Heart size={16} />,
  },
  {
    type: "link",
    href: "/messages",
    label: "Messages",
    icon: <MessageSquare size={16} />,
    badge: "2",
  },
  {
    type: "link",
    href: "/reviews",
    label: "Reviews",
    icon: <Star size={16} />,
  },
];

const secondaryItems: MenuItem[] = [
  {
    type: "link",
    href: "/host",
    label: "Become a Host",
    icon: <Briefcase size={16} />,
    accent: true,
  },
  { type: "separator" },
  {
    type: "link",
    href: "/account",
    label: "Account settings",
    icon: <Settings size={16} />,
  },
  {
    type: "link",
    href: "/verify",
    label: "Verify identity",
    icon: <BadgeCheck size={16} />,
  },
  {
    type: "link",
    href: "/safety",
    label: "Safety & support",
    icon: <Shield size={16} />,
  },
  { type: "separator" },
  {
    type: "link",
    href: "/logout",
    label: "Log out",
    icon: <LogOut size={16} />,
  },
];

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current || !btnRef.current) return;
      if (panelRef.current.contains(t) || btnRef.current.contains(t)) return;
      setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onClick);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-2 py-1 shadow-[3px_3px_0_#000] transition active:translate-y-[1px] active:shadow-[1px_1px_0_#000]"
      >
        <Image
          src="/avatar-placeholder.png"
          alt="Profile"
          width={28}
          height={28}
          className="rounded-full border border-black/10"
        />
        <span className="hidden text-sm font-bold md:inline">Account</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 mt-2 w-[280px] origin-top-right rounded-2xl border-2 border-black bg-white p-2 shadow-[8px_8px_0_#000] focus:outline-none"
        >
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-3 py-2">
            <Image
              src="/avatar-placeholder.png"
              alt="You"
              width={40}
              height={40}
              className="rounded-full border border-black/10"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">Welcome back!</p>
              <p className="truncate text-xs text-neutral-500">
                Manage your rentals & trips
              </p>
            </div>
          </div>

          <ul className="mt-2 space-y-1">
            {primaryItems.map((item, idx) =>
              item.type === "separator" ? (
                <li
                  key={`sep-1-${idx}`}
                  className="my-1 border-t border-dashed border-black/10"
                />
              ) : (
                <MenuLink key={item.href} item={item} />
              )
            )}
          </ul>

          <div className="my-2 border-t border-dashed border-black/10" />

          <ul className="space-y-1">
            {secondaryItems.map((item, idx) =>
              item.type === "separator" ? (
                <li
                  key={`sep-2-${idx}`}
                  className="my-1 border-t border-dashed border-black/10"
                />
              ) : (
                <MenuLink key={item.href} item={item} />
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function MenuLink({ item }: { item: Extract<MenuItem, { type: "link" }> }) {
  return (
    <li>
      <Link
        href={item.href}
        role="menuitem"
        className={[
          "group relative flex items-center gap-3 rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold transition",
          item.accent
            ? "bg-[#FFD12E] text-black shadow-[4px_4px_0_#000] active:translate-y-[1px] active:shadow-[2px_2px_0_#000]"
            : "bg-white hover:shadow",
        ].join(" ")}
      >
        <span className="grid place-items-center">{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-black/80 px-1 text-[10px] font-bold text-white">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
}
