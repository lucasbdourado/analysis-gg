import React, { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { MatchSummary } from '../../domain/MatchSummary';
import styles from './DailyPerformanceGrid.module.css';

interface DayRecord {
  date: string;
  formattedDate: string;
  wins: number;
  losses: number;
  status: 'win' | 'loss' | 'tie' | 'none';
}

export const DailyPerformanceGrid: React.FC = () => {
  const { filteredMatches } = useDashboard();

  const getLocalDateString = (timestamp: number) => {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateLabel = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const gridData = useMemo((): DayRecord[] => {
    if (filteredMatches.length === 0) {
      return [];
    }

    // Find the min and max timestamps to construct the window
    const timestamps = filteredMatches.map(m => m.gameCreation);
    const latestTimestamp = Math.max(...timestamps);
    
    // Generate the last 30 calendar days leading to the latest match
    const dates: string[] = [];
    const endDate = new Date(latestTimestamp);
    for (let i = 29; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(endDate.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }

    // Aggregate matches by local date string
    const counts: Record<string, { wins: number; losses: number }> = {};
    filteredMatches.forEach((match: MatchSummary) => {
      const dateStr = getLocalDateString(match.gameCreation);
      if (!counts[dateStr]) {
        counts[dateStr] = { wins: 0, losses: 0 };
      }
      if (match.win) {
        counts[dateStr].wins += 1;
      } else {
        counts[dateStr].losses += 1;
      }
    });

    // Map each date to a record
    return dates.map(dateStr => {
      const record = counts[dateStr] || { wins: 0, losses: 0 };
      let status: 'win' | 'loss' | 'tie' | 'none' = 'none';
      if (record.wins + record.losses > 0) {
        if (record.wins > record.losses) {
          status = 'win';
        } else if (record.losses > record.wins) {
          status = 'loss';
        } else {
          status = 'tie';
        }
      }
      return {
        date: dateStr,
        formattedDate: formatDateLabel(dateStr),
        wins: record.wins,
        losses: record.losses,
        status,
      };
    });
  }, [filteredMatches]);

  const hasMatches = filteredMatches.length > 0;

  return (
    <div className={`ds-panel ${styles.gridCard}`}>
      <div className={styles.gridHeader}>
        <h3 className={`ds-heading-md ${styles.gridTitle}`}>Recent Daily Performance</h3>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.cell} ${styles.win}`} /> Win
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.cell} ${styles.loss}`} /> Loss
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.cell} ${styles.tie}`} /> Tie
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.cell} ${styles.none}`} /> None
          </span>
        </div>
      </div>

      {!hasMatches ? (
        <div className={styles.emptyState}>No match records to display.</div>
      ) : (
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            {gridData.map(day => {
              const totalGames = day.wins + day.losses;
              let tooltipText = `${day.formattedDate}: No games played`;
              if (totalGames > 0) {
                tooltipText = `${day.formattedDate}: ${day.wins}W - ${day.losses}L (${
                  day.status === 'win' ? 'Winning Day' : day.status === 'loss' ? 'Losing Day' : 'Even Record'
                })`;
              }

              return (
                <div
                  key={day.date}
                  className={`${styles.cell} ${styles[day.status]}`}
                  data-tooltip={tooltipText}
                />
              );
            })}
          </div>
          <div className={styles.gridTimeline}>
            <span>30 Days Ago</span>
            <span>Latest Match</span>
          </div>
        </div>
      )}
    </div>
  );
};
