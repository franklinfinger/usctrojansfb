import PageHero from "@/components/PageHero";
import ScoreboardCard from "@/components/ScoreboardCard";
import { getAllRankings, getTeams } from "@/lib/cfbd";
import { getScoreboard } from "@/lib/espn";
import { buildPollTabs, top25Schools } from "@/lib/rankings";

const CONFERENCE = "Big Ten";

const STATE_ORDER = { in: 0, pre: 1, post: 2 };

export default async function ScoreboardPage() {
  const [games, weeks, teams] = await Promise.all([
    getScoreboard(),
    getAllRankings().catch(() => []),
    getTeams().catch(() => []),
  ]);

  const top25 = top25Schools(buildPollTabs(weeks));
  const conferenceSchools = new Set(
    teams.filter((t) => t.conference === CONFERENCE).map((t) => t.school.toLowerCase().trim())
  );

  // A single OR filter over the full weekly list — a game that matches both
  // conditions (e.g. a ranked Big Ten team) still only appears once, since
  // it's one entry in `games` being kept, not merged from two sources.
  const relevant = games.filter((g) => {
    const home = g.home.school.toLowerCase().trim();
    const away = g.away.school.toLowerCase().trim();
    return (
      conferenceSchools.has(home) ||
      conferenceSchools.has(away) ||
      top25.has(home) ||
      top25.has(away)
    );
  });

  const sorted = relevant.slice().sort((a, b) => {
    const stateDiff = STATE_ORDER[a.state] - STATE_ORDER[b.state];
    if (stateDiff !== 0) return stateDiff;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <>
      <PageHero
        eyebrow="Live"
        title="Scoreboard"
        subtitle="Big Ten games and every ranked Top 25 matchup"
      />
      <div className="page-shell-wide">
        {sorted.length === 0 ? (
          <p className="empty-state">No relevant games right now — check back closer to kickoff.</p>
        ) : (
          <div className="space-y-3">
            {sorted.map((game) => (
              <ScoreboardCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
