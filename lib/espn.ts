// ESPN's public scoreboard is unofficial and undocumented — no API key, no
// SLA, no versioned contract. Every field read here is inferred from the
// live response rather than a spec, so parsing stays defensive (optional
// chaining, `?? null` everywhere) and any failure degrades to an empty list
// rather than throwing, mirroring cfbd()'s fallback contract in lib/cfbd.ts.
import type { Game } from "./types";

const ESPN_SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard";

// Matches CACHE.LIVE in lib/cfbd.ts — in-progress score data goes stale fast.
const LIVE_REVALIDATE = 60;

export type ScoreboardTeam = {
  school: string;
  abbreviation: string;
  logo: string | null;
  score: number | null;
};

export type ScoreboardGame = {
  id: string;
  state: "pre" | "in" | "post";
  statusDetail: string;
  period: number;
  clock: string;
  startDate: string;
  broadcast: string | null;
  home: ScoreboardTeam;
  away: ScoreboardTeam;
};

type EspnTeam = {
  location: string;
  abbreviation: string;
  logo?: string;
};

type EspnCompetitor = {
  homeAway: "home" | "away";
  score?: string;
  team: EspnTeam;
};

type EspnStatus = {
  period: number;
  displayClock: string;
  type: {
    state: "pre" | "in" | "post";
    detail: string;
    shortDetail: string;
  };
};

type EspnCompetition = {
  status: EspnStatus;
  competitors: EspnCompetitor[];
  broadcasts?: { names?: string[] }[];
};

type EspnEvent = {
  id: string;
  date: string;
  competitions?: EspnCompetition[];
};

function toTeam(c: EspnCompetitor | undefined): ScoreboardTeam {
  return {
    school: c?.team.location ?? "TBD",
    abbreviation: c?.team.abbreviation ?? "",
    logo: c?.team.logo ?? null,
    score: c?.score != null ? Number(c.score) : null,
  };
}

export async function getScoreboard(): Promise<ScoreboardGame[]> {
  try {
    const res = await fetch(ESPN_SCOREBOARD_URL, { next: { revalidate: LIVE_REVALIDATE } });
    if (!res.ok) {
      console.warn(`[espn] scoreboard request failed: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { events?: EspnEvent[] };
    return (data.events ?? []).flatMap((event): ScoreboardGame[] => {
      const comp = event.competitions?.[0];
      if (!comp) return [];
      const home = comp.competitors.find((c) => c.homeAway === "home");
      const away = comp.competitors.find((c) => c.homeAway === "away");
      return [
        {
          id: event.id,
          state: comp.status.type.state,
          statusDetail: comp.status.type.shortDetail,
          period: comp.status.period,
          clock: comp.status.displayClock,
          startDate: event.date,
          broadcast: comp.broadcasts?.[0]?.names?.[0] ?? null,
          home: toTeam(home),
          away: toTeam(away),
        },
      ];
    });
  } catch (err) {
    console.warn("[espn] scoreboard fetch threw", err);
    return [];
  }
}

export function quarterLabel(period: number): string {
  if (period >= 1 && period <= 4) return ["1st", "2nd", "3rd", "4th"][period - 1];
  if (period === 5) return "OT";
  return period > 5 ? `${period - 4}OT` : "";
}

// ---------------------------------------------------------------------------
// Per-game live/final state for the game hub page. CFBD's game data has no
// ESPN event id, so getLiveGameData() first finds one by matching team names
// against that week's ESPN scoreboard, then fetches ESPN's summary endpoint
// for the detailed live/final state. Every step degrades to null on failure
// (no match, bad response, unexpected shape) — callers should treat null as
// "fall back to the existing pregame view," never as an error.
// ---------------------------------------------------------------------------

const ESPN_SUMMARY_URL =
  "https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary";

// A week's scoreboard event list is set once the slate is announced and
// doesn't change — cache generously so repeat page loads for the same game
// don't re-hit ESPN just to re-derive the same event id.
const EVENT_ID_REVALIDATE = 60 * 60 * 6;

// CFBD's seasonType is a string ("regular" | "postseason"); ESPN's
// scoreboard wants the numeric season type it uses internally.
function seasonTypeCode(seasonType: string): number {
  return seasonType === "postseason" ? 3 : 2;
}

function normalizeSchool(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

async function findEspnEventId(game: Game): Promise<string | null> {
  try {
    const url = new URL(ESPN_SCOREBOARD_URL);
    url.searchParams.set("year", String(game.season));
    url.searchParams.set("week", String(game.week));
    url.searchParams.set("seasontype", String(seasonTypeCode(game.seasonType)));

    const res = await fetch(url, { next: { revalidate: EVENT_ID_REVALIDATE } });
    if (!res.ok) return null;

    const data = (await res.json()) as { events?: EspnEvent[] };
    const home = normalizeSchool(game.homeTeam);
    const away = normalizeSchool(game.awayTeam);

    for (const event of data.events ?? []) {
      const comp = event.competitions?.[0];
      if (!comp) continue;
      const schools = comp.competitors.map((c) => normalizeSchool(c.team.location));
      if (schools.includes(home) && schools.includes(away)) return event.id;
    }
    return null;
  } catch (err) {
    console.warn("[espn] event id lookup threw", err);
    return null;
  }
}

export type LiveTeamState = {
  school: string;
  score: number | null;
  possession: boolean;
};

export type BoxScoreStat = {
  label: string;
  home: string;
  away: string;
};

export type GameSummary = {
  state: "pre" | "in" | "post";
  statusDetail: string;
  period: number;
  clock: string;
  home: LiveTeamState;
  away: LiveTeamState;
  downDistanceText: string | null;
  isRedZone: boolean;
  boxscore: BoxScoreStat[] | null;
};

type EspnSummaryCompetitor = {
  id: string;
  homeAway: "home" | "away";
  score?: string;
  team: { location: string };
};

type EspnSituation = {
  downDistanceText?: string;
  isRedZone?: boolean;
  possession?: string;
};

type EspnSummaryCompetition = {
  status: EspnStatus;
  competitors: EspnSummaryCompetitor[];
  situation?: EspnSituation;
};

type EspnBoxscoreStatEntry = {
  name: string;
  displayValue: string;
  label: string;
};

type EspnBoxscoreTeam = {
  homeAway: "home" | "away";
  statistics: EspnBoxscoreStatEntry[];
};

type EspnSummaryResponse = {
  header?: { competitions?: EspnSummaryCompetition[] };
  boxscore?: { teams?: EspnBoxscoreTeam[] };
};

// A curated subset of ESPN's team box score, not the full stat sheet — total
// yards, passing/rushing split, turnovers, and time of possession cover what
// a fan actually scans for after a final. displayValue/label come straight
// from ESPN so the labels stay accurate even if their exact stat set shifts.
const BOX_SCORE_KEYS = ["totalYards", "netPassingYards", "rushingYards", "turnovers", "possessionTime"];

export async function getGameSummary(eventId: string): Promise<GameSummary | null> {
  try {
    const res = await fetch(`${ESPN_SUMMARY_URL}?event=${eventId}`, {
      next: { revalidate: LIVE_REVALIDATE },
    });
    if (!res.ok) {
      console.warn(`[espn] summary request failed: ${res.status}`);
      return null;
    }

    const data = (await res.json()) as EspnSummaryResponse;
    const comp = data.header?.competitions?.[0];
    if (!comp) return null;

    const homeC = comp.competitors.find((c) => c.homeAway === "home");
    const awayC = comp.competitors.find((c) => c.homeAway === "away");
    const situation = comp.situation;

    const boxTeams = data.boxscore?.teams ?? [];
    const homeBox = boxTeams.find((t) => t.homeAway === "home");
    const awayBox = boxTeams.find((t) => t.homeAway === "away");
    const boxscore =
      comp.status.type.state === "post" && homeBox && awayBox
        ? BOX_SCORE_KEYS.flatMap((key): BoxScoreStat[] => {
            const homeStat = homeBox.statistics.find((s) => s.name === key);
            const awayStat = awayBox.statistics.find((s) => s.name === key);
            if (!homeStat || !awayStat) return [];
            return [{ label: homeStat.label, home: homeStat.displayValue, away: awayStat.displayValue }];
          })
        : null;

    return {
      state: comp.status.type.state,
      statusDetail: comp.status.type.shortDetail,
      period: comp.status.period,
      clock: comp.status.displayClock,
      home: {
        school: homeC?.team.location ?? "",
        score: homeC?.score != null ? Number(homeC.score) : null,
        possession: situation?.possession != null && situation.possession === homeC?.id,
      },
      away: {
        school: awayC?.team.location ?? "",
        score: awayC?.score != null ? Number(awayC.score) : null,
        possession: situation?.possession != null && situation.possession === awayC?.id,
      },
      downDistanceText: situation?.downDistanceText ?? null,
      isRedZone: situation?.isRedZone ?? false,
      boxscore: boxscore && boxscore.length > 0 ? boxscore : null,
    };
  } catch (err) {
    console.warn("[espn] summary fetch threw", err);
    return null;
  }
}

export async function getLiveGameData(game: Game): Promise<GameSummary | null> {
  const eventId = await findEspnEventId(game);
  if (!eventId) return null;
  return getGameSummary(eventId);
}
