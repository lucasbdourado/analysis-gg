import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import type { MatchSummary } from '../../domain/MatchSummary';
import styles from './WeekdayWinRateChart.module.css';

interface ChartData {
  dayName: string;
  winRate: number;
  wins: number;
  losses: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data: ChartData = payload[0].payload;
    const total = data.wins + data.losses;
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipTitle}>{label}</p>
        {total > 0 ? (
          <p className={styles.tooltipValue}>
            Win Rate: <span className={styles.highlight}>{data.winRate}%</span> ({data.wins}W - {data.losses}L)
          </p>
        ) : (
          <p className={styles.tooltipValue}>No games played</p>
        )}
      </div>
    );
  }
  return null;
};

export const WeekdayWinRateChart: React.FC = () => {
  const { filteredMatches } = useDashboard();

  const weekdayData = useMemo(() => {
    const days = [
      { dayName: 'Sunday', wins: 0, losses: 0 },
      { dayName: 'Monday', wins: 0, losses: 0 },
      { dayName: 'Tuesday', wins: 0, losses: 0 },
      { dayName: 'Wednesday', wins: 0, losses: 0 },
      { dayName: 'Thursday', wins: 0, losses: 0 },
      { dayName: 'Friday', wins: 0, losses: 0 },
      { dayName: 'Saturday', wins: 0, losses: 0 },
    ];

    filteredMatches.forEach((match: MatchSummary) => {
      const date = new Date(match.gameCreation);
      const dayIndex = date.getDay(); // 0 = Sunday, ..., 6 = Saturday
      if (match.win) {
        days[dayIndex].wins += 1;
      } else {
        days[dayIndex].losses += 1;
      }
    });

    const dayDataList = days.map(day => {
      const total = day.wins + day.losses;
      const winRate = total > 0 ? Math.round((day.wins / total) * 100) : 0;
      return {
        ...day,
        winRate,
      };
    });

    return [...dayDataList.slice(1), dayDataList[0]];
  }, [filteredMatches]);

  const hasMatches = filteredMatches.length > 0;

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>Weekday Performance</h3>
      {!hasMatches ? (
        <div className={styles.emptyState}>No match records to display.</div>
      ) : (
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weekdayData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="dayName" stroke="var(--text)" fontSize={12} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="var(--text)" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
              <Bar dataKey="winRate" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
