import Link from "next/link";
import { notFound } from "next/navigation";
import Countdown from "@/components/Countdown";
import {
  getGame,
  getMedia,
  isUscHome,
  mediaForGame,
  opponentOf,
} from "@/lib/cfbd";
import { formatGameDate } from "@/lib/utils";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);
  if (!Number.isFinite(gameId)) notFound();

  const [game, media] = await Promise.all([getGame(gameId), getMedia()]);
  if (!game) notFound();

  const home = isUscHome(game);
  const opponent = opponentOf(game);
  const tv = mediaForGame(media, game);
  const uscScore = home ? game.homePoints : game.awayPoints;
  const oppScore = home ? game.awayPoints : game.homePoints;
  const played = game.completed && uscScore != null && oppScore != null;
  const won = played && (uscScore as number) > (oppScore as number);

  return (
    <div className="space-y-5">
      <Link href="/schedule" className="text-sm text-gold">
        ← Schedule
      </Link>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-wide text-gold">
          Week {game.week} · {home ? "Home" : game.neutralSite ? "Neutral" : "Away"}
          {game.conferenceGame ? " · Big Ten" : ""}
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          {home ? "vs" : "@"} {opponent}
        </h1>
        <p className="mt-2 text-white/70">
          {formatGameDate(game.startDate, game.startTimeTbd)}
        </p>
        {game.venue ? <p className="text-white/55">{game.venue}</p> : null}
        {tv ? <p className="mt-2 font-medium text-gold">TV: {tv}</p> : null}

        {played ? (
          <div className="mt-6">
            <p className={`text-4xl font-bold ${won ? "text-gold" : "text-white"}`}>
              {won ? "W" : "L"} {uscScore}-{oppScore}
            </p>
            <p className="mt-1 text-sm text-white/50">Final</p>
          </div>
        ) : !game.startTimeTbd ? (
          <div className="mt-6">
            <p className="mb-2 text-sm uppercase tracking-wide text-white/50">Countdown</p>
            <Countdown targetIso={game.startDate} />
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
        <p>Season type: {game.seasonType}</p>
        <p>Conference game: {game.conferenceGame ? "Yes" : "No"}</p>
        <p>Neutral site: {game.neutralSite ? "Yes" : "No"}</p>
      </section>
    </div>
  );
}
