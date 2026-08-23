import Image from "next/image";
import Link from "next/link";
import FightSongPlayer from "@/components/FightSongPlayer";
import PageHero from "@/components/PageHero";

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
        <Image
          src="/images/coliseum-night.jpg"
          alt="The Coliseum lit up and packed for a night game"
          width={960}
          height={720}
          className="aspect-video max-h-[500px] w-full rounded-2xl object-cover shadow-elevated"
          sizes="(min-width: 1024px) 960px, 100vw"
        />
      </section>

      {/* Olympic Stadium — dark */}
      <section className="section-dark">
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
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
        </div>
      </section>

      {/* More than football — cream */}
      <section className="page-shell-wide">
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
          <Image
            src="/images/coliseum-endzone.jpg"
            alt="The renovated Coliseum end zone and video board"
            width={499}
            height={400}
            className="aspect-video max-h-[500px] w-full rounded-2xl object-cover shadow-elevated"
            sizes="(min-width: 1024px) 1152px, 100vw"
          />
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
