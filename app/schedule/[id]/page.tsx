import Link from "next/link";
import { notFound } from "next/navigation";
import Countdown from "@/components/Countdown";
import StatGrid from "@/components/StatGrid";
import {
  TEAM,
  findTeam,
  getGame,
  getHeadToHead,
  getLines,
  getMedia,
  getTeams,
  getVenues,
  isUscHome,
  linesForGame,
  mediaForGame,
  opponentOf,
  teamLogo,
} from "@/lib/cfbd";
import { formatGameDate, initials } from "@/lib/utils";
import { formatWeather, weatherForGame } from "@/lib/weather";

function shortMeetingDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);
  if (!Number.isFinite(gameId)) notFound();

  const [game, media, teams, venues] = await Promise.all([
    getGame(gameId),
    getMedia(),
    getTeams().catch(() => []),
    getVenues().catch(() => []),
  ]);
  if (!game) notFound();

  const home = isUscHome(game);
  const opponent = opponentOf(game);
  const opponentLogo = teamLogo(findTeam(teams, opponent));
  const tv = mediaForGame(media, game);
  const weather = await weatherForGame(game, venues);
  const uscScore = home ? game.homePoints : game.awayPoints;
  const oppScore = home ? game.awayPoints : game.homePoints;
  const played = game.completed && uscScore != null && oppScore != null;
  const won = played && (uscScore as number) > (oppScore as number);

  const [lines, headToHead] = await Promise.all([
    getLines(game.season, TEAM).catch(() => []),
    getHeadToHead(TEAM, opponent).catch(() => ({ team1Wins: 0, team2Wins: 0, ties: 0, games: [] })),
  ]);
  const gameLine = linesForGame(lines, game)[0] ?? null;
  const uscSeriesWins = headToHead.team1Wins;
  const oppSeriesWins = headToHead.team2Wins;
  const seriesLabel =
    uscSeriesWins === oppSeriesWins
      ? `Series tied ${uscSeriesWins}-${oppSeriesWins}${headToHead.ties ? `-${headToHead.ties}` : ""}`
      : uscSeriesWins > oppSeriesWins
        ? `USC leads ${uscSeriesWins}-${oppSeriesWins}${headToHead.ties ? `-${headToHead.ties}` : ""}`
        : `${opponent} leads ${oppSeriesWins}-${uscSeriesWins}${headToHead.ties ? `-${headToHead.ties}` : ""}`;
  const lastFiveMeetings = [...headToHead.games].sort((a, b) => b.season - a.season).slice(0, 5);

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
            {weather ? <span>· {formatWeather(weather)}</span> : null}
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

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="label-cap">Betting Lines</h2>
          {gameLine ? <span className="text-xs text-ink-faint">via {gameLine.provider}</span> : null}
        </div>
        {gameLine ? (
          <StatGrid
            items={[
              {
                label: "Spread",
                value: gameLine.formattedSpread ?? (gameLine.spread != null ? String(gameLine.spread) : "—"),
              },
              {
                label: "Over/Under",
                value: gameLine.overUnder != null ? String(gameLine.overUnder) : "—",
              },
            ]}
          />
        ) : (
          <p className="empty-state">Lines not yet posted.</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 label-cap">Series History</h2>
        {headToHead.games.length === 0 ? (
          <p className="empty-state">No previous meetings on record.</p>
        ) : (
          <div className="space-y-4">
            <div className="card-feature p-5">
              <p className="table-head">All-time series</p>
              <p className="stat-figure">
                {uscSeriesWins}-{oppSeriesWins}
                {headToHead.ties ? `-${headToHead.ties}` : ""}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{seriesLabel}</p>
            </div>

            <div>
              <h3 className="mb-3 label-cap">Last 5 meetings</h3>
              <div className="card-feature overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink/10">
                        <th className="table-head px-4 py-3 text-left">Date</th>
                        <th className="table-head px-4 py-3 text-left">Result</th>
                        <th className="table-head px-4 py-3 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastFiveMeetings.map((g) => {
                        const uscHome = g.homeTeam === TEAM;
                        const uscPts = uscHome ? g.homeScore : g.awayScore;
                        const oppPts = uscHome ? g.awayScore : g.homeScore;
                        const result = g.winner === TEAM ? "W" : g.winner ? "L" : "T";
                        return (
                          <tr key={`${g.season}-${g.week}`} className="row-divide">
                            <td className="table-cell whitespace-nowrap px-4 py-2.5">
                              {shortMeetingDate(g.date)}
                            </td>
                            <td
                              className={`table-cell whitespace-nowrap px-4 py-2.5 font-semibold ${
                                result === "W" ? "text-cardinal" : "text-ink-soft"
                              }`}
                            >
                              {result}
                            </td>
                            <td className="table-cell whitespace-nowrap px-4 py-2.5 text-right">
                              {uscPts}-{oppPts}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
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
