import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import "leaflet/dist/leaflet.css";
import { AppProvider } from "@/providers/AppProvider";
import SupportButton from "@/components/Support";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Natso Rental – Calgary Rooms",
  description: "Find mid/long-term rooms in Calgary.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Maps Places API */}
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBI9IBi-KhTN4dI7zgiBvqZeReI9-6VXiA&libraries=places"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-white text-black relative">
        <QueryProvider>
          <AuthProvider>
            <Header />
            <AppProvider>
              <main className="min-h-[70vh]">{children}</main>
            </AppProvider>
            <Footer />
            <div className="fixed bottom-5 right-5 z-50">
              <SupportButton />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}