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

  const rankBits = [
    rankings.ap ? `AP #${rankings.ap}` : null,
    rankings.coaches ? `Coaches #${rankings.coaches}` : null,
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-cardinal p-5">
        <p className="text-sm uppercase tracking-widest text-gold">2026 Season</p>
        <h2 className="mt-1 text-3xl font-bold">USC Trojans</h2>
        <p className="mt-2 text-lg">
          {record
            ? `${record.total.wins}-${record.total.losses} overall · ${record.conferenceGames.wins}-${record.conferenceGames.losses} Big Ten`
            : "Season starting soon"}
        </p>
        {rankBits.length > 0 ? (
          <p className="mt-1 text-sm text-gold">{rankBits.join(" · ")}</p>
        ) : (
          <p className="mt-1 text-sm text-white/70">Rankings update after Week 1</p>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-sm uppercase tracking-wide text-white/60">Next game</h3>
        {next ? (
          <div className="space-y-3">
            <GameCard game={next} tv={nextTv} />
            {!next.startTimeTbd ? <Countdown targetIso={next.startDate} /> : null}
          </div>
        ) : (
          <p className="text-white/70">Schedule not available yet.</p>
        )}
      </section>

      {last ? (
        <section>
          <h3 className="mb-3 text-sm uppercase tracking-wide text-white/60">Latest result</h3>
          <GameCard game={last} tv={mediaForGame(media, last)} compact />
        </section>
      ) : null}

      {(passLeader || rushLeader) && (
        <section>
          <h3 className="mb-3 text-sm uppercase tracking-wide text-white/60">Statistical leaders</h3>
          <div className="grid grid-cols-2 gap-3">
            {passLeader ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase text-gold">Passing</p>
                <p className="mt-1 font-semibold">{passLeader.player}</p>
                <p className="text-sm text-white/60">
                  {passLeader.stat} {passLeader.statType}
                </p>
              </div>
            ) : null}
            {rushLeader ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase text-gold">Rushing</p>
                <p className="mt-1 font-semibold">{rushLeader.player}</p>
                <p className="text-sm text-white/60">
                  {rushLeader.stat} {rushLeader.statType}
                </p>
              </div>
            ) : null}
          </div>
          {!passLeader && !rushLeader ? (
            <p className="text-sm text-white/50">Leaders appear after games are played.</p>
          ) : null}
        </section>
      )}

      {next ? (
        <p className="text-center text-xs text-white/40">
          Next up: {opponentOf(next)} · Fight On
        </p>
      ) : null}
    </div>
  );
}
