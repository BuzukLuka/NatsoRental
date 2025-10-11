// hooks/useBookings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import type { BookingSummary, CreateBookingInput } from "@/types/api";

// List
export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async (): Promise<BookingSummary[]> => {
      const res = await api.get("/bookings/");
      return res.data;
    },
  });
}

// Create (expects room_id, check_in, check_out)
export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBookingInput): Promise<BookingSummary> => {
      const res = await api.post("/bookings/", payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

// Delete
export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/bookings/${id}/`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

// --- Payments: create Stripe session and redirect
export function useCreateStripeSession() {
  return useMutation({
    mutationFn: async (bookingId: number): Promise<{ checkout_url: string }> => {
      const res = await api.post("/payments/create-session/", {
        booking_id: bookingId,
      });
      return res.data;
    },
  });
}

// Convenience: make booking then redirect to Stripe
export function useStartCheckout() {
  const createBooking = useCreateBooking();
  const createSession = useCreateStripeSession();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      // 1) create booking
      const booking = await createBooking.mutateAsync(input);
      // 2) create stripe session
      const { checkout_url } = await createSession.mutateAsync(booking.id);
      // 3) redirect
      window.location.href = checkout_url;
      return { bookingId: booking.id };
    },
  });
}
