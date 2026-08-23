import type {
  Coach,
  Game,
  GameMedia,
  PlayerSeasonStat,
  RankingWeek,
  Recruit,
  RosterPlayer,
  Team,
  TeamRecord,
  TeamRecruitingRank,
  TeamSeasonStat,
} from "./types";

const BASE = "https://api.collegefootballdata.com";
export const TEAM = "USC";
export const YEAR = 2026;

// Cache tiers (seconds), keyed to how often each kind of CFBD data actually changes.
const CACHE = {
  /** In-progress game state and scores. */
  LIVE: 60,
  /** Roster, rankings, records, season stats. */
  DAILY: 60 * 60 * 24,
  /** Recruiting class, coaching staff, broadcast/media info. */
  WEEKLY: 60 * 60 * 24 * 7,
  /** Anything from a completed past season — effectively immutable. */
  STATIC: 60 * 60 * 24 * 30,
} as const;

// Marks empty results that came back because a request failed (e.g. rate
// limited) rather than because the query genuinely has no data. Keyed by
// object identity, not shared mutable state, so it's safe under concurrent
// requests — every empty result is its own array/object instance.
const FAILED = new WeakSet<object>();

function markFailed<T>(value: T): T {
  if (value && typeof value === "object") FAILED.add(value as object);
  return value;
}

/**
 * True if `data` — the return value of a cfbd.ts function — came back empty
 * because the CFBD API request failed (e.g. rate limited), rather than
 * because the query genuinely has no results. Pages can use this to show
 * "data temporarily unavailable" instead of a blank section.
 *
 * Covers functions that return arrays or plain objects (getGames, getRoster,
 * getRankings, etc). Functions that return a single record or `null`
 * (getGame, getRecord, getRecruitingTeamRank) don't carry this signal on
 * their `null` case, since `null` can't hold a tag.
 */
export function isApiFailure(data: unknown): boolean {
  return typeof data === "object" && data !== null && FAILED.has(data);
}

async function cfbd<T>(path: string, revalidate: number = CACHE.DAILY): Promise<T> {
  const key = process.env.CFBD_API_KEY;
  if (!key) throw new Error("Missing CFBD_API_KEY");

  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate },
  });

  if (!res.ok) {
    if (res.status === 429) {
      console.warn(`[cfbd] rate limited (429), returning empty data: ${path}`);
      return markFailed([] as T);
    }
    if (res.status === 404 || res.status === 400 || res.status === 403) {
      return [] as T;
    }
    throw new Error(`CFBD ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function getGames(): Promise<Game[]> {
  const games = await cfbd<Game[]>(`/games?year=${YEAR}&team=${TEAM}`, CACHE.LIVE);
  return games.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

export async function getGame(id: number): Promise<Game | null> {
  const games = await cfbd<Game[]>(`/games?id=${id}`, CACHE.LIVE);
  return games[0] ?? null;
}

export async function getMedia(): Promise<GameMedia[]> {
  return cfbd<GameMedia[]>(`/games/media?year=${YEAR}&team=${TEAM}`, CACHE.WEEKLY);
}

export async function getRoster(): Promise<RosterPlayer[]> {
  const roster = await cfbd<RosterPlayer[]>(`/roster?year=${YEAR}&team=${TEAM}`, CACHE.DAILY);
  return roster.sort((a, b) => {
    const pos = (a.position ?? "Z").localeCompare(b.position ?? "Z");
    if (pos !== 0) return pos;
    return (a.jersey ?? 999) - (b.jersey ?? 999);
  });
}

export async function getPlayerFromRoster(id: number): Promise<RosterPlayer | null> {
  const roster = await getRoster();
  // CFBD's /roster response has been observed returning `id` as a string
  // despite the documented/typed shape being numeric — compare as strings
  // so this doesn't silently 404 every player if that ever recurs.
  return roster.find((p) => String(p.id) === String(id)) ?? null;
}

export async function getRecord(): Promise<TeamRecord | null> {
  const records = await cfbd<TeamRecord[]>(`/records?year=${YEAR}&team=${TEAM}`, CACHE.DAILY);
  return records[0] ?? null;
}

export async function getRankings(): Promise<{ ap?: number; coaches?: number }> {
  try {
    const weeks = await cfbd<RankingWeek[]>(`/rankings?year=${YEAR}`, CACHE.DAILY);
    if (!weeks.length) return isApiFailure(weeks) ? markFailed({}) : {};
    const latest = weeks[weeks.length - 1];
    const find = (names: string[]) =>
      latest.polls.find((p) => names.some((n) => p.poll.toLowerCase().includes(n)));
    const ap = find(["ap"]);
    const coaches = find(["coaches", "usa today"]);
    const apRank = ap?.ranks.find((r) => r.school === TEAM || r.school.includes("Southern Cal"))?.rank;
    const coachesRank = coaches?.ranks.find(
      (r) => r.school === TEAM || r.school.includes("Southern Cal")
    )?.rank;
    return { ap: apRank, coaches: coachesRank };
  } catch {
    return {};
  }
}

export async function getTeamStats(): Promise<TeamSeasonStat[]> {
  return cfbd<TeamSeasonStat[]>(`/stats/season?year=${YEAR}&team=${TEAM}`, CACHE.DAILY);
}

export async function getPlayerSeasonStats(
  category?: string
): Promise<PlayerSeasonStat[]> {
  const q = category
    ? `/stats/player/season?year=${YEAR}&team=${TEAM}&category=${encodeURIComponent(category)}`
    : `/stats/player/season?year=${YEAR}&team=${TEAM}`;
  return cfbd<PlayerSeasonStat[]>(q, CACHE.DAILY);
}

export async function getRecruitingTeamRank(): Promise<TeamRecruitingRank | null> {
  const ranks = await cfbd<TeamRecruitingRank[]>(`/recruiting/teams?year=${YEAR}`, CACHE.WEEKLY);
  return ranks.find((r) => r.team === TEAM || r.team.includes("Southern Cal")) ?? null;
}

export async function getRecruits(year = YEAR + 1): Promise<Recruit[]> {
  // A class for the upcoming signing cycle is still actively gaining commits
  // (WEEKLY); a class for the current year or earlier is already signed and
  // locked, so it effectively never changes again (STATIC).
  const tier = year > YEAR ? CACHE.WEEKLY : CACHE.STATIC;
  const recruits = await cfbd<Recruit[]>(
    `/recruiting/players?year=${year}&team=${TEAM}`,
    tier
  );
  return recruits.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

export async function getCoaches(): Promise<Coach[]> {
  return cfbd<Coach[]>(`/coaches?team=${TEAM}&year=${YEAR}`, CACHE.WEEKLY);
}

// Unfiltered so any opponent (conference or non-conference) resolves, not
// just Big Ten teams.
export async function getTeams(): Promise<Team[]> {
  return cfbd<Team[]>(`/teams`, CACHE.WEEKLY);
}

export function isUscHome(game: Game) {
  return game.homeTeam === TEAM;
}

export function opponentOf(game: Game) {
  return isUscHome(game) ? game.awayTeam : game.homeTeam;
}

export function findTeam(teams: Team[], school: string): Team | null {
  return teams.find((t) => t.school === school) ?? null;
}

export function teamLogo(team: Team | null): string | null {
  return team?.logos?.[0] ?? null;
}

export function mediaForGame(media: GameMedia[], game: Game): string | null {
  const match = media.find(
    (m) =>
      m.id === game.id ||
      (m.week === game.week &&
        m.homeTeam === game.homeTeam &&
        m.awayTeam === game.awayTeam &&
        (m.mediaType === "tv" || m.mediaType === "web" || m.mediaType === "TV"))
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
