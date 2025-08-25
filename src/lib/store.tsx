"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  Filters,
  Maintenance,
  Payment,
  Property,
  Reservation,
  User,
} from "@/types";
import { generateSeed } from "@/data/seed";
import { getUser, setUser } from "@/lib/auth";
import { today, uid } from "@/lib/utils";

// Keys
const PKEY = "natso.properties";
const PAYKEY = "natso.payments";
const RESKEY = "natso.reservations";
const MKEY = "natso.maintenance";

export type Store = {
  properties: Property[];
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  getPropertyById: (id: string) => Property | undefined;

  me: User;
  login: (v: { email: string; role: User["role"] }) => void;
  signup: (v: { name: string; email: string; role: User["role"] }) => void;
  logout: () => void;

  submitApplication: (payload: any) => void;
  reserve: (propertyId: string) => void;
  myReservations: () => Reservation[];

  payments: Payment[];
  payRent: (amount: number) => void;

  maintenance: Maintenance[];
  createTicket: (v: { title: string }) => void;

  myManaged: () => Property[]; // for landlords
  createListing: (v: { title: string; priceMonthly: number }) => void;

  scheduleReminder: (v: { message: string; daysFromNow: number }) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFiltersState] = useState<Filters>({ q: "" });
  const [me, setMe] = useState<User>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);

  // init
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Seed properties
    const rawP = localStorage.getItem(PKEY);
    if (!rawP) localStorage.setItem(PKEY, JSON.stringify(generateSeed()));
    setProperties(JSON.parse(localStorage.getItem(PKEY) || "[]"));

    setMe(getUser());
    setPayments(JSON.parse(localStorage.getItem(PAYKEY) || "[]"));
    setReservations(JSON.parse(localStorage.getItem(RESKEY) || "[]"));
    setMaintenance(JSON.parse(localStorage.getItem(MKEY) || "[]"));
  }, []);

  function persist() {
    localStorage.setItem(PKEY, JSON.stringify(properties));
    localStorage.setItem(PAYKEY, JSON.stringify(payments));
    localStorage.setItem(RESKEY, JSON.stringify(reservations));
    localStorage.setItem(MKEY, JSON.stringify(maintenance));
  }
  useEffect(() => {
    if (typeof window !== "undefined") persist();
  }, [properties, payments, reservations, maintenance]);

  const api: Store = useMemo(
    () => ({
      properties,
      filters,
      setFilters: (patch) => setFiltersState((prev) => ({ ...prev, ...patch })),
      getPropertyById: (id) => properties.find((p) => p.id === id),

      me,
      login: ({ email, role }) => {
        const u: User = { id: uid(), name: email.split("@")[0], email, role };
        setMe(u);
        setUser(u);
      },
      signup: ({ name, email, role }) => {
        const u: User = { id: uid(), name, email, role };
        setMe(u);
        setUser(u);
      },
      logout: () => {
        setMe(null);
        setUser(null);
      },

      submitApplication: (payload) => {
        console.log("Application submitted", payload);
        alert("Application submitted. We'll follow up shortly.");
      },

      reserve: (propertyId) => {
        const p = properties.find((x) => x.id === propertyId);
        if (!p) return;
        setReservations((prev) => [
          {
            id: uid(),
            propertyId: p.id,
            propertyTitle: p.title,
            deposit: p.deposit,
          },
          ...prev,
        ]);
      },
      myReservations: () => reservations,

      payments,
      payRent: (amount) =>
        setPayments((prev) => [{ id: uid(), amount, date: today() }, ...prev]),

      maintenance,
      createTicket: ({ title }) =>
        setMaintenance((prev) => [
          { id: uid(), title, status: "open" },
          ...prev,
        ]),

      myManaged: () => properties.slice(0, 5),
      createListing: ({ title, priceMonthly }) => {
        const next: Property = {
          id: uid(),
          title,
          description: "New landlord listing",
          image:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=60",
          neighborhood: "Beltline",
          priceMonthly,
          deposit: Math.round(priceMonthly * 0.5),
          tenure: "long",
          type: "apartment",
          roomType: "Private room",
          pets: false,
          wifi: "300 Mbps",
          wifiVendor: "TELUS",
          cleaning: "monthly",
          rules: ["No smoking indoors"],
          services: ["Support", "Orientation"],
          availableNow: true,
          nextAvailable: undefined,
          common: { kitchen: true, laundry: true, parking: false },
          mapX: 50,
          mapY: 50,
        };
        setProperties((prev) => [next, ...prev]);
        alert("Listing created.");
      },

      scheduleReminder: ({ message, daysFromNow }) => {
        const ms = daysFromNow * 24 * 60 * 60 * 1000;
        setTimeout(() => alert(`Reminder: ${message}`), ms);
        alert(`Reminder scheduled: "${message}" in ${daysFromNow} days`);
      },
    }),
    [properties, filters, me, payments, reservations, maintenance]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Store not ready");
  return ctx;
}
