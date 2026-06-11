import type { ParticipantSummary } from './ParticipantSummary';

export interface MatchDetail {
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
  teamPosition: string;
  participants: ParticipantSummary[];
}
