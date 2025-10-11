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

export type Role = "renter" | "landlord" | "investor";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
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
  /** Text search, e.g. by title, description, address */
  q?: string; // maps to ?search=

  /** City or area filter (optional, frontend-only) */
  cityArea?: string;

  /** Monthly rent range (used for UI selection only) */
  monthlyRange?: "upto_600" | "600_800" | "800_1200" | "1200_plus";

  /** Pets policy */
  petsAllowed?: boolean; // maps to ?pets_allowed=true
  noPets?: boolean; // UI convenience only

  /** Type of room/property */
  type?: string; // maps to ?type=Basement (property_type name)

  /** Rental term / tenure length */
  tenure?: "try" | "mid" | "long"; // optional future filter

  /** Numeric min/max price — backend expects price_per_month__gte/lte */
  priceMin?: number; // maps to ?min_price=
  priceMax?: number; // maps to ?max_price=

  /** Optional business/UI flags */
  waitingList?: boolean;
  contactAdmin?: boolean;
  signupFee?: boolean;
  signupFeeAmount?: number;
};

// Removed duplicate User interface to resolve duplicate identifier error.
