export type Game = {
  id: number;
  season: number;
  week: number;
  seasonType: string;
  startDate: string;
  startTimeTbd: boolean;
  completed: boolean;
  neutralSite: boolean;
  conferenceGame: boolean;
  venue: string | null;
  homeTeam: string;
  homeConference?: string | null;
  homePoints: number | null;
  awayTeam: string;
  awayConference?: string | null;
  awayPoints: number | null;
};

export type GameMedia = {
  id: number;
  season: number;
  week: number;
  seasonType: string;
  startTime: string;
  isStartTimeTBD: boolean;
  homeTeam: string;
  awayTeam: string;
  mediaType: string;
  outlet: string;
};

export type RosterPlayer = {
  id: number;
  firstName: string;
  lastName: string;
  team: string;
  jersey: number | null;
  position: string | null;
  year: number | null;
  height: number | null;
  weight: number | null;
  hometown: string | null;
  homeState?: string | null;
  homeCountry?: string | null;
};

export type TeamRecord = {
  year: number;
  team: string;
  conference: string;
  total: { games: number; wins: number; losses: number; ties: number };
  conferenceGames: { games: number; wins: number; losses: number; ties: number };
};

export type RankingWeek = {
  season: number;
  seasonType: string;
  week: number;
  polls: {
    poll: string;
    ranks: {
      rank: number;
      school: string;
      conference: string;
      points: number;
      firstPlaceVotes?: number;
    }[];
  }[];
};

export type TeamSeasonStat = {
  season: number;
  team: string;
  conference: string;
  statName: string;
  statValue: number;
};

export type PlayerSeasonStat = {
  season: number;
  playerId: number;
  player: string;
  position: string;
  team: string;
  conference: string;
  category: string;
  statType: string;
  stat: number;
};

export type Recruit = {
  id?: number;
  year: number;
  name: string;
  position: string;
  height?: number;
  weight?: number;
  stars?: number;
  rating?: number;
  school?: string;
  committedTo?: string;
  city?: string;
  stateProvince?: string;
  ranking?: number;
};

export type TeamRecruitingRank = {
  year: number;
  team: string;
  rank: number;
  points: number;
};

export type Coach = {
  firstName: string;
  lastName: string;
  hireDate?: string;
  seasons: {
    school: string;
    year: number;
    games: number;
    wins: number;
    losses: number;
    ties: number;
    postseasonRank?: number;
  }[];
};
