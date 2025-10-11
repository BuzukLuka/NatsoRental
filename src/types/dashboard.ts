// types/dashboard.ts
export type DashboardRoom = {
  id: number;
  slug: string;
  title: string;
  price_per_month: string;
  thumbnail: string | null;
  address: string;
  property_type?: {
    id: number;
    name: string;
    description?: string;
    image?: string;
  };
};

export type DashboardBooking = {
  id: number;
  status: string;
  check_in: string;
  check_out: string;
  total_price: string;
  payment_status?: string;
  created_at: string;
  room: DashboardRoom;
};

export type DashboardPayment = {
  id: number;
  amount: string;
  status: string;
  created_at: string;
  payment_type: string;
  transaction_id?: string;
  booking?: number;
};

export type Dashboard = {
  user: {
    id: number;
    username: string;
    email: string;
    phone?: string;
    name?: string;
    avatar?: string | null;
    first_name?: string;
    last_name?: string;
    role?: string;
    verified?: boolean;
    bio?: string;
  };
  stats: { bookings_count: number; payments_count: number; role?: string };
  current_rental: DashboardBooking | null;
  recent_bookings: DashboardBooking[];
  recent_payments: DashboardPayment[];
};
