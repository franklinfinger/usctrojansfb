import GameCard from "@/components/GameCard";
import { getGames, getMedia, mediaForGame } from "@/lib/cfbd";

export default async function SchedulePage() {
  const [games, media] = await Promise.all([getGames(), getMedia()]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Schedule</h2>
        <p className="mt-0.5 text-sm text-white/45">2026 · tap a game for details</p>
      </div>
      {games.length === 0 ? (
        <p className="glass rounded-2xl p-4 text-sm text-white/55">No games found.</p>
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} tv={mediaForGame(media, game)} />
          ))}
        </div>
      )}
    </div>
  );
}
