import Link from "next/link";
import { notFound } from "next/navigation";
import PlayerBadge from "@/components/PlayerBadge";
import {
  YEAR,
  findRecruitForPlayer,
  getPlayerCareerStats,
  getPlayerFromRoster,
  getRecruitsForClasses,
} from "@/lib/cfbd";
import { classYear, formatHeight } from "@/lib/utils";

// A senior on the YEAR roster could have been recruited as far back as ~2022;
// go a bit further to cover fifth-/sixth-year players too.
const RECRUITING_YEARS = Array.from({ length: YEAR - 2021 + 1 }, (_, i) => 2021 + i);

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playerId = Number(id);
  if (!Number.isFinite(playerId)) notFound();

  const [player, recruits] = await Promise.all([
    getPlayerFromRoster(playerId),
    getRecruitsForClasses(RECRUITING_YEARS).catch(() => []),
  ]);
  if (!player) notFound();

  const recruit = findRecruitForPlayer(recruits, player.firstName, player.lastName);
  const playerName = `${player.firstName} ${player.lastName}`;

  const careerStats = await getPlayerCareerStats(player.id, playerName).catch(() => []);

  const seasonRows = [...careerStats].sort((a, b) => {
    if (a.season !== b.season) return b.season - a.season;
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.statType.localeCompare(b.statType);
  });

  const distinctSeasons = new Set(careerStats.map((s) => s.season));

  const careerTotals: { category: string; statType: string; stat: number }[] = [];
  if (distinctSeasons.size > 1) {
    const totals = new Map<string, { category: string; statType: string; stat: number }>();
    for (const s of careerStats) {
      const key = `${s.category}|${s.statType}`;
      const existing = totals.get(key);
      if (existing) existing.stat += s.stat;
      else totals.set(key, { category: s.category, statType: s.statType, stat: s.stat });
    }
    careerTotals.push(
      ...[...totals.values()].sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.statType.localeCompare(b.statType);
      })
    );
  }

  const locationLine = [
    recruit?.school ?? null,
    player.hometown ? `${player.hometown}${player.homeState ? `, ${player.homeState}` : ""}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="page-shell space-y-6">
      <Link href="/roster" className="btn-quiet">
        ← Roster
      </Link>

      <section className="card-feature overflow-hidden">
        <div className="section-dark px-6 py-8">
          <div className="flex items-center gap-4">
            <PlayerBadge
              jersey={player.jersey}
              firstName={player.firstName}
              lastName={player.lastName}
              size="lg"
              onDark
            />
            <div>
              <p className="hero-eyebrow">
                #{player.jersey ?? "—"} · {player.position ?? "—"}
              </p>
              <h1 className="mt-1 font-serif text-4xl leading-[0.95] md:text-5xl">{playerName}</h1>
            </div>
          </div>
          <p className="mt-4 text-white/85">
            {[classYear(player.year), formatHeight(player.height), player.weight ? `${player.weight} lbs` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {locationLine ? <p className="mt-1 text-sm text-white/70">{locationLine}</p> : null}
        </div>
      </section>

      <section>
        <h2 className="mb-3 label-cap">Career Stats</h2>
        {seasonRows.length === 0 ? (
          <p className="empty-state">Season stats will appear after games are played.</p>
        ) : (
          <div className="card-feature overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/10">
                    <th className="table-head px-4 py-3 text-left">Season</th>
                    <th className="table-head px-4 py-3 text-left">Category</th>
                    <th className="table-head px-4 py-3 text-left">Stat</th>
                    <th className="table-head px-4 py-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {seasonRows.map((s, i) => (
                    <tr key={`${s.season}-${s.category}-${s.statType}-${i}`} className="row-divide">
                      <td className="table-cell whitespace-nowrap px-4 py-2.5">{s.season}</td>
                      <td className="table-cell whitespace-nowrap px-4 py-2.5 capitalize text-ink-soft">
                        {s.category}
                      </td>
                      <td className="table-cell whitespace-nowrap px-4 py-2.5 text-ink-soft">
                        {s.statType}
                      </td>
                      <td className="table-cell whitespace-nowrap px-4 py-2.5 text-right font-semibold text-cardinal">
                        {s.stat}
                      </td>
                    </tr>
                  ))}
                  {careerTotals.map((c, i) => (
                    <tr
                      key={`career-${c.category}-${c.statType}-${i}`}
                      className="row-divide bg-cream-mute/50"
                    >
                      <td className="table-cell whitespace-nowrap px-4 py-2.5 font-semibold">Career</td>
                      <td className="table-cell whitespace-nowrap px-4 py-2.5 capitalize text-ink-soft">
                        {c.category}
                      </td>
                      <td className="table-cell whitespace-nowrap px-4 py-2.5 text-ink-soft">
                        {c.statType}
                      </td>
                      <td className="table-cell whitespace-nowrap px-4 py-2.5 text-right font-semibold text-cardinal">
                        {c.stat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
