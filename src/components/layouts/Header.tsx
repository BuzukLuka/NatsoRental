"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, Heart } from "lucide-react";
import ProfileMenu from "../ProfileMenu";
import { useAuth } from "@/providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import NotificationsBell from "../NotificationsBell";

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, loading, logout } = useAuth();

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
    "sticky top-0 z-[1000] border-b border-black/10 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/65";

  return (
    <motion.header
      aria-label="Main header"
      className={cx(base)}
      // ⛑️ Энд анхны animation-ыг унтрааж, шууд зурна
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* top bar */}
      <motion.div
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-1.5 md:gap-4 md:px-4"
        animate={{
          boxShadow: scrolled
            ? "0px 6px 0px rgba(0,0,0,0.06)"
            : "0px 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Left: Brand */}
        <div className="flex min-w-0 items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            <Menu size={18} />
          </motion.button>

          <Link href="/" className="flex items-center gap-2 p-1.5">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={140}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Right: Actions */}
        <nav className="flex items-center gap-1 md:gap-2">
          <MotionLink href="/browse" label="Browse" />
          <MotionLink href="/investors" label="Investors" />
          <MotionLink href="/landlord" label="Landlord" />

          {/* ⛑️ Бүрэн нуухын оронд skeleton/placeholder харуулна */}
          {loading ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="h-9 w-9 animate-pulse rounded-xl bg-black/10" />
              <div className="h-9 w-24 animate-pulse rounded-xl bg-black/10" />
              <div className="h-9 w-20 animate-pulse rounded-xl bg-black/10" />
            </div>
          ) : isAuthenticated ? (
            <>
              <IconButton href="/wishlists" aria="Wishlists">
                <Heart size={17} />
              </IconButton>
              {/* NotificationsBell өөрөө fetch хийдэг бол дотроо skeleton-тай байхад OK */}
              <NotificationsBell />
              <div className="hidden md:block">
                <ProfileMenu placement="popover" />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <MotionAnchor href="/login" className="border bg-white">
                Login
              </MotionAnchor>
              <MotionAnchor
                href="/register"
                className="border border-brand-yellow bg-brand-yellow text-black"
              >
                Sign up
              </MotionAnchor>
            </div>
          )}
        </nav>
      </motion.div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileRef}
            key="mobileSheet"
            className={cx("md:hidden border-b border-black/10 overflow-hidden")}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <motion.div
              className="space-y-2 px-3 pb-3 pt-2"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
                show: { transition: { staggerChildren: 0.06 } },
              }}
            >
              <StaggerItem>
                <MobileLink href="/browse" onClick={() => setMobileOpen(false)}>
                  Browse
                </MobileLink>
              </StaggerItem>
              <StaggerItem>
                <MobileLink
                  href="/landlord"
                  onClick={() => setMobileOpen(false)}
                >
                  Landlord
                </MobileLink>
              </StaggerItem>

              {loading ? (
                <div className="grid gap-2">
                  <div className="h-10 animate-pulse rounded-xl bg-black/10" />
                  <div className="h-10 animate-pulse rounded-xl bg-black/10" />
                </div>
              ) : isAuthenticated ? (
                <>
                  <StaggerItem>
                    <ProfileMenu placement="inline" />
                  </StaggerItem>
                  <StaggerItem>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="w-full rounded-xl border border-black/10 bg-red-50 px-3 py-2 font-semibold text-red-600"
                    >
                      Logout
                    </button>
                  </StaggerItem>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <StaggerItem>
                    <MobileLink
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </MobileLink>
                  </StaggerItem>
                  <StaggerItem>
                    <MobileLink
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="border border-brand-yellow bg-brand-yellow text-black"
                    >
                      Sign up
                    </MobileLink>
                  </StaggerItem>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ---------- tiny motion helpers ---------- */

function MotionLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      className="hidden rounded-xl border border-black/10 px-3 py-1.5 text-sm font-semibold transition hover:shadow md:inline-flex"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.a>
  );
}

function MotionAnchor({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      className={cx(
        "rounded-xl px-3 py-1.5 text-sm font-semibold hover:shadow border border-black/10",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

function IconButton({
  href,
  aria,
  withBadge,
  children,
}: {
  href: string;
  aria: string;
  withBadge?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white"
      aria-label={aria}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      {withBadge && (
        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-yellow px-1 text-[10px] font-bold leading-none text-black">
          3
        </span>
      )}
    </motion.a>
  );
}

function MobileLink({
  href,
  children,
  onClick,
  className,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cx(
        "block rounded-xl border border-black/10 bg-white px-3 py-2 font-semibold",
        className
      )}
    >
      {children}
    </a>
  );
}

function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { y: -8, opacity: 0 },
        show: { y: 0, opacity: 1 },
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
