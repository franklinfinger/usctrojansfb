import GameCard from "@/components/GameCard";
import PageHero from "@/components/PageHero";
import { findTeam, getGames, getMedia, getTeams, mediaForGame, opponentOf, teamLogo } from "@/lib/cfbd";

export default async function SchedulePage() {
  const [games, media, teams] = await Promise.all([
    getGames(),
    getMedia(),
    getTeams().catch(() => []),
  ]);

  return (
    <>
      <PageHero eyebrow="2026 season" title="Schedule" subtitle="Tap any game for the game-day hub" />
      <div className="page-shell-wide">
        {games.length === 0 ? (
          <p className="empty-state">No games found.</p>
        ) : (
          <div className="space-y-3">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                tv={mediaForGame(media, game)}
                logo={teamLogo(findTeam(teams, opponentOf(game)))}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
