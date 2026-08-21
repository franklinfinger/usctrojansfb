import Link from "next/link";
import {
  getGames,
  getMedia,
  getRankings,
  getRecord,
  getRecruitingTeamRank,
  getRoster,
  isUscHome,
  mediaForGame,
  opponentOf,
  pickNextAndLast,
} from "@/lib/cfbd";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  }).toUpperCase();
}

function kickTime(iso: string, tbd: boolean) {
  if (tbd) return "TBD";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  }) + " PT";
}

function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default async function HomePage() {
  const [games, record, rankings, media, recruit, roster] = await Promise.all([
    getGames(),
    getRecord(),
    getRankings(),
    getMedia(),
    getRecruitingTeamRank().catch(() => null),
    getRoster().catch(() => []),
  ]);

  const { next } = pickNextAndLast(games);
  const nextTv = next ? mediaForGame(media, next) : null;
  const opp = next ? opponentOf(next) : null;
  const home = next ? isUscHome(next) : true;

  return (
    <>
      <section className="bg-gradient-to-br from-cardinal via-[#8a0b0b] to-cardinal-deep text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              USC Football · 2026 Season
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.95] md:text-6xl">
              Everything Trojan football.
            </h1>
            <p className="mt-3 font-serif text-4xl italic text-gold md:text-5xl">
              One command center.
            </p>
            <p className="mt-5 max-w-md text-base text-white/75">
              Schedules, scores, roster, stats, recruiting, and game-day intelligence built for the Trojan Family.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/schedule" className="btn-gold">
                View full schedule →
              </Link>
              <Link href="/roster" className="btn-ghost">
                Explore the team
              </Link>
            </div>
          </div>

          {next && opp ? (
            <article className="overflow-hidden rounded-2xl bg-cream-card text-ink shadow-lift">
              <div className="flex items-center justify-between px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
                <span>Next game</span>
                <span className="rounded-full bg-gold/90 px-2.5 py-1 text-ink">
                  {daysUntil(next.startDate)} days
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 py-6">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-cardinal font-serif text-xl text-gold">
                    SC
                  </div>
                  <p className="mt-2 text-sm font-semibold">USC</p>
                  <p className="text-[10px] uppercase tracking-wider text-ink/40">Trojans</p>
                </div>
                <div className="text-center text-ink/40">
                  <p className="text-xs font-semibold tracking-[0.2em]">VS</p>
                  <p className="mt-1 text-[11px]">{shortDate(next.startDate)}</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink/15 bg-cream-mute font-serif text-lg text-ink">
                    {initials(opp)}
                  </div>
                  <p className="mt-2 text-sm font-semibold uppercase">{opp}</p>
                  <p className="text-[10px] uppercase tracking-wider text-ink/40">
                    {home ? "Visitor" : "Host"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 px-5 pb-4 text-xs text-ink/55">
                <span>{kickTime(next.startDate, next.startTimeTbd)}</span>
                {nextTv ? <span>· {nextTv}</span> : null}
                {next.venue ? <span>· {next.venue.replace("Los Angeles Memorial ", "")}</span> : null}
              </div>
              <Link
                href={`/schedule/${next.id}`}
                className="block bg-ink py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
              >
                Open game day hub →
              </Link>
            </article>
          ) : null}
        </div>
      </section>

      <section className="mx-auto -mt-5 max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-ink/8 bg-cream-card shadow-lift md:grid-cols-4">
          <StatCell label="2026 Record" value={record ? `${record.total.wins}-${record.total.losses}` : "0-0"} hint={record ? `${record.conferenceGames.wins}-${record.conferenceGames.losses} Big Ten` : "0-0 Big Ten"} />
          <StatCell label="AP Rank" value={rankings.ap ? `#${rankings.ap}` : "—"} hint="Preseason" />
          <StatCell label="Next kickoff" value={next ? shortDate(next.startDate) : "TBD"} hint={opp ? `vs ${opp}` : ""} />
          <StatCell label="Recruiting" value={recruit ? `#${recruit.rank}` : "—"} hint="2026 class" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="eyebrow">Quick look</p>
            <h2 className="mt-2 font-serif text-4xl">Inside the program</h2>
          </div>
          <Link href="/roster" className="hidden text-sm font-semibold text-cardinal md:inline">
            See everything →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/news" className="rounded-xl bg-cardinal-deep p-6 text-white">
            <span className="rounded-sm bg-cardinal px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
              Latest
            </span>
            <h3 className="mt-4 font-serif text-3xl">Fall camp enters its final stretch</h3>
            <p className="mt-3 text-sm text-white/70">
              Position battles, emerging leaders, and everything to watch as kickoff approaches.
            </p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em]">Read the briefing →</p>
          </Link>

          <Link href="/roster" className="rounded-xl border border-ink/8 bg-cream-card p-6">
            <span className="rounded-sm bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
              Roster
            </span>
            <h3 className="mt-4 font-serif text-3xl">2026 team snapshot</h3>
            <div className="mt-5 flex gap-6">
              <div>
                <p className="text-3xl font-semibold text-cardinal">{roster.length || "—"}</p>
                <p className="text-[11px] uppercase tracking-wider text-ink/40">Players</p>
              </div>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
              Explore roster →
            </p>
          </Link>

          <Link href="/recruiting" className="rounded-xl border border-ink/8 bg-cream-card p-6">
            <span className="rounded-sm bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Recruiting
            </span>
            <h3 className="mt-4 font-serif text-3xl">2027 class</h3>
            <p className="mt-4 font-serif text-5xl text-cardinal">{recruit ? `#${recruit.rank}` : "—"}</p>
            <p className="text-[11px] uppercase tracking-wider text-ink/40">National ranking</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">View class →</p>
          </Link>
        </div>
      </section>
    </>
  );
}

function StatCell({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="border-b border-ink/8 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/40">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="font-serif text-4xl text-cardinal">{value}</p>
        <p className="pb-1 text-[11px] uppercase tracking-wider text-ink/35">{hint}</p>
      </div>
    </div>
  );
}
