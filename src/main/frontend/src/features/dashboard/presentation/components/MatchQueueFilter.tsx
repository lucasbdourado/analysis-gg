import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import styles from './MatchQueueFilter.module.css';

interface FilterItem {
  key: string;
  label: string;
}

const FILTER_ITEMS: FilterItem[] = [
  { key: 'SOLO_DUO', label: 'Solo/Duo' },
  { key: 'FLEX', label: 'Flex' },
  { key: 'NORMAL', label: 'Normal' },
  { key: 'ARAM', label: 'ARAM' },
  { key: 'CUSTOM', label: 'Custom' },
];

export const MatchQueueFilter: React.FC = () => {
  const { selectedQueues, toggleQueueFilter, rawData, clearQueueFilters } = useDashboard();
  const isDisabled = !rawData || rawData.length === 0;
  const hasActiveFilters = selectedQueues.length > 0;

  return (
    <div className={styles.container} data-testid="match-queue-filter">
      <span className={styles.label}>Match Type:</span>
      <div className={styles.filterList}>
        {FILTER_ITEMS.map((item) => {
          const isActive = selectedQueues.includes(item.key);
          return (
            <button
              key={item.key}
              data-testid={`filter-btn-${item.key.toLowerCase().replace('_', '-')}`}
              className={`${styles.filterButton} ${isActive ? styles.active : ''}`}
              onClick={() => toggleQueueFilter(item.key)}
              disabled={isDisabled}
              aria-pressed={isActive}
            >
              {item.label}
            </button>
          );
        })}
        {hasActiveFilters && (
          <button
            data-testid="reset-filters-btn"
            className={styles.resetButton}
            onClick={() => clearQueueFilters?.()}
            disabled={isDisabled}
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
