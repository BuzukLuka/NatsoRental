// src/app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import PropertyGrid from "@/components/PropertyGrid";
import Steps from "@/components/Steps";
import { useApp } from "@/providers/AppProvider";
import FiltersBar from "@/components/filtersBarWrap";

export default function HomePage() {
  const { rooms, isLoading } = useApp();

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative z-auto">
        <Image
          src="/Hero.png"
          alt="Calgary"
          width={2400}
          height={1200}
          className="h-[60vh] w-full object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        
        {/* Hero content */}
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl text-center text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-md border border-white/20">
              🇨🇦 Calgary · Mid &amp; Long term
            </div>
            
            {/* Title */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Find your <span className="text-brand-yellow">next room</span> in minutes
            </h1>
            
            {/* Subtitle */}
            <p className="mt-4 text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Trusted rentals in Calgary with deposits, policies, and landlord portal.
            </p>

            {/* FiltersBar with proper z-index */}
            <div className="mt-8 relative z-10">
              <FiltersBar />
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="relative z-0 bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { 
                icon: "✨",
                title: "Verified landlords", 
                sub: "Screened listings & rules" 
              },
              { 
                icon: "🛡️",
                title: "Deposit protection", 
                sub: "Clear penalties & refunds" 
              },
              { 
                icon: "🔧",
                title: "Support portal", 
                sub: "Maintenance & payments" 
              },
            ].map((item) => (
              <div 
                key={item.title} 
                className="card p-6 hover:shadow-lg transition-shadow duration-200 bg-white"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMMENDED ROOMS */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Popular in Calgary
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Featured rooms available now
              </p>
            </div>
            <Link 
              href="/browse" 
              className="btn btn-outline hover:bg-gray-100 transition-colors"
            >
              Browse all →
            </Link>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading rooms...</p>
              </div>
            </div>
          )}

          {!isLoading && rooms && rooms.length > 0 ? (
            <PropertyGrid
              items={rooms.filter((r) => r.is_featured).slice(0, 6)}
            />
          ) : (
            !isLoading && (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">No featured rooms available at the moment.</p>
                <Link 
                  href="/browse" 
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  View all listings
                </Link>
              </div>
            )
          )}
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Steps />
        </div>
      </section>
    </div>
  );
}