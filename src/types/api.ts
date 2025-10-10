export interface PropertyType {
  id: number;
  name: string;
  description?: string;
  image?: string | null;
}

export interface RoomList {
  id: number;
  slug: string;
  title: string;
  price_per_month: string;
  thumbnail?: string | null;
  average_rating: number;
  is_featured: boolean;
  property_type: PropertyType;
  coordinates: string;
  address?: string;
  tenure?: string;
  pets_allowed: boolean;
}

export interface RoomImage {
  id: number;
  image: string;
  alt_text?: string;
  is_featured: boolean;
}

export interface RoomDetail {
  id: number;
  slug: string;
  title: string;
  description?: string;
  price_per_month: string;
  address?: string;
  coordinates: string;
  is_active: boolean;
  is_featured: boolean;
  thumbnail?: string | null;
  property_type: PropertyType;
  images: RoomImage[];
  average_rating: number;
  reviews?: string; // summary / url list
  created_at: string; // date-time
}

/* ---------- BOOKINGS ---------- */
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "canceled";

export interface Booking {
  id: number;
  guest: string;
  room: RoomList;
  check_in: string; // date
  check_out: string; // date
  nights: string;
  total_price: string;
  status: BookingStatus;
  payment_status: string;
  created_at: string;
}

/* ---------- PAYMENTS ---------- */
export type PaymentType = "card" | "wallet" | "cash";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface Payment {
  id: number;
  user: string;
  amount: string;
  payment_type: PaymentType;
  status: PaymentStatus;
  transaction_id: string;
  booking: string;
  created_at: string;
}

/* ---------- MEMBERSHIPS ---------- */
export interface MembershipPlan {
  id: number;
  name: string;
  description?: string;
  price: string;
  duration_days: number;
}

export interface HostMembership {
  id: number;
  host: string;
  plan: MembershipPlan;
  start_date: string;
  end_date: string;
  active: boolean;
  is_valid: boolean;
}

/* ---------- AVAILABILITY ---------- */
export interface RoomAvailability {
  id: number;
  start_date: string | null;
  end_date: string | null;
  is_available: boolean;
}

/* ---------- REVIEWS ---------- */
export interface RoomReview {
  id: number;
  user: string;
  rating: number;
  text?: string;
  booking: number;
  created_at: string;
}

/* ---------- SERVICE REQUESTS ---------- */
export type ServiceRequestType =
  | "cleaning"
  | "repair"
  | "maintenance"
  | "other";

export type ServiceRequestStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "canceled";

export interface ServiceRequest {
  id: number;
  room_title: string;
  user_name: string;
  booking_id: number;
  request_type: ServiceRequestType;
  description?: string;
  status: ServiceRequestStatus;
  assigned_to?: number | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
}

/* ---------- USERS ---------- */
export type UserRole =
  | "admin"
  | "staff"
  | "owner"
  | "renter"
  | "worker";

export interface Register {
  username: string;
  email: string;
  password: string;
  password2: string;
  name?: string | null;
  phone?: string | null;
  avatar?: string | null;
  role?: UserRole;
}

export interface TokenObtainPair {
  username: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

/* ---------- SERVICE WORKERS ---------- */
export type WorkerType =
  | "cleaner"
  | "handyman"
  | "plumber"
  | "electrician"
  | "painter"
  | "other";

export interface ServiceWorker {
  id: number;
  user_name: string;
  user_avatar: string;
  service_type: WorkerType;
  hourly_rate?: string | null;
  rating: number;
  completed_jobs: number;
  available: boolean;
}

/* -------------------------------------------------
   Utility types
-------------------------------------------------- */
export type ID = number | string;
export type DateTime = string; // ISO 8601
export type Decimal = string;
