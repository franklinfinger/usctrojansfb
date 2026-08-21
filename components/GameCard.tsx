import Link from "next/link";
import { MapPin, Tv } from "lucide-react";
import { isUscHome, opponentOf } from "@/lib/cfbd";
import type { Game } from "@/lib/types";
import { formatGameDate } from "@/lib/utils";

export default function GameCard({
  game,
  tv,
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
      <article className="rounded-xl border border-ink/8 bg-cream-card p-4 shadow-sm transition hover:shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cardinal">
              Week {game.week} · {home ? "Home" : game.neutralSite ? "Neutral" : "Away"}
              {game.conferenceGame ? " · Big Ten" : ""}
            </p>
            <h3 className="mt-1 font-serif text-2xl">
              {home ? "vs" : "@"} {opponent}
            </h3>
            <p className="mt-1 text-sm text-ink/55">
              {formatGameDate(game.startDate, game.startTimeTbd)}
            </p>
            {game.venue ? (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/45">
                <MapPin size={12} /> {game.venue}
              </p>
            ) : null}
            {tv ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/70">
                <Tv size={14} /> {tv}
              </p>
            ) : null}
          </div>
          <div className="text-right">
            {played ? (
              <>
                <p className={`text-2xl font-semibold tabular-nums ${won ? "text-cardinal" : "text-ink"}`}>
                  {uscScore}-{oppScore}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                  {won ? "Win" : "Loss"}
                </p>
              </>
            ) : (
              <span className="rounded-full bg-cream-mute px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink/55">
                Upcoming
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
