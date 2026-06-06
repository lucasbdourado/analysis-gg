import React, { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { MatchSummary } from '../../domain/MatchSummary';
import styles from './TopChampionsTable.module.css';

interface ChampionStats {
  championName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  kills: number;
  deaths: number;
  assists: number;
  kda: string;
  csMin: string;
}

export const TopChampionsTable: React.FC = () => {
  const { filteredMatches } = useDashboard();

  const championsData = useMemo((): ChampionStats[] => {
    const agg: Record<string, {
      wins: number;
      losses: number;
      kills: number;
      deaths: number;
      assists: number;
      totalCs: number;
      totalDurationSeconds: number;
    }> = {};

    filteredMatches.forEach((match: MatchSummary) => {
      const name = match.championName || 'Unknown';
      if (!agg[name]) {
        agg[name] = {
          wins: 0,
          losses: 0,
          kills: 0,
          deaths: 0,
          assists: 0,
          totalCs: 0,
          totalDurationSeconds: 0,
        };
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
      champ.totalCs += (match.totalMinionsKilled || 0) + (match.neutralMinionsKilled || 0);
      champ.totalDurationSeconds += match.gameDuration || 0;
    });

    const statsList = Object.entries(agg).map(([championName, data]) => {
      const gamesPlayed = data.wins + data.losses;
      const winRate = gamesPlayed > 0 ? Math.round((data.wins / gamesPlayed) * 100) : 0;
      
      const avgK = data.kills / gamesPlayed;
      const avgD = data.deaths / gamesPlayed;
      const avgA = data.assists / gamesPlayed;
      
      // KDA calculation: (Kills + Assists) / Math.max(1, Deaths)
      const rawKda = (data.kills + data.assists) / Math.max(1, data.deaths);
      const kdaFormatted = rawKda.toFixed(2);
      const kdaString = `${kdaFormatted} (${avgK.toFixed(1)}/${avgD.toFixed(1)}/${avgA.toFixed(1)})`;

      const durationMinutes = data.totalDurationSeconds / 60;
      const csMin = durationMinutes > 0 ? (data.totalCs / durationMinutes).toFixed(1) : '0.0';

      return {
        championName,
        gamesPlayed,
        wins: data.wins,
        losses: data.losses,
        winRate,
        kills: data.kills,
        deaths: data.deaths,
        assists: data.assists,
        kda: kdaString,
        csMin,
      };
    });

    // Sort descending by games played, then by win rate
    return statsList.sort((a, b) => {
      if (b.gamesPlayed !== a.gamesPlayed) {
        return b.gamesPlayed - a.gamesPlayed;
      }
      return b.winRate - a.winRate;
    });
  }, [filteredMatches]);

  const hasMatches = filteredMatches.length > 0;

  return (
    <div className={styles.tableCard}>
      <h3 className={styles.tableTitle}>Top Champions</h3>
      {!hasMatches ? (
        <div className={styles.emptyState}>No champion statistics to display.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thLeft}>Champion</th>
                <th>Played</th>
                <th>Win Rate</th>
                <th className={styles.thLeft}>KDA</th>
                <th>CS/min</th>
              </tr>
            </thead>
            <tbody>
              {championsData.map((champ) => {
                // Style win rates dynamically: high win rates can highlight cyan
                const isHighWinRate = champ.winRate >= 60;
                return (
                  <tr key={champ.championName} className={styles.tr}>
                    <td className={`${styles.tdLeft} ${styles.championNameCell}`}>
                      {champ.championName}
                    </td>
                    <td className={styles.tdCenter}>{champ.gamesPlayed}</td>
                    <td className={styles.tdCenter}>
                      <span className={isHighWinRate ? styles.highWinRate : ''}>
                        {champ.winRate}%
                      </span>
                      <span className={styles.recordDetail}>
                        ({champ.wins}W - {champ.losses}L)
                      </span>
                    </td>
                    <td className={`${styles.tdLeft} ${styles.kdaCell}`}>
                      {champ.kda}
                    </td>
                    <td className={styles.tdCenter}>{champ.csMin}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
