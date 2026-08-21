import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Trojan Command Center",
  description: "USC Trojans football command center",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#070708",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-ink font-sans text-white antialiased">
        <div className="pointer-events-none fixed inset-0 bg-hero-mesh" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col">
          <Header />
          <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
