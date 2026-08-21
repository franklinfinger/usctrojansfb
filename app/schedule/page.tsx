import GameCard from "@/components/GameCard";
import { getGames, getMedia, mediaForGame } from "@/lib/cfbd";

export default async function SchedulePage() {
  const [games, media] = await Promise.all([getGames(), getMedia()]);

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-10 md:px-8">
      <div>
        <p className="eyebrow">2026 season</p>
        <h2 className="mt-1 font-serif text-4xl">Schedule</h2>
      </div>
      {games.length === 0 ? (
        <p className="text-ink/55">No games found.</p>
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
