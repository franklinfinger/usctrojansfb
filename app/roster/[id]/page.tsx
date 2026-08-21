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
    <div className="space-y-5">
      <Link href="/roster" className="text-sm text-gold">
        ← Roster
      </Link>

      <section className="rounded-2xl bg-cardinal p-5">
        <p className="text-sm text-gold">#{player.jersey ?? "—"} · {player.position ?? "—"}</p>
        <h1 className="mt-1 text-3xl font-bold">
          {player.firstName} {player.lastName}
        </h1>
        <p className="mt-2 text-white/85">
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
        <h2 className="mb-3 text-sm uppercase tracking-wide text-white/60">2026 Stats</h2>
        {playerStats.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/55">
            Season stats will appear after games are played.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            {playerStats.map((s, i) => (
              <div
                key={`${s.category}-${s.statType}-${i}`}
                className="flex items-center justify-between border-b border-white/10 px-4 py-3 last:border-b-0"
              >
                <span className="text-sm text-white/70">
                  {s.category} · {s.statType}
                </span>
                <span className="font-semibold">{s.stat}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
