import Link from "next/link";
import { getCoaches, YEAR } from "@/lib/cfbd";

export default async function TeamPage() {
  const coaches = await getCoaches().catch(() => []);

  // Prefer current school seasons
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
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Coaches</h2>
        <p className="text-sm text-white/55">USC football staff records</p>
      </div>

      {current.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/55">
          Coach data unavailable for this season yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {current.map(({ coach, season }) => (
            <div
              key={`${coach.firstName}-${coach.lastName}`}
              className="border-b border-white/10 px-4 py-4 last:border-b-0"
            >
              <p className="font-semibold">
                {coach.firstName} {coach.lastName}
              </p>
              {season ? (
                <p className="mt-1 text-sm text-white/60">
                  {season.year}: {season.wins}-{season.losses}
                  {season.ties ? `-${season.ties}` : ""} ({season.games} games)
                </p>
              ) : null}
              {coach.hireDate ? (
                <p className="text-xs text-white/40">Hired {coach.hireDate.slice(0, 10)}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <Link href="/roster" className="block text-center text-sm text-gold">
        View full roster →
      </Link>
    </div>
  );
}
