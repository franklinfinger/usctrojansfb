import Countdown from "@/components/Countdown";
import GameCard from "@/components/GameCard";
import {
  getGames,
  getMedia,
  getPlayerSeasonStats,
  getRankings,
  getRecord,
  mediaForGame,
  opponentOf,
  pickNextAndLast,
} from "@/lib/cfbd";

export default async function HomePage() {
  const [games, record, rankings, media, passing, rushing] = await Promise.all([
    getGames(),
    getRecord(),
    getRankings(),
    getMedia(),
    getPlayerSeasonStats("passing").catch(() => []),
    getPlayerSeasonStats("rushing").catch(() => []),
  ]);

  const { next, last } = pickNextAndLast(games);
  const nextTv = next ? mediaForGame(media, next) : null;

  const passLeader = [...passing]
    .filter((s) => s.statType === "YDS" || s.statType === "YDS/G" || s.statType === "YARDS")
    .sort((a, b) => b.stat - a.stat)[0];
  const rushLeader = [...rushing]
    .filter((s) => s.statType === "YDS" || s.statType === "YDS/G" || s.statType === "YARDS")
    .sort((a, b) => b.stat - a.stat)[0];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cardinal via-cardinal-deep to-ink p-5 shadow-glow">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          2026 Season
        </p>
        <h2 className="mt-1 text-[28px] font-bold tracking-tight">USC Trojans</h2>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <p className="text-3xl font-bold tabular-nums tracking-tight">
              {record ? `${record.total.wins}-${record.total.losses}` : "0-0"}
            </p>
            <p className="text-xs text-white/60">Overall</p>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div>
            <p className="text-xl font-semibold tabular-nums">
              {record
                ? `${record.conferenceGames.wins}-${record.conferenceGames.losses}`
                : "0-0"}
            </p>
            <p className="text-xs text-white/60">Big Ten</p>
          </div>
          {(rankings.ap || rankings.coaches) && (
            <>
              <div className="h-8 w-px bg-white/15" />
              <div className="flex gap-2">
                {rankings.ap ? (
                  <span className="chip-gold">AP #{rankings.ap}</span>
                ) : null}
                {rankings.coaches ? (
                  <span className="chip">Coaches #{rankings.coaches}</span>
                ) : null}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Next game */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="section-label">Next game</h3>
          {next ? (
            <span className="text-xs text-white/35">vs {opponentOf(next)}</span>
          ) : null}
        </div>
        {next ? (
          <>
            <GameCard game={next} tv={nextTv} />
            {!next.startTimeTbd ? <Countdown targetIso={next.startDate} /> : null}
          </>
        ) : (
          <p className="glass rounded-2xl p-4 text-sm text-white/55">Schedule not available yet.</p>
        )}
      </section>

      {last ? (
        <section className="space-y-3">
          <h3 className="section-label">Latest result</h3>
          <GameCard game={last} tv={mediaForGame(media, last)} compact />
        </section>
      ) : null}

      {(passLeader || rushLeader) && (
        <section className="space-y-3">
          <h3 className="section-label">Leaders</h3>
          <div className="grid grid-cols-2 gap-3">
            {passLeader ? (
              <div className="glass-strong rounded-2xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">Passing</p>
                <p className="mt-1.5 truncate font-semibold">{passLeader.player}</p>
                <p className="mt-0.5 text-sm text-white/50">
                  {passLeader.stat} {passLeader.statType}
                </p>
              </div>
            ) : null}
            {rushLeader ? (
              <div className="glass-strong rounded-2xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">Rushing</p>
                <p className="mt-1.5 truncate font-semibold">{rushLeader.player}</p>
                <p className="mt-0.5 text-sm text-white/50">
                  {rushLeader.stat} {rushLeader.statType}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}
