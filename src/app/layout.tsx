import "./globals.css";
import type { Metadata } from "next";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import "leaflet/dist/leaflet.css";

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
      <body className="min-h-screen bg-white text-black">
        <StoreProvider>
          <QueryProvider>
            <AuthProvider>
              {/* ✅ Move Header INSIDE AuthProvider */}
              <Header />
              <main className="min-h-[70vh]">{children}</main>
              <Footer />
            </AuthProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
