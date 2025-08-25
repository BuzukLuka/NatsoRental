"use client";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import Steps from "@/components/Steps";
import PropertyGrid from "@/components/PropertyGrid";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const { properties } = useStore();
  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Calgary"
          width={2400}
          height={1200}
          className="h-[56vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-3xl text-center text-white reveal">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
              🇨🇦 Calgary · Mid & Long term
            </div>
            <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
              Find your <span className="text-brand-yellow">next room</span> in
              minutes
            </h1>
            <p className="mt-3 opacity-90">
              Trusted rentals in Calgary with deposits, policies, and landlord
              portal.
            </p>
            <div className="mx-auto mt-6 max-w-2xl">
              <SearchBar variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-3">
        {[
          { title: "Verified landlords", sub: "Screened listings & rules" },
          { title: "Deposit protection", sub: "Clear penalties & refunds" },
          { title: "Support portal", sub: "Maintenance & payments" },
        ].map((it) => (
          <div key={it.title} className="card p-5 reveal">
            <div className="badge">✨ Feature</div>
            <h3 className="mt-3 text-lg font-bold">{it.title}</h3>
            <p className="text-sm text-black/70">{it.sub}</p>
          </div>
        ))}
      </section>

      {/* RECOMMENDED */}
      <section className="mx-auto max-w-6xl p-4">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Popular in Calgary</h2>
          <a className="btn btn-outline" href="/browse">
            Browse all
          </a>
        </div>
        <PropertyGrid items={properties.slice(0, 6)} />
      </section>

      <Steps className="mx-auto max-w-6xl p-4" />
    </div>
  );
}
