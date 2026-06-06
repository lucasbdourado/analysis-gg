import type { MatchSummary } from '../../domain/MatchSummary';

export interface PlayerAnalyticsResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  matches: MatchSummary[];
}
