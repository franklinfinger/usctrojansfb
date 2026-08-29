import PageHero from "@/components/PageHero";
import { TEAM, findTeam, getConferenceStandings, getTeams, teamLogo } from "@/lib/cfbd";
import type { TeamRecord } from "@/lib/types";
import { initials } from "@/lib/utils";

// The Big Ten has had no divisions since realignment brought it to 18 teams
// for the 2024 season (USC, UCLA, Washington, and Oregon joining) — one
// 18-team table, sorted by conference record, with the top 2 teams meeting
// in the Big Ten Championship Game. Don't reintroduce a division split here.
function winPct(r: { wins: number; losses: number; ties: number }) {
  const decisions = r.wins + r.losses + r.ties;
  return decisions ? (r.wins + r.ties * 0.5) / decisions : 0;
}

function record(r: { wins: number; losses: number; ties: number }) {
  return r.ties ? `${r.wins}-${r.losses}-${r.ties}` : `${r.wins}-${r.losses}`;
}

export default async function ConferencePage() {
  const [records, teams] = await Promise.all([
    getConferenceStandings("B1G").catch(() => []),
    getTeams().catch(() => []),
  ]);

  const standings = records
    .slice()
    .sort((a: TeamRecord, b: TeamRecord) => {
      const pctDiff = winPct(b.conferenceGames) - winPct(a.conferenceGames);
      if (pctDiff !== 0) return pctDiff;
      const winsDiff = b.conferenceGames.wins - a.conferenceGames.wins;
      if (winsDiff !== 0) return winsDiff;
      return winPct(b.total) - winPct(a.total);
    });

  return (
    <>
      <PageHero
        eyebrow="Standings"
        title="Big Ten"
        subtitle="One 18-team table, sorted by conference record · top 2 meet in the Big Ten Championship"
      />
      <div className="page-shell-wide">
        {standings.length === 0 ? (
          <p className="empty-state">Standings unavailable right now.</p>
        ) : (
          <div className="card-feature overflow-hidden">
            <div className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-3 border-b border-ink/8 bg-cream px-4 py-2.5">
              <span className="table-head">Rk</span>
              <span className="table-head" />
              <span className="table-head">Team</span>
              <span className="table-head text-right">B1G</span>
              <span className="table-head text-right">Overall</span>
            </div>
            {standings.map((team, i) => {
              const rank = i + 1;
              const isUsc = team.team === TEAM;
              const logo = teamLogo(findTeam(teams, team.team));
              return (
                <div key={team.team}>
                  <div
                    className={`row-divide grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-3 px-4 py-3 ${
                      isUsc ? "bg-cardinal/8" : ""
                    }`}
                  >
                    <span className={`font-serif text-xl ${isUsc ? "text-cardinal" : "text-ink"}`}>
                      {rank}
                    </span>
                    <span className="team-mark h-8 w-8 border border-ink/10 p-1">
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logo} alt="" className="h-full w-full object-contain" />
                      ) : (
                        <span className="font-serif text-[10px] text-ink">{initials(team.team)}</span>
                      )}
                    </span>
                    <span className={`truncate font-medium ${isUsc ? "text-cardinal" : "text-ink"}`}>
                      {team.team}
                    </span>
                    <span className="text-right text-sm font-medium tabular-nums text-ink-soft">
                      {record(team.conferenceGames)}
                    </span>
                    <span className="text-right text-sm font-medium tabular-nums text-ink-soft">
                      {record(team.total)}
                    </span>
                  </div>
                  {rank === 2 ? (
                    <div className="border-b-2 border-cardinal/40 px-4 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-cardinal">
                      Big Ten Championship line
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
