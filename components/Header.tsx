import Link from "next/link";

const links = [
  { href: "/schedule", label: "Schedule" },
  { href: "/roster", label: "Roster" },
  { href: "/stats", label: "Stats" },
  { href: "/recruiting", label: "Recruiting" },
  { href: "/team", label: "Team" },
  { href: "/coliseum", label: "Coliseum" },
  { href: "/news", label: "News" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-gold bg-cardinal font-serif text-lg text-gold">
            SC
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-cardinal">
              Trojan
            </span>
            <span className="block text-sm font-semibold uppercase tracking-[0.08em] text-cardinal">
              Command Center
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink/70 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link hover:text-cardinal">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
