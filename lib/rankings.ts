import type { RankingWeek } from "./types";

export type RankRow = {
  rank: number;
  school: string;
  conference: string;
  points: number;
  firstPlaceVotes?: number;
  previousRank: number | null;
};

export type PollTab = {
  key: "ap" | "coaches" | "cfp";
  label: string;
  weekLabel: string | null;
  rows: RankRow[] | null;
};

function weekLabelOf(week: RankingWeek): string {
  return week.seasonType === "postseason" ? "Final" : `Week ${week.week}`;
}

// Finds the most recent week (scanning backward) whose polls include one
// matching `test`, then pairs it with whatever earlier week most recently
// also had a matching poll, so week-over-week movement can be computed. A
// poll that has never appeared this season (the CFP committee poll before
// it starts publishing, roughly early-to-mid November) yields `rows: null`
// rather than an empty list, so the page can tell "not released yet" apart
// from "released, but nobody's ranked" — a distinction a plain [] can't make.
function buildTab(weeks: RankingWeek[], key: PollTab["key"], label: string, test: (poll: string) => boolean): PollTab {
  let currentIndex = -1;
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (weeks[i].polls.some((p) => test(p.poll.toLowerCase()))) {
      currentIndex = i;
      break;
    }
  }
  if (currentIndex === -1) {
    return { key, label, weekLabel: null, rows: null };
  }

  const currentWeek = weeks[currentIndex];
  const currentPoll = currentWeek.polls.find((p) => test(p.poll.toLowerCase()))!;

  let previousPoll: RankingWeek["polls"][number] | null = null;
  for (let i = currentIndex - 1; i >= 0; i--) {
    const match = weeks[i].polls.find((p) => test(p.poll.toLowerCase()));
    if (match) {
      previousPoll = match;
      break;
    }
  }
  const previousRankBySchool = new Map<string, number>(
    (previousPoll?.ranks ?? []).map((r) => [r.school, r.rank])
  );

  const rows: RankRow[] = currentPoll.ranks
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((r) => ({
      rank: r.rank,
      school: r.school,
      conference: r.conference,
      points: r.points,
      firstPlaceVotes: r.firstPlaceVotes,
      previousRank: previousRankBySchool.get(r.school) ?? null,
    }));

  return { key, label, weekLabel: weekLabelOf(currentWeek), rows };
}

export function buildPollTabs(weeks: RankingWeek[]): PollTab[] {
  return [
    buildTab(weeks, "ap", "AP Top 25", (p) => p.includes("ap")),
    buildTab(weeks, "coaches", "Coaches Poll", (p) => p.includes("coaches") || p.includes("usa today")),
    buildTab(weeks, "cfp", "CFP Rankings", (p) => p.includes("playoff")),
  ];
}

// Prefers AP since it's the most widely referenced poll; falls back to
// whichever poll is actually live (Coaches, then CFP once it starts
// publishing) so callers still work before AP has run this week or in the
// unlikely case AP data alone fails to come back.
function currentTop25Rows(polls: PollTab[]): RankRow[] {
  return polls.find((p) => p.key === "ap")?.rows ?? polls.find((p) => p.rows)?.rows ?? [];
}

// The set of currently-ranked schools, lowercased/trimmed for loose matching
// against other data sources (e.g. ESPN's scoreboard, which names teams
// slightly differently in places).
export function top25Schools(polls: PollTab[]): Set<string> {
  return new Set(currentTop25Rows(polls).map((r) => r.school.toLowerCase().trim()));
}

// School (lowercased/trimmed) -> current AP rank. Same row source as
// top25Schools, so a caller already filtering by top25Schools can look up a
// team's rank for display without a second rankings fetch.
export function top25Ranks(polls: PollTab[]): Map<string, number> {
  return new Map(currentTop25Rows(polls).map((r) => [r.school.toLowerCase().trim(), r.rank]));
}
