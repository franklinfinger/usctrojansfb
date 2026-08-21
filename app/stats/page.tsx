import Link from "next/link";
import { getGames, getPlayerSeasonStats, getTeamStats } from "@/lib/cfbd";

const TEAM_HIGHLIGHTS = [
  "totalYards",
  "netPassingYards",
  "rushingYards",
  "passingTDs",
  "rushingTDs",
  "turnovers",
  "thirdDownConversions",
  "thirdDowns",
  "sacks",
  "tacklesForLoss",
  "interceptions",
  "points",
];

export default async function StatsPage() {
  const [teamStats, passing, rushing, receiving, defense, games] = await Promise.all([
    getTeamStats().catch(() => []),
    getPlayerSeasonStats("passing").catch(() => []),
    getPlayerSeasonStats("rushing").catch(() => []),
    getPlayerSeasonStats("receiving").catch(() => []),
    getPlayerSeasonStats("defensive").catch(() => []),
    getGames().catch(() => []),
  ]);

  const teamMap = Object.fromEntries(teamStats.map((s) => [s.statName, s.statValue]));
  const highlights = TEAM_HIGHLIGHTS.filter((k) => teamMap[k] != null).map((k) => ({
    name: k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
    value: teamMap[k],
  }));

  function top(
    rows: { player: string; stat: number; statType: string }[],
    types: string[],
    n = 5
  ) {
    return [...rows]
      .filter((r) => types.includes(r.statType))
      .sort((a, b) => b.stat - a.stat)
      .slice(0, n);
  }

  const passYds = top(passing, ["YDS", "YARDS", "YDS/G"]);
  const rushYds = top(rushing, ["YDS", "YARDS", "YDS/G"]);
  const recYds = top(receiving, ["YDS", "YARDS", "YDS/G"]);
  const tackles = top(defense, ["TOT", "TOTAL", "TACKLES", "UA"]);
  const hasAny =
    highlights.length > 0 ||
    passYds.length > 0 ||
    rushYds.length > 0 ||
    recYds.length > 0 ||
    tackles.length > 0;

  const next = games.find((g) => !g.completed);

  return (
    <div className="page-shell space-y-8">
      <div>
        <p className="eyebrow">Analytics</p>
        <h1 className="page-title">Statistics</h1>
        <p className="page-sub">2026 season · live numbers after each game</p>
      </div>

      {!hasAny ? (
        <div className="card overflow-hidden">
          <div className="bg-cardinal px-6 py-8 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-bright">
              Preseason
            </p>
            <h2 className="mt-2 font-serif text-3xl">Stats unlock after kickoff</h2>
            <p className="mt-3 max-w-xl text-sm text-white/75">
              Team and player leaders will appear here as soon as USC plays its first game.
              Until then, use the schedule and roster to track the program.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/schedule" className="btn-gold">
                View schedule →
              </Link>
              <Link href="/roster" className="btn-ghost">
                Explore roster
              </Link>
            </div>
          </div>
          <div className="grid gap-0 md:grid-cols-3">
            <InfoCell label="First game" value={next ? `Week ${next.week}` : "TBD"} />
            <InfoCell label="Categories tracked" value="Pass · Rush · Rec · Def" />
            <InfoCell label="Updates" value="After each final" />
          </div>
        </div>
      ) : (
        <>
          <section>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              Team
            </h3>
            {highlights.length === 0 ? (
              <p className="empty-state">Team totals appear after the first games.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {highlights.map((h) => (
                  <div key={h.name} className="card p-4">
                    <p className="text-xs text-ink-faint">{h.name}</p>
                    <p className="mt-1 text-2xl font-semibold text-cardinal">{h.value}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <LeaderBlock title="Passing yards" rows={passYds} />
          <LeaderBlock title="Rushing yards" rows={rushYds} />
          <LeaderBlock title="Receiving yards" rows={recYds} />
          <LeaderBlock title="Tackles" rows={tackles} />
        </>
      )}
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-ink/8 p-5 md:border-t-0 md:border-r md:last:border-r-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

function LeaderBlock({
  title,
  rows,
}: {
  title: string;
  rows: { player: string; stat: number; statType: string }[];
}) {
  return (
    <section>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="empty-state">No data yet.</p>
      ) : (
        <div className="card overflow-hidden">
          {rows.map((r, i) => (
            <div
              key={`${r.player}-${i}`}
              className="flex items-center justify-between border-b border-ink/6 px-4 py-3 last:border-b-0"
            >
              <span className="font-medium">{r.player}</span>
              <span className="font-semibold text-cardinal">
                {r.stat}{" "}
                <span className="text-xs font-normal text-ink-faint">{r.statType}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
