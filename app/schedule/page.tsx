import GameCard from "@/components/GameCard";
import PageHero from "@/components/PageHero";
import {
  findTeam,
  getGames,
  getMedia,
  getTeams,
  getVenues,
  mediaForGame,
  opponentOf,
  teamLogo,
} from "@/lib/cfbd";
import { weatherForGame } from "@/lib/weather";

export default async function SchedulePage() {
  const [games, media, teams, venues] = await Promise.all([
    getGames(),
    getMedia(),
    getTeams().catch(() => []),
    getVenues().catch(() => []),
  ]);

  const weather = await Promise.all(games.map((game) => weatherForGame(game, venues)));

  return (
    <>
      <PageHero eyebrow="2026 season" title="Schedule" subtitle="Tap any game for the game-day hub" />
      <div className="page-shell-wide">
        {games.length === 0 ? (
          <p className="empty-state">No games found.</p>
        ) : (
          <div className="space-y-3">
            {games.map((game, i) => (
              <GameCard
                key={game.id}
                game={game}
                tv={mediaForGame(media, game)}
                logo={teamLogo(findTeam(teams, opponentOf(game)))}
                weather={weather[i]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
