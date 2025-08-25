"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { me, logout } = useStore();
  return (
    <div className="relative">
      <button className="btn btn-outline" onClick={() => setOpen(!open)}>
        {me ? me.name : "Sign in"}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-soft">
          {!me && (
            <div className="grid gap-2">
              <Link className="btn btn-primary" href="/auth/login">
                Login
              </Link>
              <Link className="btn btn-outline" href="/auth/signup">
                Sign up
              </Link>
            </div>
          )}
          {me && (
            <div className="grid gap-2 text-sm">
              <Link className="btn btn-outline" href="/portal">
                My portal
              </Link>
              {me.role === "landlord" && (
                <Link className="btn btn-outline" href="/landlord">
                  Landlord
                </Link>
              )}
              <button className="btn btn-outline" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
