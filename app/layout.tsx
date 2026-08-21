import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trojan Command Center",
  description: "USC Trojans football tracker",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#990000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink pb-20 text-white">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-5">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
