import type {
  Coach,
  Game,
  GameMedia,
  PlayerSeasonStat,
  RankingWeek,
  Recruit,
  RosterPlayer,
  TeamRecord,
  TeamRecruitingRank,
  TeamSeasonStat,
} from "./types";

const BASE = "https://api.collegefootballdata.com";
export const TEAM = "USC";
export const YEAR = 2026;

async function cfbd<T>(path: string, revalidate = 300): Promise<T> {
  const key = process.env.CFBD_API_KEY;
  if (!key) throw new Error("Missing CFBD_API_KEY");

  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate },
  });

  if (!res.ok) {
    // Soft-fail optional endpoints so the UI still renders
    if (res.status === 404 || res.status === 400) return [] as T;
    throw new Error(`CFBD ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function getGames(): Promise<Game[]> {
  const games = await cfbd<Game[]>(`/games?year=${YEAR}&team=${TEAM}`);
  return games.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

export async function getGame(id: number): Promise<Game | null> {
  const games = await cfbd<Game[]>(`/games?id=${id}`);
  return games[0] ?? null;
}

export async function getMedia(): Promise<GameMedia[]> {
  return cfbd<GameMedia[]>(`/games/media?year=${YEAR}&team=${TEAM}`);
}

export async function getRoster(): Promise<RosterPlayer[]> {
  const roster = await cfbd<RosterPlayer[]>(`/roster?year=${YEAR}&team=${TEAM}`);
  return roster.sort((a, b) => {
    const pos = (a.position ?? "Z").localeCompare(b.position ?? "Z");
    if (pos !== 0) return pos;
    return (a.jersey ?? 999) - (b.jersey ?? 999);
  });
}

export async function getPlayerFromRoster(id: number): Promise<RosterPlayer | null> {
  const roster = await getRoster();
  return roster.find((p) => p.id === id) ?? null;
}

export async function getRecord(): Promise<TeamRecord | null> {
  const records = await cfbd<TeamRecord[]>(`/records?year=${YEAR}&team=${TEAM}`);
  return records[0] ?? null;
}

export async function getRankings(): Promise<{ ap?: number; coaches?: number }> {
  const weeks = await cfbd<RankingWeek[]>(`/rankings?year=${YEAR}`);
  if (!weeks.length) return {};
  const latest = weeks[weeks.length - 1];
  const ap = latest.polls.find((p) => p.poll === "AP Top 25");
  const coaches = latest.polls.find(
    (p) => p.poll === "Coaches Poll" || p.poll === "USA Today Coaches Poll"
  );
  const apRank = ap?.ranks.find((r) => r.school === TEAM)?.rank;
  const coachesRank = coaches?.ranks.find((r) => r.school === TEAM)?.rank;
  return { ap: apRank, coaches: coachesRank };
}

export async function getTeamStats(): Promise<TeamSeasonStat[]> {
  return cfbd<TeamSeasonStat[]>(`/stats/season?year=${YEAR}&team=${TEAM}`);
}

export async function getPlayerSeasonStats(
  category?: string
): Promise<PlayerSeasonStat[]> {
  const q = category
    ? `/stats/player/season?year=${YEAR}&team=${TEAM}&category=${encodeURIComponent(category)}`
    : `/stats/player/season?year=${YEAR}&team=${TEAM}`;
  return cfbd<PlayerSeasonStat[]>(q);
}

export async function getRecruitingTeamRank(): Promise<TeamRecruitingRank | null> {
  const ranks = await cfbd<TeamRecruitingRank[]>(`/recruiting/teams?year=${YEAR}`);
  return ranks.find((r) => r.team === TEAM) ?? null;
}

export async function getRecruits(year = YEAR + 1): Promise<Recruit[]> {
  const recruits = await cfbd<Recruit[]>(
    `/recruiting/players?year=${year}&team=${TEAM}`
  );
  return recruits.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

export async function getCoaches(): Promise<Coach[]> {
  return cfbd<Coach[]>(`/coaches?team=${TEAM}&year=${YEAR}`);
}

export function isUscHome(game: Game) {
  return game.homeTeam === TEAM;
}

export function opponentOf(game: Game) {
  return isUscHome(game) ? game.awayTeam : game.homeTeam;
}

export function mediaForGame(media: GameMedia[], game: Game): string | null {
  const match = media.find(
    (m) =>
      m.id === game.id ||
      (m.week === game.week &&
        m.homeTeam === game.homeTeam &&
        m.awayTeam === game.awayTeam &&
        (m.mediaType === "tv" || m.mediaType === "web"))
  );
  return match?.outlet ?? null;
}

export function pickNextAndLast(games: Game[]) {
  const now = Date.now();
  const completed = games.filter((g) => g.completed);
  const upcoming = games.filter((g) => !g.completed);
  const next =
    upcoming.find((g) => new Date(g.startDate).getTime() >= now) ??
    upcoming[0] ??
    null;
  const last = completed[completed.length - 1] ?? null;
  return { next, last };
}
