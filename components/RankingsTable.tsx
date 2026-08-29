import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { findTeam, isUscSchool, teamLogo } from "@/lib/cfbd";
import type { Team } from "@/lib/types";
import type { RankRow } from "@/lib/rankings";
import { initials } from "@/lib/utils";

function MovementIndicator({ row }: { row: RankRow }) {
  if (row.previousRank == null) {
    return <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">New</span>;
  }
  const delta = row.previousRank - row.rank;
  if (delta === 0) {
    return <Minus size={14} className="text-ink-faint" aria-label="No change" />;
  }
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-ink" aria-label={`Up ${delta}`}>
        <ArrowUp size={14} />
        <span className="text-xs font-semibold tabular-nums">{delta}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-cardinal" aria-label={`Down ${-delta}`}>
      <ArrowDown size={14} />
      <span className="text-xs font-semibold tabular-nums">{-delta}</span>
    </span>
  );
}

export default function RankingsTable({ rows, teams }: { rows: RankRow[]; teams: Team[] }) {
  return (
    <div className="card-feature overflow-hidden">
      <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 border-b border-ink/8 bg-cream px-4 py-2.5 md:grid-cols-[auto_auto_auto_1fr_auto_auto]">
        <span className="table-head">Rk</span>
        <span className="table-head" />
        <span className="table-head hidden md:block">Trend</span>
        <span className="table-head">School</span>
        <span className="table-head text-right">Pts</span>
        <span className="table-head hidden text-right md:block">1st</span>
      </div>
      {rows.map((row) => {
        const isUsc = isUscSchool(row.school);
        const logo = teamLogo(findTeam(teams, row.school));
        return (
          <div
            key={row.school}
            className={`row-divide grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 px-4 py-3 md:grid-cols-[auto_auto_auto_1fr_auto_auto] ${
              isUsc ? "bg-cardinal/8" : ""
            }`}
          >
            <span className={`font-serif text-xl ${isUsc ? "text-cardinal" : "text-ink"}`}>
              {row.rank}
            </span>
            <span className="team-mark h-8 w-8 border border-ink/10 p-1">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" className="h-full w-full object-contain" />
              ) : (
                <span className="font-serif text-[10px] text-ink">{initials(row.school)}</span>
              )}
            </span>
            <span className="hidden md:block">
              <MovementIndicator row={row} />
            </span>
            <span className="min-w-0">
              <span className={`block truncate font-medium ${isUsc ? "text-cardinal" : "text-ink"}`}>
                {row.school}
              </span>
              <span className="block truncate text-xs text-ink-faint">{row.conference}</span>
              <span className="mt-0.5 md:hidden">
                <MovementIndicator row={row} />
              </span>
            </span>
            <span className="text-right text-sm font-medium tabular-nums text-ink-soft">
              {row.points}
            </span>
            <span className="hidden text-right text-sm font-medium tabular-nums text-ink-soft md:block">
              {row.firstPlaceVotes ?? "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
