import type {
  BettingLine,
  Coach,
  Game,
  GameLines,
  GameMedia,
  HeadToHead,
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

// `fallback` defaults to an empty array, which covers every list-returning
// endpoint without callers needing to pass anything. Endpoints that return a
// single object (e.g. /teams/matchup) must pass an object-shaped fallback —
// an empty array cast to that type would satisfy the compiler but be wrong
// at runtime (e.g. `.games` on `[]` is undefined, not an empty array).
async function cfbd<T>(path: string, revalidate: number = CACHE.DAILY, fallback: T = [] as T): Promise<T> {
  const key = process.env.CFBD_API_KEY;
  if (!key) throw new Error("Missing CFBD_API_KEY");

  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate },
  });

  if (!res.ok) {
    if (res.status === 429) {
      console.warn(`[cfbd] rate limited (429), returning empty data: ${path}`);
      return markFailed(fallback);
    }
    if (res.status === 404 || res.status === 400 || res.status === 403) {
      return fallback;
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
    const apRank = ap?.ranks.find((r) => isUscSchool(r.school))?.rank;
    const coachesRank = coaches?.ranks.find((r) => isUscSchool(r.school))?.rank;
    return { ap: apRank, coaches: coachesRank };
  } catch {
    return {};
  }
}

// Every ranking week published this season, in CFBD's natural (ascending
// week) order. Unlike getRankings() above — which only pulls out USC's
// AP/Coaches numbers for the home page stat cards — this is the raw feed a
// full rankings page needs: every poll, every school, for the latest week
// and whatever week came before it (for week-over-week movement).
export async function getAllRankings(): Promise<RankingWeek[]> {
  return cfbd<RankingWeek[]>(`/rankings?year=${YEAR}`, CACHE.DAILY);
}

// Full standings for one conference, one row per team. CFBD's /records
// `conference` filter wants the conference's short abbreviation, not its
// display name — "Big Ten" itself returns zero rows; USC's is "B1G"
// (confirmed against /conferences). Used for the conference standings page.
export async function getConferenceStandings(conference: string): Promise<TeamRecord[]> {
  return cfbd<TeamRecord[]>(
    `/records?year=${YEAR}&conference=${encodeURIComponent(conference)}`,
    CACHE.DAILY
  );
}

export async function getTeamStats(): Promise<TeamSeasonStat[]> {
  return cfbd<TeamSeasonStat[]>(`/stats/season?year=${YEAR}&team=${TEAM}`, CACHE.DAILY);
}

export async function getPlayerSeasonStats(
  category?: string,
  year: number = YEAR
): Promise<PlayerSeasonStat[]> {
  // The current season's stats update as games are played (DAILY); a past
  // season is final and never changes again (STATIC).
  const tier = year === YEAR ? CACHE.DAILY : CACHE.STATIC;
  const q = category
    ? `/stats/player/season?year=${year}&team=${TEAM}&category=${encodeURIComponent(category)}`
    : `/stats/player/season?year=${year}&team=${TEAM}`;
  const rows = await cfbd<PlayerSeasonStat[]>(q, tier);
  // CFBD has been observed returning `stat` as a string despite the typed
  // shape being numeric (same quirk as the roster `id` field) — coerce here
  // so every caller gets a real number, rather than risk `+=` silently
  // concatenating instead of adding when a consumer aggregates it.
  return rows.map((r) => ({ ...r, stat: Number(r.stat) }));
}

// Fetches the last 5 seasons of stats and returns every row belonging to
// this player (matched by id, falling back to full-name match since CFBD's
// id typing has been unreliable across endpoints — see getPlayerFromRoster).
export async function getPlayerCareerStats(
  playerId: number,
  playerName: string
): Promise<PlayerSeasonStat[]> {
  const years = Array.from({ length: 5 }, (_, i) => YEAR - i);
  const seasons = await Promise.all(years.map((year) => getPlayerSeasonStats(undefined, year)));
  return seasons
    .flat()
    .filter((s) => String(s.playerId) === String(playerId) || s.player === playerName)
    .sort((a, b) => b.season - a.season);
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

// Fetches multiple recruiting classes and combines them into one list — used
// to look up a roster player's high school, since CFBD's /roster has no such
// field. A past class is signed and locked (STATIC); the current class can
// still be actively updated (WEEKLY).
export async function getRecruitsForClasses(years: number[]): Promise<Recruit[]> {
  const lists = await Promise.all(
    years.map((year) => {
      const tier = year < YEAR ? CACHE.STATIC : CACHE.WEEKLY;
      return cfbd<Recruit[]>(`/recruiting/players?year=${year}&team=${TEAM}`, tier);
    })
  );
  return lists.flat();
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents (José -> jose)
    .replace(/[^a-z0-9\s]/g, " ") // strip punctuation (periods, apostrophes, hyphens)
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, "") // strip generational suffixes
    .replace(/\s+/g, " ")
    .trim();
}

// Many roster players won't match — transfers, walk-ons, and juco players
// were never in a USC recruiting class. That's expected; callers should
// treat a null result as "no high school on file," not an error.
export function findRecruitForPlayer(
  recruits: Recruit[],
  firstName: string,
  lastName: string
): Recruit | null {
  const target = normalizeName(`${firstName} ${lastName}`);
  return recruits.find((r) => normalizeName(r.name) === target) ?? null;
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

// USC's poll rows have been observed using "Southern Cal" instead of "USC"
// in some CFBD poll data — this covers both spellings anywhere a caller
// needs to identify USC's row. The /records endpoint's `team` field doesn't
// have this ambiguity (it's reliably "USC" there), so conference standings
// don't need this — only polls do.
export function isUscSchool(school: string): boolean {
  return school === TEAM || school.includes("Southern Cal");
}

export function findTeam(teams: Team[], school: string): Team | null {
  return teams.find((t) => t.school === school) ?? null;
}

export function teamLogo(team: Team | null): string | null {
  return team?.logos?.[0] ?? null;
}

// Betting lines for a whole season, grouped per game (mirrors getMedia() +
// mediaForGame()). A past season's lines never change (STATIC); the current
// season's board can move right up to kickoff (LIVE).
export async function getLines(year: number, team: string): Promise<GameLines[]> {
  const tier = year < YEAR ? CACHE.STATIC : CACHE.LIVE;
  return cfbd<GameLines[]>(`/lines?year=${year}&team=${encodeURIComponent(team)}`, tier);
}

export function linesForGame(lines: GameLines[], game: Game): BettingLine[] {
  return lines.find((l) => l.id === game.id)?.lines ?? [];
}

// All-time record and game log between two teams. Fixed history, so STATIC.
export async function getHeadToHead(team1: string, team2: string): Promise<HeadToHead> {
  return cfbd<HeadToHead>(
    `/teams/matchup?team1=${encodeURIComponent(team1)}&team2=${encodeURIComponent(team2)}`,
    CACHE.STATIC,
    { team1Wins: 0, team2Wins: 0, ties: 0, games: [] }
  );
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
