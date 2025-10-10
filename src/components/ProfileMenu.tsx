"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  User,
  LogOut,
  Settings,
  Briefcase,
  Heart,
  MessageSquare,
  BadgeCheck,
  CalendarDays,
  Shield,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

type MenuItem =
  | {
      type: "link";
      href: string;
      label: string;
      icon?: React.ReactNode;
      accent?: boolean;
      badge?: string;
      onClick?: () => void;
    }
  | { type: "separator" };

export type ProfileMenuProps = {
  placement?: "popover" | "inline";
  className?: string;
};

export default function ProfileMenu({
  placement = "popover",
  className,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!open || placement === "inline") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current || !btnRef.current) return;
      if (panelRef.current.contains(t) || btnRef.current.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, placement]);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/login");
  };

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
      href: "/support",
      label: "Safety & support",
      icon: <Shield size={16} />,
    },
    { type: "separator" },
    {
      type: "link",
      href: "#",
      label: "Log out",
      icon: <LogOut size={16} />,
      onClick: handleLogout,
    },
  ];

  const guestItems: MenuItem[] = [
    {
      type: "link",
      href: "/login",
      label: "Sign In",
      icon: <LogIn size={16} />,
    },
    {
      type: "link",
      href: "/register",
      label: "Create Account",
      icon: <User size={16} />,
      accent: true,
    },
  ];

  const Panel = (
    <div
      ref={panelRef}
      role="menu"
      aria-label="Profile menu"
      className={
        placement === "popover"
          ? "absolute right-0 z-50 mt-2 w-[280px] origin-top-right rounded-2xl border border-black/10 bg-white p-2 shadow-lg"
          : "mt-2 w-full rounded-2xl border border-black/10 bg-white p-2 shadow"
      }
    >
      {/* Header block */}
      <div className="flex items-center gap-3 rounded-xl border border-black/20 bg-white px-3 py-2">
        <Image
          src={user?.avatar || "/Profile_avatar_placeholder_large.png"}
          alt="User avatar"
          width={40}
          height={40}
          className="rounded-full border border-black/10"
        />
        <div className="min-w-0">
          {isAuthenticated ? (
            <>
              <p className="truncate text-sm font-extrabold">
                {user?.name || user?.username}
              </p>
              <p className="truncate text-xs text-neutral-500">
                {user?.email}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-extrabold">Welcome!</p>
              <p className="text-xs text-neutral-500">Please sign in</p>
            </>
          )}
        </div>
      </div>

      <ul className="mt-2 space-y-1">
        {(isAuthenticated ? primaryItems : guestItems).map((item, idx) =>
          item.type === "separator" ? (
            <li
              key={`sep1-${idx}`}
              className="my-1 border-t border-dashed border-black/10"
            />
          ) : (
            <MenuLink key={item.href + idx} item={item} onSelect={close} />
          )
        )}
      </ul>

      {isAuthenticated && (
        <>
          <div className="my-2 border-t border-dashed border-black/10" />
          <ul className="space-y-1">
            {secondaryItems.map((item, idx) =>
              item.type === "separator" ? (
                <li
                  key={`sep2-${idx}`}
                  className="my-1 border-t border-dashed border-black/10"
                />
              ) : (
                <MenuLink key={item.href + idx} item={item} onSelect={close} />
              )
            )}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      <button
        ref={btnRef}
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-10 w-full items-center gap-2 rounded-xl border border-black/10 bg-[#FFD12E] px-3 text-sm font-semibold text-black hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
      >
        <Image
          src={user?.avatar || "/Profile_avatar_placeholder_large.png"}
          alt=""
          width={20}
          height={20}
          className="shrink-0 rounded-full border border-black/20"
        />
        <span>{isAuthenticated ? "Account" : "Sign In"}</span>
      </button>

      {open && Panel}
    </div>
  );
}

function MenuLink({
  item,
  onSelect,
}: {
  item: Extract<MenuItem, { type: "link" }>;
  onSelect: () => void;
}) {
  const base =
    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition";
  const normal = "bg-white hover:bg-black/[0.03]";
  const accent = "bg-neutral-900 text-white hover:bg-neutral-800";

  if (item.onClick) {
    return (
      <li>
        <button
          onClick={() => {
            item.onClick?.();
            onSelect();
          }}
          className={[base, item.accent ? accent : normal].join(" ")}
        >
          <span className="grid place-items-center">{item.icon}</span>
          <span className="flex-1">{item.label}</span>
        </button>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        className={[base, item.accent ? accent : normal].join(" ")}
        onClick={onSelect}
      >
        <span className="grid place-items-center">{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand-yellow px-1 text-[10px] font-bold leading-none text-black">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
}
