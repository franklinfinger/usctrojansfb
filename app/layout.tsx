import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Source_Sans_3 } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trojan Command Center",
  description: "Everything Trojan football. One command center.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#990000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-ink antialiased">
        <Header />
        <main className="pb-24 md:pb-10">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
