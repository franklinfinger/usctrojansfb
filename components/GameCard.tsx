import Link from "next/link";
import { isUscHome, opponentOf } from "@/lib/cfbd";
import type { Game } from "@/lib/types";
import { formatGameDate } from "@/lib/utils";

export default function GameCard({
  game,
  tv,
  compact = false,
}: {
  game: Game;
  tv?: string | null;
  compact?: boolean;
}) {
  const home = isUscHome(game);
  const opponent = opponentOf(game);
  const uscScore = home ? game.homePoints : game.awayPoints;
  const oppScore = home ? game.awayPoints : game.homePoints;
  const played = game.completed && uscScore != null && oppScore != null;
  const won = played && (uscScore as number) > (oppScore as number);

  return (
    <Link href={`/schedule/${game.id}`} className="block">
      <article className="rounded-2xl border border-white/10 bg-white/5 p-4 transition active:bg-white/10">
        <p className="text-xs uppercase tracking-wide text-gold">
          Week {game.week} · {home ? "Home" : game.neutralSite ? "Neutral" : "Away"}
          {game.conferenceGame ? " · Big Ten" : ""}
        </p>
        <h3 className={`${compact ? "text-lg" : "text-xl"} mt-1 font-semibold`}>
          {home ? "vs" : "@"} {opponent}
        </h3>
        <p className="mt-1 text-sm text-white/70">
          {formatGameDate(game.startDate, game.startTimeTbd)}
        </p>
        {game.venue ? <p className="text-sm text-white/50">{game.venue}</p> : null}
        {tv ? <p className="mt-1 text-sm text-gold">{tv}</p> : null}
        {played ? (
          <p className={`mt-3 text-lg font-semibold ${won ? "text-gold" : "text-white"}`}>
            {won ? "W" : "L"} {uscScore}-{oppScore}
          </p>
        ) : (
          <p className="mt-3 text-sm text-white/60">Upcoming</p>
        )}
      </article>
    </Link>
  );
}
