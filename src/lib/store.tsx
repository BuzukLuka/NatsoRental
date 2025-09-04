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

// LocalStorage Keys (properties-г хадгалахгүй)
const PAYKEY = "natso.payments";
const RESKEY = "natso.reservations";
const MKEY = "natso.maintenance";
const WKEY = "natso.wishlist";

// test mode: шууд нэвтэрсэн тест хэрэглэгч, түүхтэй байдлаар асаана
const TEST_MODE = true;

// Local role union (decouples from User type)
const ROLES = ["renter", "landlord", "investor"] as const;
type Role = (typeof ROLES)[number];

// Replace `any` with a safe payload type
type ApplicationPayload = Record<string, unknown>;

// Wishlist item
export type WishlistItem = { id: string; addedAt: string };

export type Store = {
  properties: Property[];
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  getPropertyById: (id: string) => Property | undefined;

  me: User | null;
  login: (v: { email: string; role: Role }) => void;
  signup: (v: { name: string; email: string; role: Role }) => void;
  logout: () => void;

  submitApplication: (payload: ApplicationPayload) => void;
  reserve: (propertyId: string) => void;
  myReservations: () => Reservation[];

  payments: Payment[];
  payRent: (amount: number) => void;

  maintenance: Maintenance[];
  createTicket: (v: { title: string }) => void;

  myManaged: () => Property[]; // for landlords
  createListing: (v: { title: string; priceMonthly: number }) => void;

  scheduleReminder: (v: { message: string; daysFromNow: number }) => void;

  // ---- Wishlist API ----
  wishlist: WishlistItem[];
  isWishlisted: (id: string) => boolean;
  addToWishlist: (p: Property) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (p: Property) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // ✅ properties: seed-ээс шууд
  const [properties, setProperties] = useState<Property[]>(() =>
    generateSeed()
  );

  const [filters, setFiltersState] = useState<Filters>({ q: "" });
  const [me, setMe] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // init (properties-г localStorage-оос АВАХГҮЙ)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (TEST_MODE) {
      // --- TEST USER + TEST DATA ---
      const testUser: User = {
        id: "u_test_1",
        name: "Tester",
        email: "Tester@example.com",
        role: "renter",
      };
      setMe(testUser);
      setUser(testUser);

      // properties аль хэдийн seed-лэгдсэн тул шууд ашиглана
      const p0 = properties[0];
      const p1 = properties[3];
      const p2 = properties[2];

      // Түрээсийн түүх (сүүлийнх нь current гэж үзнэ)
      const testReservations: Reservation[] = [];
      if (p0) {
        testReservations.push({
          id: "r_test_1",
          propertyId: p0.id,
          propertyTitle: p0.title,
          deposit: p0.deposit,
        });
      }
      if (p1) {
        testReservations.push({
          id: "r_test_2",
          propertyId: p1.id,
          propertyTitle: p1.title,
          deposit: p1.deposit,
        });
      }
      setReservations(testReservations); // prepend логиктой адил хамгийн сүүлийн нэмэгдсэн нь [0] байхаар жишээ бэлдэв

      // Төлбөрийн түүх
      const testPayments: Payment[] = [
        {
          id: "p_test_1",
          amount: p0 ? p0.priceMonthly : 900,
          date: "2025-08-01",
        },
        {
          id: "p_test_2",
          amount: p1 ? p1.priceMonthly : 850,
          date: "2025-07-01",
        },
      ];
      setPayments(testPayments);

      // Maintenance tickets
      const testMaint: Maintenance[] = [
        { id: "m_test_1", title: "Leaking sink", status: "done" },
        { id: "m_test_2", title: "Broken heater", status: "open" },
      ];
      setMaintenance(testMaint);

      // Wishlist (нэг өрөө жишээгээр)
      if (p2) {
        setWishlist([{ id: p2.id, addedAt: new Date().toISOString() }]);
      }
    } else {
      // --- PROD/REAL INIT (localStorage-оос унших) ---
      setMe(getUser());
      try {
        setPayments(JSON.parse(localStorage.getItem(PAYKEY) || "[]"));
        setReservations(JSON.parse(localStorage.getItem(RESKEY) || "[]"));
        setMaintenance(JSON.parse(localStorage.getItem(MKEY) || "[]"));
        setWishlist(JSON.parse(localStorage.getItem(WKEY) || "[]"));
      } catch {
        // эвдэрхий JSON байсан ч тасралтгүй ажиллуулна
      }
    }
  }, [properties]);

  // persist (properties-г хадгалахгүй)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (TEST_MODE) {
      // test горимд localStorage-д заавал бичих албагүй, гэхдээ бичээд байж болно
      localStorage.setItem(PAYKEY, JSON.stringify(payments));
      localStorage.setItem(RESKEY, JSON.stringify(reservations));
      localStorage.setItem(MKEY, JSON.stringify(maintenance));
      localStorage.setItem(WKEY, JSON.stringify(wishlist));
    } else {
      localStorage.setItem(PAYKEY, JSON.stringify(payments));
      localStorage.setItem(RESKEY, JSON.stringify(reservations));
      localStorage.setItem(MKEY, JSON.stringify(maintenance));
      localStorage.setItem(WKEY, JSON.stringify(wishlist));
    }
  }, [payments, reservations, maintenance, wishlist]);

  const api: Store = useMemo(
    () => ({
      properties,
      filters,
      setFilters: (patch) => setFiltersState((prev) => ({ ...prev, ...patch })),
      getPropertyById: (id) => properties.find((p) => p.id === id),

      me,
      login: ({ email, role }) => {
        const u = {
          id: uid(),
          name: email.split("@")[0],
          email,
          role,
        } as unknown as User;
        setMe(u);
        setUser(u);
      },
      signup: ({ name, email, role }) => {
        const u = { id: uid(), name, email, role } as unknown as User;
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
          lat: 51.0447,
          lng: -114.0719,
        };
        setProperties((prev) => [next, ...prev]);
        alert("Listing created.");
      },

      scheduleReminder: ({ message, daysFromNow }) => {
        const ms = daysFromNow * 24 * 60 * 60 * 1000;
        setTimeout(() => alert(`Reminder: ${message}`), ms);
        alert(`Reminder scheduled: "${message}" in ${daysFromNow} days`);
      },

      // -------- Wishlist --------
      wishlist,
      isWishlisted: (id: string) => wishlist.some((w) => w.id === id),
      addToWishlist: (p: Property) =>
        setWishlist((prev) =>
          prev.some((w) => w.id === p.id)
            ? prev
            : [{ id: p.id, addedAt: new Date().toISOString() }, ...prev]
        ),
      removeFromWishlist: (id: string) =>
        setWishlist((prev) => prev.filter((w) => w.id !== id)),
      toggleWishlist: (p: Property) =>
        setWishlist((prev) => {
          const exists = prev.some((w) => w.id === p.id);
          if (exists) return prev.filter((w) => w.id !== p.id);
          return [{ id: p.id, addedAt: new Date().toISOString() }, ...prev];
        }),
    }),
    [properties, filters, me, payments, reservations, maintenance, wishlist]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Store not ready");
  return ctx;
}
