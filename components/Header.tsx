import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3.5">
        <Link href="/" className="group">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
            Fight On
          </p>
          <h1 className="text-[17px] font-semibold tracking-tight text-white group-active:text-gold">
            Trojan Command
          </h1>
        </Link>
        <Link
          href="/team"
          className="rounded-full bg-gradient-to-b from-cardinal-soft to-cardinal px-3.5 py-1.5 text-[11px] font-bold tracking-wide shadow-glow"
        >
          USC
        </Link>
      </div>
    </header>
  );
}
