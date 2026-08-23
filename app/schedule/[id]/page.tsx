import Link from "next/link";
import { notFound } from "next/navigation";
import Countdown from "@/components/Countdown";
import {
  findTeam,
  getGame,
  getMedia,
  getTeams,
  isUscHome,
  mediaForGame,
  opponentOf,
  teamLogo,
} from "@/lib/cfbd";
import { formatGameDate, initials } from "@/lib/utils";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);
  if (!Number.isFinite(gameId)) notFound();

  const [game, media, teams] = await Promise.all([
    getGame(gameId),
    getMedia(),
    getTeams().catch(() => []),
  ]);
  if (!game) notFound();

  const home = isUscHome(game);
  const opponent = opponentOf(game);
  const opponentLogo = teamLogo(findTeam(teams, opponent));
  const tv = mediaForGame(media, game);
  const uscScore = home ? game.homePoints : game.awayPoints;
  const oppScore = home ? game.awayPoints : game.homePoints;
  const played = game.completed && uscScore != null && oppScore != null;
  const won = played && (uscScore as number) > (oppScore as number);

  return (
    <div className="page-shell space-y-6">
      <Link href="/schedule" className="btn-quiet">
        ← Back to schedule
      </Link>

      <section className="card-feature overflow-hidden">
        <div className="section-dark px-6 py-8">
          <div className="flex items-start gap-4">
            <div className="team-mark h-16 w-16 border-2 border-white/30 p-2 md:h-20 md:w-20">
              {opponentLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={opponentLogo}
                  alt={`${opponent} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="font-serif text-lg text-ink">{initials(opponent)}</span>
              )}
            </div>
            <div>
              <p className="hero-eyebrow">
                Week {game.week} · {home ? "Home" : game.neutralSite ? "Neutral" : "Away"}
                {game.conferenceGame ? " · Big Ten" : ""}
              </p>
              <h1 className="mt-2 font-serif text-4xl leading-[0.95] md:text-5xl">
                {home ? "vs" : "@"} {opponent}
              </h1>
            </div>
          </div>
          <p className="mt-4 text-white/80">{formatGameDate(game.startDate, game.startTimeTbd)}</p>
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
            <p className="mb-3 label-cap">Countdown to kickoff</p>
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
    <div className="card-feature p-4">
      <p className="table-head">{label}</p>
      <p className="mt-1 font-medium capitalize text-ink">{value}</p>
    </div>
  );
}
