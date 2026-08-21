import GameCard from "@/components/GameCard";
import { getGames, getMedia, mediaForGame } from "@/lib/cfbd";

export default async function SchedulePage() {
  const [games, media] = await Promise.all([getGames(), getMedia()]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">2026 Schedule</h2>
        <p className="text-sm text-white/55">Tap any game for details</p>
      </div>
      {games.length === 0 ? (
        <p className="text-white/70">No games found.</p>
      ) : (
        games.map((game) => (
          <GameCard key={game.id} game={game} tv={mediaForGame(media, game)} />
        ))
      )}
    </div>
  );
}
