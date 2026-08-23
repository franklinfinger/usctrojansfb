import Link from "next/link";
import SectionDivider from "@/components/SectionDivider";
import SectionHeader from "@/components/SectionHeader";
import StatGrid from "@/components/StatGrid";
import TrojanHorseRunner from "@/components/TrojanHorseRunner";
import {
  TEAM,
  findTeam,
  getGames,
  getMedia,
  getRankings,
  getRecord,
  getRecruitingTeamRank,
  getRoster,
  getTeams,
  isUscHome,
  mediaForGame,
  opponentOf,
  pickNextAndLast,
  teamLogo,
} from "@/lib/cfbd";
import { initials } from "@/lib/utils";

function shortDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Los_Angeles",
    })
    .toUpperCase();
}

function kickTime(iso: string, tbd: boolean) {
  if (tbd) return "TBD";
  return (
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Los_Angeles",
    }) + " PT"
  );
}

function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default async function HomePage() {
  const [games, record, rankings, media, recruit, roster, teams] = await Promise.all([
    getGames(),
    getRecord(),
    getRankings(),
    getMedia(),
    getRecruitingTeamRank().catch(() => null),
    getRoster().catch(() => []),
    getTeams().catch(() => []),
  ]);

  const { next } = pickNextAndLast(games);
  const nextTv = next ? mediaForGame(media, next) : null;
  const opp = next ? opponentOf(next) : null;
  const home = next ? isUscHome(next) : true;

  const uscLogo = teamLogo(findTeam(teams, TEAM));
  const oppLogo = opp ? teamLogo(findTeam(teams, opp)) : null;

  return (
    <>
      {/* Hero — broadcast open */}
      <section className="section-dark hero-glow">
        <TrojanHorseRunner />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-24">
          <div>
            <p className="hero-eyebrow">USC Football · 2026 Season</p>
            <h1 className="mt-5 hero-headline">Everything Trojan football.</h1>
            <p className="mt-3 hero-subhead">One command center.</p>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/80">
              Schedules, scores, roster, stats, recruiting, and game-day intelligence built for the
              Trojan Family.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/schedule" className="btn-gold">
                View full schedule →
              </Link>
              <Link href="/roster" className="btn-ghost">
                Explore the team
              </Link>
            </div>
          </div>

          {next && opp ? (
            <article className="card-feature relative overflow-hidden text-ink shadow-glow">
              <div className="flex items-center justify-between px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
                <span className="text-ink-soft">Next game</span>
                <span className="rounded-full bg-gold px-2.5 py-1 text-ink">
                  {daysUntil(next.startDate)} days
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 py-6">
                <div className="text-center">
                  <div className="team-mark mx-auto h-20 w-20 border-4 border-gold md:h-24 md:w-24">
                    {uscLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={uscLogo} alt="USC logo" className="h-full w-full object-contain" />
                    ) : (
                      <span className="font-serif text-xl text-cardinal">SC</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold">USC</p>
                  <p className="text-[10px] uppercase tracking-wider text-ink-faint">Trojans</p>
                </div>
                <div className="text-center text-ink-faint">
                  <p className="text-xs font-semibold tracking-[0.2em]">VS</p>
                  <p className="mt-1 text-[11px]">{shortDate(next.startDate)}</p>
                </div>
                <div className="text-center">
                  <div className="team-mark mx-auto h-20 w-20 border-2 border-ink/10 md:h-24 md:w-24">
                    {oppLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={oppLogo}
                        alt={`${opp} logo`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="font-serif text-lg text-ink">{initials(opp)}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold uppercase">{opp}</p>
                  <p className="text-[10px] uppercase tracking-wider text-ink-faint">
                    {home ? "Visitor" : "Host"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 px-5 pb-4 text-xs text-ink-soft">
                <span>{kickTime(next.startDate, next.startTimeTbd)}</span>
                {nextTv ? <span>· {nextTv}</span> : null}
                {next.venue ? (
                  <span>· {next.venue.replace("Los Angeles Memorial ", "")}</span>
                ) : null}
              </div>
              <Link
                href={`/schedule/${next.id}`}
                className="block bg-ink py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
              >
                Open game day hub →
              </Link>
            </article>
          ) : null}
        </div>
      </section>

      <SectionDivider />

      {/* Stats — cream */}
      <section className="page-shell-wide">
        <StatGrid
          items={[
            {
              label: "2026 Record",
              value: record ? `${record.total.wins}-${record.total.losses}` : "0-0",
              hint: record
                ? `${record.conferenceGames.wins}-${record.conferenceGames.losses} Big Ten`
                : "0-0 Big Ten",
            },
            { label: "AP Rank", value: rankings.ap ? `#${rankings.ap}` : "—", hint: "Preseason" },
            {
              label: "Next kickoff",
              value: next ? shortDate(next.startDate) : "TBD",
              hint: opp ? `vs ${opp}` : "",
            },
            {
              label: "Recruiting",
              value: recruit ? `#${recruit.rank}` : "—",
              hint: "2026 class",
            },
          ]}
        />
      </section>

      <SectionDivider />

      {/* Featured story — dark band */}
      <section className="section-dark">
        <Link
          href="/news"
          className="relative z-10 mx-auto block max-w-6xl px-4 py-10 transition hover:opacity-90 md:px-8 md:py-14"
        >
          <p className="hero-eyebrow">Latest</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            Fall camp enters its final stretch
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Position battles, emerging leaders, and everything to watch as kickoff approaches.
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-gold-bright">
            Read the briefing →
          </p>
        </Link>
      </section>

      <SectionDivider />

      {/* Program snapshot — cream */}
      <section className="page-shell-wide">
        <SectionHeader
          level="h2"
          eyebrow="Quick look"
          title="Inside the program"
          seeAll={{ href: "/roster", label: "See everything →" }}
          className="mb-6"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/roster" className="card-feature p-6 transition hover:-translate-y-0.5">
            <span className="rounded-sm bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
              Roster
            </span>
            <h3 className="mt-4 font-serif text-2xl md:text-3xl">2026 team snapshot</h3>
            <div className="mt-5">
              <p className="stat-figure">{roster.length || "—"}</p>
              <p className="label-cap mt-1">Players</p>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Explore roster →
            </p>
          </Link>

          <Link href="/recruiting" className="card-feature p-6 transition hover:-translate-y-0.5">
            <span className="rounded-sm bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Recruiting
            </span>
            <h3 className="mt-4 font-serif text-2xl md:text-3xl">2026 class</h3>
            <div className="mt-5">
              <p className="stat-figure">{recruit ? `#${recruit.rank}` : "—"}</p>
              <p className="label-cap mt-1">National ranking</p>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
              View class →
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
