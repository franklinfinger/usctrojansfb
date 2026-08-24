"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Menu, Shirt, TrendingUp, X } from "lucide-react";

const primaryLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/roster", label: "Roster", icon: Shirt },
  { href: "/stats", label: "Stats", icon: TrendingUp },
];

const moreLinks = [
  { href: "/recruiting", label: "Recruiting" },
  { href: "/team", label: "Team" },
  { href: "/coliseum", label: "Coliseum" },
  { href: "/news", label: "News" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on any route change — covers link taps inside the sheet, the
  // primary tabs, and back/forward navigation alike.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isMoreActive = moreLinks.some((link) => pathname.startsWith(link.href));

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          // z-45: above Tommy's peek (z-35) so the sheet's backdrop fully
          // covers him while open, below the nav itself (promoted to z-50
          // only while open, see below) so the sheet content stays on top.
          className="fixed inset-0 z-[45] bg-ink/30 md:hidden"
        />
      ) : null}

      <nav
        className={`fixed bottom-0 left-0 right-0 border-t border-ink/10 bg-cream-card/95 backdrop-blur md:hidden ${
          // Baseline z-30 matches Tommy Trojan's peek sitting above the closed
          // bar (see .tommy-peek in globals.css) — deliberately unchanged so
          // that relationship still holds. Promoted only while the sheet is
          // open, so the sheet renders above Tommy too, not just the bar.
          open ? "z-50" : "z-30"
        }`}
      >
        {open ? (
          <div className="border-b border-ink/10 px-4 pb-3 pt-4">
            <p className="label-cap mb-3">More</p>
            <div className="grid grid-cols-2 gap-2">
              {moreLinks.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "border-cardinal/30 bg-cardinal/5 text-cardinal"
                        : "border-ink/10 bg-cream text-ink/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {primaryLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-1 py-2.5 ${
                  active ? "text-cardinal" : "text-ink/40"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close more menu" : "Open more menu"}
            className={`flex flex-col items-center gap-1 px-1 py-2.5 ${
              open || isMoreActive ? "text-cardinal" : "text-ink/40"
            }`}
          >
            {open ? (
              <X size={20} strokeWidth={2.4} />
            ) : (
              <Menu size={20} strokeWidth={isMoreActive ? 2.4 : 1.8} />
            )}
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
