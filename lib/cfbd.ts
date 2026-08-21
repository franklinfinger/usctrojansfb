import type { Game, RosterPlayer, TeamRecord } from "./types";

const BASE = "https://api.collegefootballdata.com";
const TEAM = "USC";
const YEAR = 2026;

async function cfbd<T>(path: string): Promise<T> {
  const key = process.env.CFBD_API_KEY;
  if (!key) {
    throw new Error("Missing CFBD_API_KEY");
  }

  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
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

export async function getRoster(): Promise<RosterPlayer[]> {
  const roster = await cfbd<RosterPlayer[]>(`/roster?year=${YEAR}&team=${TEAM}`);
  return roster.sort((a, b) => {
    const pos = (a.position ?? "Z").localeCompare(b.position ?? "Z");
    if (pos !== 0) return pos;
    return (a.jersey ?? 999) - (b.jersey ?? 999);
  });
}

export async function getRecord(): Promise<TeamRecord | null> {
  const records = await cfbd<TeamRecord[]>(`/records?year=${YEAR}&team=${TEAM}`);
  return records[0] ?? null;
}

export function isUscHome(game: Game) {
  return game.homeTeam === TEAM;
}

export function opponentOf(game: Game) {
  return isUscHome(game) ? game.awayTeam : game.homeTeam;
}
