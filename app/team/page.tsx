import Link from "next/link";
import { getCoaches, YEAR } from "@/lib/cfbd";

export default async function TeamPage() {
  const coaches = await getCoaches().catch(() => []);

  const current = coaches
    .map((c) => {
      const season = c.seasons.find((s) => s.school === "USC" && s.year === YEAR);
      const latestUsc = c.seasons
        .filter((s) => s.school === "USC")
        .sort((a, b) => b.year - a.year)[0];
      return { coach: c, season: season ?? latestUsc };
    })
    .filter((x) => x.season)
    .sort((a, b) => (b.season?.year ?? 0) - (a.season?.year ?? 0));

  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="eyebrow">Staff</p>
        <h1 className="page-title">Coaches</h1>
        <p className="page-sub">USC football records by season</p>
      </div>

      {current.length === 0 ? (
        <p className="empty-state">Coach data unavailable for this season yet.</p>
      ) : (
        <div className="card overflow-hidden">
          {current.map(({ coach, season }) => (
            <div
              key={`${coach.firstName}-${coach.lastName}`}
              className="border-b border-ink/6 px-5 py-4 last:border-b-0"
            >
              <p className="text-lg font-semibold text-ink">
                {coach.firstName} {coach.lastName}
              </p>
              {season ? (
                <p className="mt-1 text-sm text-ink-soft">
                  {season.year}: {season.wins}-{season.losses}
                  {season.ties ? `-${season.ties}` : ""} · {season.games} games
                </p>
              ) : null}
              {coach.hireDate ? (
                <p className="mt-0.5 text-xs text-ink-faint">
                  Hired {coach.hireDate.slice(0, 10)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <Link href="/roster" className="inline-block text-sm font-semibold text-cardinal">
        View full roster →
      </Link>
    </div>
  );
}
