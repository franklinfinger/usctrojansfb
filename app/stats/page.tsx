import {
  getPlayerSeasonStats,
  getTeamStats,
} from "@/lib/cfbd";

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
  const [teamStats, passing, rushing, receiving, defense] = await Promise.all([
    getTeamStats().catch(() => []),
    getPlayerSeasonStats("passing").catch(() => []),
    getPlayerSeasonStats("rushing").catch(() => []),
    getPlayerSeasonStats("receiving").catch(() => []),
    getPlayerSeasonStats("defensive").catch(() => []),
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Statistics</h2>
        <p className="text-sm text-white/55">2026 season · updates after games</p>
      </div>

      <section>
        <h3 className="mb-3 text-sm uppercase tracking-wide text-white/60">Team</h3>
        {highlights.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/55">
            Team stats unlock after the first games.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {highlights.map((h) => (
              <div key={h.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/55">{h.name}</p>
                <p className="mt-1 text-xl font-semibold">{h.value}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <LeaderBlock title="Passing yards" rows={passYds} />
      <LeaderBlock title="Rushing yards" rows={rushYds} />
      <LeaderBlock title="Receiving yards" rows={recYds} />
      <LeaderBlock title="Tackles" rows={tackles} />
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
      <h3 className="mb-3 text-sm uppercase tracking-wide text-white/60">{title}</h3>
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/55">
          No data yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {rows.map((r, i) => (
            <div
              key={`${r.player}-${i}`}
              className="flex items-center justify-between border-b border-white/10 px-4 py-3 last:border-b-0"
            >
              <span>{r.player}</span>
              <span className="font-semibold text-gold">
                {r.stat} <span className="text-xs text-white/40">{r.statType}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
