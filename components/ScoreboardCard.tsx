import { Tv } from "lucide-react";
import { quarterLabel, type ScoreboardGame, type ScoreboardTeam } from "@/lib/espn";
import { formatGameDate } from "@/lib/utils";

function TeamRow({ team, rank }: { team: ScoreboardTeam; rank: number | null }) {
  const isUsc = team.abbreviation === "USC";
  return (
    <div className="flex items-center gap-3">
      <div className="team-mark h-9 w-9 border border-ink/10 p-1.5">
        {team.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={team.logo} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="font-serif text-[10px] text-ink">{team.abbreviation}</span>
        )}
      </div>
      <span className="flex min-w-0 items-center gap-1.5">
        {rank != null ? (
          <span className="shrink-0 rounded bg-cardinal/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-cardinal">
            #{rank}
          </span>
        ) : null}
        <span className={`truncate text-sm font-medium ${isUsc ? "text-cardinal" : "text-ink"}`}>
          {team.school}
        </span>
      </span>
      {team.score != null ? (
        <span className={`ml-auto text-lg font-semibold tabular-nums ${isUsc ? "text-cardinal" : "text-ink"}`}>
          {team.score}
        </span>
      ) : null}
    </div>
  );
}

export default function ScoreboardCard({
  game,
  ranks,
}: {
  game: ScoreboardGame;
  ranks: Map<string, number>;
}) {
  const isUsc = game.home.abbreviation === "USC" || game.away.abbreviation === "USC";
  const rankOf = (team: ScoreboardTeam) => ranks.get(team.school.toLowerCase().trim()) ?? null;
  const eyebrow = game.state === "in" ? "Live" : game.state === "post" ? game.statusDetail || "Final" : "Upcoming";
  const meta =
    game.state === "in"
      ? `${quarterLabel(game.period)} · ${game.clock}`
      : formatGameDate(game.startDate, false);

  return (
    <article className={`card-feature p-4 ${isUsc ? "border-cardinal/25 bg-cardinal/5" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cardinal">
          {game.state === "in" ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cardinal" /> : null}
          {eyebrow}
        </p>
        <p className="text-xs font-medium text-ink/55">{meta}</p>
      </div>
      <div className="mt-3 space-y-2">
        <TeamRow team={game.away} rank={rankOf(game.away)} />
        <TeamRow team={game.home} rank={rankOf(game.home)} />
      </div>
      {game.state === "pre" && game.broadcast ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-ink/70">
          <Tv size={14} /> {game.broadcast}
        </p>
      ) : null}
    </article>
  );
}
