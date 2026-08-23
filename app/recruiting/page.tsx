import PageHero from "@/components/PageHero";
import { getRecruits, getRecruitingTeamRank, YEAR } from "@/lib/cfbd";

export default async function RecruitingPage() {
  const classYear = YEAR + 1;
  const [rank, recruits] = await Promise.all([
    getRecruitingTeamRank().catch(() => null),
    getRecruits(classYear).catch(() => []),
  ]);

  const fallback =
    recruits.length === 0 ? await getRecruits(YEAR).catch(() => []) : [];
  const list = recruits.length ? recruits : fallback;
  const shownYear = recruits.length ? classYear : YEAR;

  return (
    <>
      <PageHero eyebrow="Future Trojans" title="Recruiting" subtitle={`Class of ${shownYear}`} />
      <div className="page-shell-wide space-y-6">
        {rank ? (
          <section className="section-dark overflow-hidden rounded-2xl px-6 py-7 shadow-elevated">
            <p className="hero-eyebrow">National rank</p>
            <div className="mt-2 flex flex-wrap items-end gap-4">
              <p className="font-serif text-6xl leading-none">#{rank.rank}</p>
              <p className="pb-1 text-sm text-white/75">
                {rank.points.toFixed(2)} points · {rank.year} class
              </p>
            </div>
          </section>
        ) : null}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="label-cap">Commits ({list.length})</h3>
          </div>

          {list.length === 0 ? (
            <p className="empty-state">Recruiting data will appear as the class fills out.</p>
          ) : (
            <div className="card-feature overflow-hidden">
              {list.map((r, i) => (
                <div
                  key={`${r.name}-${i}`}
                  className="row-divide flex items-start justify-between gap-4 px-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{r.name}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {r.position}
                      {r.city || r.stateProvince
                        ? ` · ${[r.city, r.stateProvince].filter(Boolean).join(", ")}`
                        : ""}
                      {r.school ? ` · ${r.school}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {r.stars ? (
                      <p className="text-sm tracking-tight text-gold-ink">
                        {"★".repeat(Math.min(5, Math.round(r.stars)))}
                      </p>
                    ) : null}
                    {r.rating ? (
                      <p className="text-xs text-ink-faint">{r.rating.toFixed(4)}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
