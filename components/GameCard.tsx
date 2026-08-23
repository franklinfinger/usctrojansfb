import Link from "next/link";
import { MapPin, Tv } from "lucide-react";
import { isUscHome, opponentOf } from "@/lib/cfbd";
import type { Game } from "@/lib/types";
import { formatGameDate, initials } from "@/lib/utils";

export default function GameCard({
  game,
  tv,
  logo,
}: {
  game: Game;
  tv?: string | null;
  logo?: string | null;
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
      <article className="card-feature p-4 transition hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="team-mark h-12 w-12 border-2 border-ink/10 p-2 md:h-14 md:w-14">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={`${opponent} logo`} className="h-full w-full object-contain" />
              ) : (
                <span className="font-serif text-sm text-ink">{initials(opponent)}</span>
              )}
            </div>
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
