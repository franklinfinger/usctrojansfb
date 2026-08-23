import Link from "next/link";
import { notFound } from "next/navigation";
import PlayerBadge from "@/components/PlayerBadge";
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
              <h1 className="mt-1 font-serif text-4xl leading-[0.95] md:text-5xl">
                {player.firstName} {player.lastName}
              </h1>
            </div>
          </div>
          <p className="mt-4 text-white/85">
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
        </div>
      </section>

      <section>
        <h2 className="mb-3 label-cap">2026 Stats</h2>
        {playerStats.length === 0 ? (
          <p className="empty-state">
            Season stats will appear after games are played.
          </p>
        ) : (
          <div className="card-feature overflow-hidden">
            {playerStats.map((s, i) => (
              <div
                key={`${s.category}-${s.statType}-${i}`}
                className="row-divide flex items-center justify-between px-4 py-3"
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
