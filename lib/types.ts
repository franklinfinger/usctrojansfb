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
  homePoints: number | null;
  awayTeam: string;
  awayPoints: number | null;
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
};

export type TeamRecord = {
  year: number;
  team: string;
  conference: string;
  total: { games: number; wins: number; losses: number; ties: number };
  conferenceGames: { games: number; wins: number; losses: number; ties: number };
};
