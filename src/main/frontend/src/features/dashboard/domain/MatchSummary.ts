export interface MatchSummary {
  matchId: string;
  gameDuration: number;
  gameCreation: number;
  queueId: number;
  win: boolean;
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
}
