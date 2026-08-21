import GameCard from "@/components/GameCard";
import { getGames } from "@/lib/cfbd";

export default async function SchedulePage() {
  const games = await getGames();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">2026 Schedule</h2>
      {games.length === 0 ? (
        <p className="text-white/70">No games found.</p>
      ) : (
        games.map((game) => <GameCard key={game.id} game={game} />)
      )}
    </div>
  );
}
