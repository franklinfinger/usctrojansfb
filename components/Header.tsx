import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Fight On</p>
          <h1 className="text-lg font-semibold">Trojan Command Center</h1>
        </Link>
        <Link
          href="/team"
          className="rounded-full bg-cardinal px-3 py-1 text-xs font-semibold"
        >
          USC
        </Link>
      </div>
    </header>
  );
}
