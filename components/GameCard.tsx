import { isUscHome, opponentOf } from "@/lib/cfbd";
import type { Game } from "@/lib/types";

function formatDate(iso: string, tbd: boolean) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
  if (tbd) return `${date} · TBD`;
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  });
  return `${date} · ${time} PT`;
}

export default function GameCard({ game }: { game: Game }) {
  const home = isUscHome(game);
  const opponent = opponentOf(game);
  const uscScore = home ? game.homePoints : game.awayPoints;
  const oppScore = home ? game.awayPoints : game.homePoints;
  const played = game.completed && uscScore != null && oppScore != null;
  const won = played && uscScore > oppScore;

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-wide text-gold">
        Week {game.week} · {home ? "Home" : "Away"}
      </p>
      <h3 className="mt-1 text-xl font-semibold">
        {home ? "vs" : "@"} {opponent}
      </h3>
      <p className="mt-1 text-sm text-white/70">{formatDate(game.startDate, game.startTimeTbd)}</p>
      {game.venue ? <p className="text-sm text-white/50">{game.venue}</p> : null}
      {played ? (
        <p className={`mt-3 text-lg font-semibold ${won ? "text-gold" : "text-white"}`}>
          {won ? "W" : "L"} {uscScore}-{oppScore}
        </p>
      ) : (
        <p className="mt-3 text-sm text-white/60">Upcoming</p>
      )}
    </article>
  );
}
