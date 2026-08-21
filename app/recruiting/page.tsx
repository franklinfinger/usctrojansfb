import { getRecruits, getRecruitingTeamRank, YEAR } from "@/lib/cfbd";

export default async function RecruitingPage() {
  const classYear = YEAR + 1;
  const [rank, recruits] = await Promise.all([
    getRecruitingTeamRank().catch(() => null),
    getRecruits(classYear).catch(() => []),
  ]);

  // Also show current cycle if next class is empty
  const fallback =
    recruits.length === 0 ? await getRecruits(YEAR).catch(() => []) : [];
  const list = recruits.length ? recruits : fallback;
  const shownYear = recruits.length ? classYear : YEAR;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Recruiting</h2>
        <p className="text-sm text-white/55">Class of {shownYear}</p>
      </div>

      {rank ? (
        <section className="rounded-2xl bg-cardinal p-5">
          <p className="text-sm uppercase tracking-wide text-gold">National rank</p>
          <p className="mt-1 text-4xl font-bold">#{rank.rank}</p>
          <p className="mt-1 text-sm text-white/80">{rank.points.toFixed(2)} points · {rank.year}</p>
        </section>
      ) : null}

      <section>
        <h3 className="mb-3 text-sm uppercase tracking-wide text-white/60">
          Commits ({list.length})
        </h3>
        {list.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/55">
            Recruiting data will appear as the class fills out.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            {list.map((r, i) => (
              <div
                key={`${r.name}-${i}`}
                className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 last:border-b-0"
              >
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-sm text-white/55">
                    {r.position}
                    {r.city || r.stateProvince
                      ? ` · ${[r.city, r.stateProvince].filter(Boolean).join(", ")}`
                      : ""}
                    {r.school ? ` · ${r.school}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  {r.stars ? (
                    <p className="text-gold">{"★".repeat(Math.min(5, Math.round(r.stars)))}</p>
                  ) : null}
                  {r.rating ? (
                    <p className="text-xs text-white/50">{r.rating.toFixed(4)}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
