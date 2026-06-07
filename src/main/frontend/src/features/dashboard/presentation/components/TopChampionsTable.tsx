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
  kdaValue: number;
  isPerfectKda: boolean;
  kdaString: string;
  csMin: number;
  csMinString: string;
}

interface SortConfig {
  sortKey: 'championName' | 'gamesPlayed' | 'winRate' | 'kdaValue' | 'csMin';
  sortDirection: 'asc' | 'desc';
}

export const TopChampionsTable: React.FC = () => {
  const { filteredMatches } = useDashboard();

  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    sortKey: 'winRate',
    sortDirection: 'desc',
  });

  const handleSort = (key: 'championName' | 'gamesPlayed' | 'winRate' | 'kdaValue' | 'csMin') => {
    const isCurrent = sortConfig.sortKey === key;
    if (!isCurrent) {
      const defaultDirection = key === 'championName' ? 'asc' : 'desc';
      setSortConfig({ sortKey: key, sortDirection: defaultDirection });
    } else {
      const defaultDirection = key === 'championName' ? 'asc' : 'desc';
      if (sortConfig.sortDirection === defaultDirection) {
        setSortConfig({
          sortKey: key,
          sortDirection: defaultDirection === 'asc' ? 'desc' : 'asc',
        });
      } else {
        setSortConfig({ sortKey: 'winRate', sortDirection: 'desc' });
      }
    }
  };

  const renderSortIndicator = (key: 'championName' | 'gamesPlayed' | 'winRate' | 'kdaValue' | 'csMin') => {
    if (sortConfig.sortKey !== key) return null;
    return (
      <span className={styles.sortIndicator}>
        {sortConfig.sortDirection === 'asc' ? ' ▲' : ' ▼'}
      </span>
    );
  };

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

    const statsList = Object.entries(agg).map(([championName, data]): ChampionStats => {
      const gamesPlayed = data.wins + data.losses;
      const winRate = gamesPlayed > 0 ? Math.round((data.wins / gamesPlayed) * 100) : 0;
      
      const avgK = gamesPlayed > 0 ? data.kills / gamesPlayed : 0;
      const avgD = gamesPlayed > 0 ? data.deaths / gamesPlayed : 0;
      const avgA = gamesPlayed > 0 ? data.assists / gamesPlayed : 0;
      
      const isPerfectKda = data.deaths === 0;
      const kdaValue = isPerfectKda ? (data.kills + data.assists) : (data.kills + data.assists) / data.deaths;
      const kdaString = isPerfectKda
        ? `Perfect (${avgK.toFixed(1)}/0.0/${avgA.toFixed(1)})`
        : `${kdaValue.toFixed(2)} (${avgK.toFixed(1)}/${avgD.toFixed(1)}/${avgA.toFixed(1)})`;

      const csMin = data.totalDurationSeconds > 0 ? data.totalCs / (data.totalDurationSeconds / 60) : 0;
      const csMinString = csMin.toFixed(1);

      return {
        championName,
        gamesPlayed,
        wins: data.wins,
        losses: data.losses,
        winRate,
        kills: data.kills,
        deaths: data.deaths,
        assists: data.assists,
        kdaValue,
        isPerfectKda,
        kdaString,
        csMin,
        csMinString,
      };
    });

    return statsList.sort((a, b) => {
      const key = sortConfig.sortKey;
      const dir = sortConfig.sortDirection;

      if (key === 'championName') {
        const comp = a.championName.localeCompare(b.championName);
        if (comp !== 0) {
          return dir === 'asc' ? comp : -comp;
        }
      } else {
        const valA = a[key] as number;
        const valB = b[key] as number;
        const comp = valA - valB;
        if (comp !== 0) {
          return dir === 'asc' ? comp : -comp;
        }
      }

      // Tie breaker: gamesPlayed desc, then championName asc
      if (b.gamesPlayed !== a.gamesPlayed) {
        return b.gamesPlayed - a.gamesPlayed;
      }
      return a.championName.localeCompare(b.championName);
    });
  }, [filteredMatches, sortConfig]);

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
                <th className={styles.thLeft} onClick={() => handleSort('championName')}>
                  Champion{renderSortIndicator('championName')}
                </th>
                <th onClick={() => handleSort('gamesPlayed')}>
                  Played{renderSortIndicator('gamesPlayed')}
                </th>
                <th onClick={() => handleSort('winRate')}>
                  Win Rate{renderSortIndicator('winRate')}
                </th>
                <th className={styles.thLeft} onClick={() => handleSort('kdaValue')}>
                  KDA{renderSortIndicator('kdaValue')}
                </th>
                <th onClick={() => handleSort('csMin')}>
                  CS/min{renderSortIndicator('csMin')}
                </th>
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
                      {champ.kdaString}
                    </td>
                    <td className={styles.tdCenter}>{champ.csMinString}</td>
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
