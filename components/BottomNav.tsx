import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/roster", label: "Roster" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto grid max-w-3xl grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-3 text-center text-sm text-white/80 active:text-gold"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
