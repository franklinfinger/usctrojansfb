// ESPN's public scoreboard is unofficial and undocumented — no API key, no
// SLA, no versioned contract. Every field read here is inferred from the
// live response rather than a spec, so parsing stays defensive (optional
// chaining, `?? null` everywhere) and any failure degrades to an empty list
// rather than throwing, mirroring cfbd()'s fallback contract in lib/cfbd.ts.
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
