import GameCard from "@/components/GameCard";
import { getGames, getRecord } from "@/lib/cfbd";

export default async function HomePage() {
  const [games, record] = await Promise.all([getGames(), getRecord()]);
  const now = Date.now();
  const next =
    games.find((g) => !g.completed && new Date(g.startDate).getTime() >= now) ??
    games.find((g) => !g.completed) ??
    games[games.length - 1];

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
      </section>

      <section>
        <h3 className="mb-3 text-sm uppercase tracking-wide text-white/60">Next game</h3>
        {next ? <GameCard game={next} /> : <p>Schedule not available yet.</p>}
      </section>
    </div>
  );
}
