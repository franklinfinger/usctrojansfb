import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayerFromRoster, getPlayerSeasonStats } from "@/lib/cfbd";
import { classYear, formatHeight } from "@/lib/utils";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playerId = Number(id);
  if (!Number.isFinite(playerId)) notFound();

  const player = await getPlayerFromRoster(playerId);
  if (!player) notFound();

  const stats = await getPlayerSeasonStats().catch(() => []);
  const playerStats = stats.filter(
    (s) =>
      s.playerId === playerId ||
      s.player === `${player.firstName} ${player.lastName}`
  );

  return (
    <div className="page-shell space-y-6">
      <Link href="/roster" className="text-sm font-semibold text-cardinal">
        ← Roster
      </Link>

      <section className="overflow-hidden rounded-xl bg-cardinal px-6 py-8 text-white shadow-lift">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-bright">
          #{player.jersey ?? "—"} · {player.position ?? "—"}
        </p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">
          {player.firstName} {player.lastName}
        </h1>
        <p className="mt-3 text-white/85">
          {[classYear(player.year), formatHeight(player.height), player.weight ? `${player.weight} lbs` : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {player.hometown ? (
          <p className="mt-1 text-sm text-white/70">
            {player.hometown}
            {player.homeState ? `, ${player.homeState}` : ""}
          </p>
        ) : null}
      </section>

      <section>
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          2026 Stats
        </h2>
        {playerStats.length === 0 ? (
          <p className="empty-state">
            Season stats will appear after games are played.
          </p>
        ) : (
          <div className="card overflow-hidden">
            {playerStats.map((s, i) => (
              <div
                key={`${s.category}-${s.statType}-${i}`}
                className="flex items-center justify-between border-b border-ink/6 px-4 py-3 last:border-b-0"
              >
                <span className="text-sm text-ink-soft">
                  {s.category} · {s.statType}
                </span>
                <span className="font-semibold text-cardinal">{s.stat}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
