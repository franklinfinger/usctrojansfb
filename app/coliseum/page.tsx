import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import FightSongPlayer from "@/components/FightSongPlayer";
import PageHero from "@/components/PageHero";

function PhotoSlot({ label, onDark = false }: { label: string; onDark?: boolean }) {
  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${label}`}
      className={`flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 text-center ${
        onDark ? "border-white/25 bg-white/5 text-white/50" : "border-ink/20 bg-cream-mute text-ink-faint"
      }`}
    >
      <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
      <p className="text-xs font-semibold uppercase tracking-wider">Photo placeholder</p>
      <p className={`text-xs ${onDark ? "text-white/40" : "text-ink-faint/80"}`}>{label}</p>
    </div>
  );
}

export default function ColiseumPage() {
  return (
    <>
      <PageHero
        eyebrow="USC Football · Home Field"
        title="The Grand Old Lady"
        subtitle="United Airlines Field at the Los Angeles Memorial Coliseum"
      />

      {/* Since 1923 — cream */}
      <section className="page-shell-wide space-y-6">
        <div>
          <p className="eyebrow">Since 1923</p>
          <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">USC&rsquo;s only home</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            Opened in 1923 as a memorial to Los Angeles veterans of World War I, the Coliseum has
            been USC&rsquo;s home field since the day it opened. More than a century later, the
            Trojans have never played a home game anywhere else.
          </p>
        </div>
        <PhotoSlot label="Coliseum exterior / 1923 opening" />
      </section>

      {/* Olympic Stadium — dark */}
      <section className="section-dark">
        <div className="relative z-10 mx-auto max-w-6xl space-y-6 px-4 py-14 md:px-8 md:py-20">
          <div>
            <p className="hero-eyebrow">Olympic Stadium</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl">
              Twice already. A third time in 2028.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
              It is the only stadium in the world to have hosted the Summer Olympics twice, in
              1932 and 1984, and it is scheduled to do so again in 2028, which will make it the
              first three-time Olympic stadium in history. The Olympic cauldron still stands above
              the peristyle arches at the east end, and it is lit for special occasions, including
              Trojan home games.
            </p>
          </div>
          <PhotoSlot label="Peristyle arches and Olympic cauldron" onDark />
        </div>
      </section>

      {/* More than football — cream */}
      <section className="page-shell-wide space-y-6">
        <div>
          <p className="eyebrow">More than football</p>
          <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
            Presidents, championships, two NFL teams
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            The building has hosted the first Super Bowl in 1967 and Super Bowl VII, a World
            Series, an NFL championship, and John F. Kennedy&rsquo;s acceptance of the Democratic
            nomination in 1960. It has been home to the Rams and the Raiders. It was declared a
            National Historic Landmark in 1984.
          </p>
        </div>
        <PhotoSlot label="Historic Coliseum crowd / archival" />
      </section>

      {/* 2019 renovation — dark */}
      <section className="section-dark">
        <div className="relative z-10 mx-auto max-w-6xl space-y-6 px-4 py-14 md:px-8 md:py-20">
          <div>
            <p className="hero-eyebrow">2019 Renovation</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl">
              Rebuilt, not replaced
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
              A major renovation completed in 2019 rebuilt the seating bowl, added premium areas,
              and brought the field naming rights to United Airlines, while preserving the
              peristyle and the historic exterior.
            </p>
          </div>
          <PhotoSlot label="Renovated seating bowl" onDark />
        </div>
      </section>

      {/* Closing CTA — cream */}
      <section className="page-shell-wide">
        <div className="card-feature p-8 text-center">
          <p className="label-cap">Game day</p>
          <h2 className="mt-2 font-serif text-2xl text-ink md:text-3xl">
            See the Coliseum for yourself
          </h2>
          <p className="mt-2 text-sm text-ink-soft">Check the schedule for the next home game.</p>
          <Link href="/schedule" className="btn-quiet mt-5 inline-block">
            View schedule →
          </Link>
        </div>
      </section>

      {/* Fight song — dark */}
      <section className="section-dark">
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 text-center md:px-8 md:py-20">
          <p className="hero-eyebrow">Game Day Anthem</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl">
            Every touchdown, every win
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
            USC&rsquo;s fight song, played after every Trojan score at the Coliseum.
          </p>
          <div className="mt-8 flex justify-center">
            <FightSongPlayer />
          </div>
        </div>
      </section>
    </>
  );
}
