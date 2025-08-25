export type Tenure = "mid" | "long";
export type PType = "apartment" | "house";
export type Property = {
  id: string;
  title: string;
  description: string;
  image: string;
  neighborhood: string;
  priceMonthly: number;
  deposit: number;
  tenure: Tenure;
  type: PType;
  roomType: "Private room" | "Master room" | "Studio";
  pets: boolean;
  wifi: string;
  wifiVendor: string;
  cleaning: "weekly" | "biweekly" | "monthly";
  rules: string[];
  services: string[];
  availableNow: boolean;
  nextAvailable?: string;
  common: { kitchen: boolean; laundry: boolean; parking: boolean };
  /** NEW: geocoordinates for map */
  lat: number;
  lng: number;

  /** (optional legacy for your static pins; can keep or remove) */
  mapX: number;
  mapY: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "renter" | "landlord" | "investor";
} | null;
export type Payment = { id: string; amount: number; date: string };
export type Reservation = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  deposit: number;
};
export type Maintenance = {
  id: string;
  title: string;
  status: "open" | "in_progress" | "done";
};

export type Filters = {
  q: string;
  type?: PType;
  tenure?: Tenure;
  priceMin?: number;
  priceMax?: number;
  pets?: boolean;
};
