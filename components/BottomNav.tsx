"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Shirt, TrendingUp, Users } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/roster", label: "Roster", icon: Shirt },
  { href: "/stats", label: "Stats", icon: TrendingUp },
  { href: "/recruiting", label: "Recruit", icon: Users },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/8 bg-ink/85 backdrop-blur-2xl">
      <div className="mx-auto grid max-w-lg grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-1 py-2.5 ${
                active ? "text-gold" : "text-white/45"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.4 : 1.8}
                className={active ? "drop-shadow-[0_0_8px_rgba(255,199,44,0.45)]" : ""}
              />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
