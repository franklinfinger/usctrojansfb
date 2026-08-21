import Link from "next/link";
import { MapPin, Tv } from "lucide-react";
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
      <article className="glass-strong relative overflow-hidden rounded-2xl bg-card-shine p-4 transition active:scale-[0.99]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="chip-gold">Week {game.week}</span>
              <span className="chip">{home ? "Home" : game.neutralSite ? "Neutral" : "Away"}</span>
              {game.conferenceGame ? <span className="chip">Big Ten</span> : null}
            </div>
            <h3 className={`${compact ? "text-lg" : "text-xl"} mt-2.5 truncate font-semibold tracking-tight`}>
              <span className="text-white/50">{home ? "vs" : "@"}</span> {opponent}
            </h3>
            <p className="mt-1 text-sm text-white/55">
              {formatGameDate(game.startDate, game.startTimeTbd)}
            </p>
            {game.venue ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/40">
                <MapPin size={12} /> {game.venue}
              </p>
            ) : null}
            {tv ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-gold">
                <Tv size={14} /> {tv}
              </p>
            ) : null}
          </div>

          <div className="shrink-0 text-right">
            {played ? (
              <div>
                <p className={`text-2xl font-bold tabular-nums ${won ? "text-gold" : "text-white"}`}>
                  {uscScore}-{oppScore}
                </p>
                <p className={`mt-0.5 text-xs font-semibold ${won ? "text-gold" : "text-white/50"}`}>
                  {won ? "WIN" : "LOSS"}
                </p>
              </div>
            ) : (
              <span className="chip">Upcoming</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
