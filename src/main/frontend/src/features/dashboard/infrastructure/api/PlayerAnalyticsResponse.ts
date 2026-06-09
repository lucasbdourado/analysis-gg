import type { MatchSummary } from '../../domain/MatchSummary';

export interface RankedQueueSummary {
  queueType: string;
  tier: string | null;
  rank: string | null;
  leaguePoints: number | null;
  wins: number | null;
  losses: number | null;
  winRate: number | null;
}

export interface RankedQueues {
  soloDuo: RankedQueueSummary;
  flex: RankedQueueSummary;
}

export interface PlayerAnalyticsResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  rankedQueues: RankedQueues;
  matches: MatchSummary[];
}
