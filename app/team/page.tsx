import PageHero from "@/components/PageHero";
import StatGrid from "@/components/StatGrid";
import { TEAM, YEAR, getCoaches } from "@/lib/cfbd";
import { STAFF } from "@/lib/staff";

// The staff members presented as the featured "Coordinators" row — everyone
// else in the coaching group renders as a position coach below. Curated by
// name rather than parsed from title text, since several position coaches
// also carry a secondary "Coordinator" qualifier (e.g. Run Game Coordinator)
// without being one of the primary coordinators.
const COORDINATOR_NAMES = ["Luke Huard", "Gary Patterson", "Dennis Simmons", "Mike Ekeler"];

export default async function TeamPage() {
  const coaches = await getCoaches().catch(() => []);
  const rileyStaff = STAFF.find((s) => s.name === "Lincoln Riley");
  const rileyCoach =
    coaches.find((c) => `${c.firstName} ${c.lastName}` === "Lincoln Riley") ?? coaches[0] ?? null;

  const seasons = rileyCoach
    ? rileyCoach.seasons.filter((s) => s.school === TEAM).sort((a, b) => b.year - a.year)
    : [];
  const totals = seasons.reduce(
    (acc, s) => ({
      wins: acc.wins + s.wins,
      losses: acc.losses + s.losses,
      ties: acc.ties + s.ties,
      games: acc.games + s.games,
    }),
    { wins: 0, losses: 0, ties: 0, games: 0 }
  );
  const firstYear = seasons.length ? seasons[seasons.length - 1].year : null;
  const lastYear = seasons.length ? seasons[0].year : null;
  const tenure = firstYear && lastYear ? (firstYear === lastYear ? `${firstYear}` : `${firstYear}–${lastYear}`) : null;
  const isCurrent = lastYear === YEAR;
  const winPct = totals.games ? Math.round((totals.wins / totals.games) * 100) : null;

  const coordinators = STAFF.filter((s) => COORDINATOR_NAMES.includes(s.name));
  const positionCoaches = STAFF.filter(
    (s) => s.group === "coaching" && s.name !== "Lincoln Riley" && !COORDINATOR_NAMES.includes(s.name)
  );
  const supportStaff = STAFF.filter((s) => s.group === "support");

  return (
    <>
      <PageHero eyebrow="Staff" title="Coaches" subtitle="USC football's full 2026 coaching staff" />

      {/* Head coach — record pulled live from CFBD, never hardcoded */}
      <div className="page-shell-wide space-y-6">
        <div className="section-dark overflow-hidden rounded-2xl px-6 py-8 shadow-elevated md:px-8 md:py-10">
          <p className="hero-eyebrow">Head Coach{isCurrent ? " · Current" : ""}</p>
          <h1 className="page-hero-title">{rileyStaff?.name ?? "Lincoln Riley"}</h1>
          <p className="mt-2 text-sm text-white/75">{rileyStaff?.title ?? "Head Football Coach"}</p>
          {tenure ? (
            <p className="mt-1 text-sm text-white/60">
              {tenure} at USC
              {rileyCoach?.hireDate ? ` · Hired ${rileyCoach.hireDate.slice(0, 10)}` : ""}
            </p>
          ) : null}
        </div>

        {seasons.length === 0 ? (
          <p className="empty-state">Season record unavailable right now.</p>
        ) : (
          <>
            <StatGrid
              items={[
                { label: "USC seasons", value: String(seasons.length) },
                {
                  label: "Overall record",
                  value: `${totals.wins}-${totals.losses}${totals.ties ? `-${totals.ties}` : ""}`,
                },
                { label: "Games coached", value: String(totals.games) },
                { label: "Win pct", value: winPct != null ? `${winPct}%` : "—" },
              ]}
            />

            <div>
              <h3 className="mb-3 label-cap">Season by season</h3>
              <div className="card-feature overflow-hidden">
                {seasons.map((s) => (
                  <div key={s.year} className="row-divide flex items-center justify-between px-4 py-3">
                    <span className="table-cell">{s.year}</span>
                    <span className="text-sm text-ink-soft">
                      {s.wins}-{s.losses}
                      {s.ties ? `-${s.ties}` : ""} · {s.games} games
                      {s.postseasonRank ? ` · Final #${s.postseasonRank}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Coordinators — dark featured row */}
      <section className="section-dark mt-10 md:mt-14">
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <p className="hero-eyebrow">Coordinators</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {coordinators.map((c) => (
              <div key={c.name} className="border-t border-white/15 pt-4">
                <p className="font-serif text-2xl text-white">{c.name}</p>
                <p className="mt-1 text-sm text-white/70">{c.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Position coaches + support staff — cream */}
      <div className="page-shell-wide space-y-10">
        <section>
          <h3 className="mb-3 label-cap">Position coaches</h3>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {positionCoaches.map((c) => (
              <div key={c.name} className="card-feature p-4">
                <p className="font-serif text-lg text-ink">{c.name}</p>
                <p className="mt-1 text-xs text-ink-soft">{c.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 label-cap">Support staff</h3>
          <div className="card-feature overflow-hidden">
            {supportStaff.map((c) => (
              <div key={c.name} className="row-divide flex items-center justify-between gap-4 px-4 py-3">
                <span className="font-medium text-ink">{c.name}</span>
                <span className="text-right text-sm text-ink-soft">{c.title}</span>
              </div>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-ink-faint">
          Staff data current as of the 2026 season · Source: USC Athletics
        </p>
      </div>
    </>
  );
}
