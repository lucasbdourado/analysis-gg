import React, { useMemo, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { MatchSummary } from '../../domain/MatchSummary';
import styles from './SessionReview.module.css';

const CHAMPION_ASSET_VERSION = '16.11.1';

interface WorstMatchInfo {
  kills: number;
  deaths: number;
  assists: number;
  championName: string;
}

interface SessionStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  bestChampion: string;
  worstMatch: WorstMatchInfo | null;
  recommendation: string;
  averageDeaths: number;
}

export const SessionReview: React.FC = () => {
  const { combinedFilteredMatches } = useDashboard();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (championName: string) => {
    setFailedImages((prev) => ({ ...prev, [championName]: true }));
  };

  const stats = useMemo((): SessionStats | null => {
    const totalMatches = combinedFilteredMatches.length;
    if (totalMatches < 5) {
      return null;
    }

    const wins = combinedFilteredMatches.filter((m) => m.win).length;
    const losses = totalMatches - wins;
    const winRate = Math.round((wins / totalMatches) * 100);

    // 1. Calculate best champion
    const agg: Record<string, { wins: number; losses: number; kills: number; deaths: number; assists: number }> = {};
    combinedFilteredMatches.forEach((match) => {
      const name = match.championName || 'Unknown';
      if (!agg[name]) {
        agg[name] = { wins: 0, losses: 0, kills: 0, deaths: 0, assists: 0 };
      }
      const champ = agg[name];
      if (match.win) {
        champ.wins += 1;
      } else {
        champ.losses += 1;
      }
      champ.kills += match.kills;
      champ.deaths += match.deaths;
      champ.assists += match.assists;
    });

    const champStats = Object.entries(agg).map(([championName, data]) => {
      const gamesPlayed = data.wins + data.losses;
      const rate = data.wins / gamesPlayed;
      const isPerfectKda = data.deaths === 0;
      const kdaValue = isPerfectKda ? (data.kills + data.assists) : (data.kills + data.assists) / data.deaths;

      return {
        championName,
        gamesPlayed,
        winRate: rate,
        kdaValue,
      };
    });

    champStats.sort((a, b) => {
      // Win Rate desc
      if (b.winRate !== a.winRate) {
        return b.winRate - a.winRate;
      }
      // Games played desc
      if (b.gamesPlayed !== a.gamesPlayed) {
        return b.gamesPlayed - a.gamesPlayed;
      }
      // avg KDA desc
      if (b.kdaValue !== a.kdaValue) {
        return b.kdaValue - a.kdaValue;
      }
      // Alphabetical name asc
      return a.championName.localeCompare(b.championName);
    });

    const bestChampion = champStats.length > 0 ? champStats[0].championName : 'None';

    // 2. Calculate worst match (lowest KDA, high deaths as tie-breaker)
    let worstMatchRef: MatchSummary | null = null;
    let worstKda = Infinity;
    let worstDeaths = -1;

    for (const match of combinedFilteredMatches) {
      const kda = match.deaths === 0 ? (match.kills + match.assists) : (match.kills + match.assists) / match.deaths;
      if (worstMatchRef === null) {
        worstMatchRef = match;
        worstKda = kda;
        worstDeaths = match.deaths;
      } else {
        if (kda < worstKda) {
          worstMatchRef = match;
          worstKda = kda;
          worstDeaths = match.deaths;
        } else if (kda === worstKda) {
          if (match.deaths > worstDeaths) {
            worstMatchRef = match;
            worstKda = kda;
            worstDeaths = match.deaths;
          }
        }
      }
    }

    const worstMatch: WorstMatchInfo | null = worstMatchRef
      ? {
          kills: worstMatchRef.kills,
          deaths: worstMatchRef.deaths,
          assists: worstMatchRef.assists,
          championName: worstMatchRef.championName || 'Unknown',
        }
      : null;

    // 3. Average deaths
    const totalDeaths = combinedFilteredMatches.reduce((sum, m) => sum + m.deaths, 0);
    const averageDeaths = totalDeaths / totalMatches;

    // 4. Recommendation rules
    let recommendation = '';
    if (winRate >= 60) {
      if (totalMatches < 10) {
        recommendation = `Solid start! Keep practicing ${bestChampion} to build your confidence and consistency.`;
      } else {
        recommendation = `You're on a roll! Keep playing ${bestChampion} and leverage your high win rate to climb.`;
      }
    } else if (winRate < 45) {
      if (totalMatches < 10) {
        recommendation = `A few tough games recently. Consider reviewing your positioning and playing more cautiously.`;
      } else {
        const worstChamp = worstMatch ? worstMatch.championName : 'unknown champion';
        recommendation = `Take a break or review your positioning. Focus on reducing deaths, particularly in games like your ${worstChamp}.`;
      }
    } else if (averageDeaths >= 7) {
      if (totalMatches < 10) {
        recommendation = `Try to prioritize survival in your next games. Focus on safety and warding.`;
      } else {
        recommendation = `Focus on map awareness and survival. High average deaths are holding back your matches.`;
      }
    } else {
      recommendation = `Analyze your matches to find consistent patterns. Focus on objective control and team positioning.`;
    }

    return {
      totalMatches,
      wins,
      losses,
      winRate,
      bestChampion,
      worstMatch,
      recommendation,
      averageDeaths,
    };
  }, [combinedFilteredMatches]);

  if (!stats) {
    return (
      <div className={`ds-panel ${styles.container}`} data-testid="session-review-empty">
        <p className={styles.emptyMessage}>Not enough matches to generate a session review.</p>
      </div>
    );
  }

  const isHighWinRate = stats.winRate >= 60;
  const isLowWinRate = stats.winRate < 45;

  return (
    <div className={`ds-panel ${styles.container}`} data-testid="session-review-active">
      <h3 className={`ds-heading-md ${styles.title}`}>Session Review</h3>
      
      <div className={styles.grid}>
        {/* Summary Metrics */}
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Matches</span>
          <span className={styles.metricValue}>{stats.totalMatches}</span>
          <span className={styles.metricSubtext}>
            {stats.wins}W - {stats.losses}L
          </span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Win Rate</span>
          <span className={`${styles.metricValue} ${isHighWinRate ? styles.highWinRate : isLowWinRate ? styles.lowWinRate : ''}`}>
            {stats.winRate}%
          </span>
          <span className={styles.metricSubtext}>Avg Deaths: {stats.averageDeaths.toFixed(1)}</span>
        </div>

        {/* Best Champion */}
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Best Champion</span>
          <div className={styles.championWrapper}>
            {failedImages[stats.bestChampion] ? (
              <div 
                className={styles.championFallback} 
                data-testid={`fallback-${stats.bestChampion}`}
              >
                {stats.bestChampion.charAt(0)}
              </div>
            ) : (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${CHAMPION_ASSET_VERSION}/img/champion/${stats.bestChampion}.png`}
                alt={stats.bestChampion}
                className={styles.championIcon}
                onError={() => handleImageError(stats.bestChampion)}
              />
            )}
            <span className={styles.championName}>{stats.bestChampion}</span>
          </div>
        </div>

        {/* Worst Match */}
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Worst Match</span>
          {stats.worstMatch ? (
            <div className={styles.worstMatchContent}>
              <span className={styles.worstMatchTitle}>Low KDA game</span>
              <span className={styles.worstMatchValue}>
                {stats.worstMatch.kills}/{stats.worstMatch.deaths}/{stats.worstMatch.assists} on {stats.worstMatch.championName}
              </span>
            </div>
          ) : (
            <span className={styles.metricValue}>-</span>
          )}
        </div>
      </div>

      {/* Recommendation Section */}
      <div className={styles.recommendationBox}>
        <div className={styles.recommendationBadge}>Coach Tip</div>
        <p className={styles.recommendationText}>{stats.recommendation}</p>
      </div>
    </div>
  );
};
