import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import styles from './MatchRangeFilter.module.css';

export const MatchRangeFilter: React.FC = () => {
  const { rawData, activeRange, setActiveRange } = useDashboard();

  const data = rawData || [];
  const totalMatches = data.length;

  const options = [20, 50, 100];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveRange(Number(e.target.value));
  };

  return (
    <div className={styles.container}>
      <label htmlFor="match-range-select" className={styles.label}>
        Games to Analyze:
      </label>
      <select
        id="match-range-select"
        data-testid="match-range-select"
        value={activeRange}
        onChange={handleChange}
        disabled={totalMatches === 0}
        className={`ds-select ${styles.select}`}
      >
        {totalMatches === 0 ? (
          <option value={activeRange}>No matches available</option>
        ) : (
          options.map((option) => {
            const label =
              totalMatches < option
                ? `Last ${option} (${totalMatches} available)`
                : `Last ${option}`;
            return (
              <option key={option} value={option} className={styles.option}>
                {label}
              </option>
            );
          })
        )}
      </select>
    </div>
  );
};
