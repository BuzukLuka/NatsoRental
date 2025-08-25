import "./globals.css";
import type { Metadata } from "next";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

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
          <Header />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
