import GameCard from "@/components/GameCard";
import { getGames, getMedia, mediaForGame } from "@/lib/cfbd";

export default async function SchedulePage() {
  const [games, media] = await Promise.all([getGames(), getMedia()]);

  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="eyebrow">2026 season</p>
        <h1 className="page-title">Schedule</h1>
        <p className="page-sub">Tap any game for the game-day hub</p>
      </div>
      {games.length === 0 ? (
        <p className="empty-state">No games found.</p>
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
