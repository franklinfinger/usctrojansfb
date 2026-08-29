import PageHero from "@/components/PageHero";
import RankingsTabs from "@/components/RankingsTabs";
import { getAllRankings, getTeams } from "@/lib/cfbd";
import { buildPollTabs } from "@/lib/rankings";

export default async function RankingsPage() {
  const [weeks, teams] = await Promise.all([
    getAllRankings().catch(() => []),
    getTeams().catch(() => []),
  ]);
  const polls = buildPollTabs(weeks);

  return (
    <>
      <PageHero eyebrow="Polls" title="Rankings" subtitle="AP, Coaches, and CFP Top 25 · 2026 season" />
      <div className="page-shell-wide">
        <RankingsTabs polls={polls} teams={teams} />
      </div>
    </>
  );
}
