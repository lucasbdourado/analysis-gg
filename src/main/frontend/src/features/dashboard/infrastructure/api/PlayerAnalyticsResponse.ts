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

export interface PastSeasonRank {
  season: string;
  tier: string;
  rank: string | null;
}

export interface PlayerAnalyticsResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  profileIconId: number;
  summonerLevel: number;
  rankedQueues: RankedQueues;
  matches: MatchSummary[];
  pastSeasonRanks: PastSeasonRank[];
}
