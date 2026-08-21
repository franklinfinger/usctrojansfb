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
    <div className="page-shell space-y-6">
      <Link href="/schedule" className="text-sm font-semibold text-cardinal">
        ← Back to schedule
      </Link>

      <section className="card overflow-hidden">
        <div className="bg-cardinal px-6 py-8 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-bright">
            Week {game.week} · {home ? "Home" : game.neutralSite ? "Neutral" : "Away"}
            {game.conferenceGame ? " · Big Ten" : ""}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">
            {home ? "vs" : "@"} {opponent}
          </h1>
          <p className="mt-3 text-white/80">{formatGameDate(game.startDate, game.startTimeTbd)}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/70">
            {game.venue ? <span>{game.venue}</span> : null}
            {tv ? <span>· TV: {tv}</span> : null}
          </div>

          {played ? (
            <div className="mt-8">
              <p className="font-serif text-5xl">
                {won ? "W" : "L"} {uscScore}-{oppScore}
              </p>
              <p className="mt-1 text-sm text-white/60">Final</p>
            </div>
          ) : null}
        </div>

        {!played && !game.startTimeTbd ? (
          <div className="border-t border-ink/8 px-6 py-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              Countdown to kickoff
            </p>
            <Countdown targetIso={game.startDate} />
          </div>
        ) : null}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Meta label="Season type" value={game.seasonType} />
        <Meta label="Conference game" value={game.conferenceGame ? "Yes" : "No"} />
        <Meta label="Neutral site" value={game.neutralSite ? "Yes" : "No"} />
      </section>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <p className="mt-1 font-medium capitalize text-ink">{value}</p>
    </div>
  );
}
