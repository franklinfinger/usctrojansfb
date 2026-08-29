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
