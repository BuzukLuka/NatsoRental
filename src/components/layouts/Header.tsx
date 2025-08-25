"use client";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "../SearchBar";
import ProfileMenu from "../ProfileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 p-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Natso" width={28} height={28} />
          <span className="font-extrabold">
            Natso <span className="text-brand-yellow">Rental</span>
          </span>
        </Link>
        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>
        <nav className="flex items-center gap-2">
          <Link className="btn btn-outline" href="/browse">
            Browse
          </Link>
          <Link className="btn btn-outline" href="/investors">
            Investors
          </Link>
          <Link className="btn btn-outline" href="/landlord">
            Landlord
          </Link>
          <ProfileMenu />
        </nav>
      </div>
    </header>
  );
}
