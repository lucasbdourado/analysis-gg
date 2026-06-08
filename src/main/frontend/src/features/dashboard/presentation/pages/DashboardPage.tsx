import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardProvider } from '../context/DashboardContext';
import { MatchRangeFilter } from '../components/MatchRangeFilter';
import { MatchQueueFilter } from '../components/MatchQueueFilter';
import { usePlayerAnalytics } from '../hooks/usePlayerAnalytics';
import { WeekdayWinRateChart } from '../components/WeekdayWinRateChart';
import { DailyPerformanceGrid } from '../components/DailyPerformanceGrid';
import { TopChampionsTable } from '../components/TopChampionsTable';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const gameName = searchParams.get('name') || '';
  const tagLine = searchParams.get('tag') || '';
  const region = searchParams.get('region') || '';

  const [activeRange, setActiveRange] = useState<number>(20);
  const [selectedQueues, setSelectedQueues] = useState<string[]>([]);

  const toggleQueueFilter = (queueKey: string) => {
    setSelectedQueues((prev) =>
      prev.includes(queueKey)
        ? prev.filter((k) => k !== queueKey)
        : [...prev, queueKey]
    );
  };

  const clearQueueFilters = () => {
    setSelectedQueues([]);
  };

  const { data, loading, error } = usePlayerAnalytics(
    gameName,
    tagLine,
    region,
    activeRange,
    selectedQueues
  );

  const handleBackToSearch = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles.centeredContainer} data-testid="dashboard-loading">
        <div className={`ds-panel ${styles.loadingCard}`}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Synchronizing Riot API match history...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.centeredContainer} data-testid="dashboard-error">
        <div className={`ds-panel ${styles.errorCard}`}>
          <h2 className={`ds-heading-lg ${styles.errorTitle}`}>Analysis Refused</h2>
          <p className={styles.errorMessage}>{error || 'Failed to retrieve profile analytics.'}</p>
          <button className="ds-button ds-button-ghost" onClick={handleBackToSearch}>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider
      rawData={data.matches}
      activeRange={activeRange}
      setActiveRange={setActiveRange}
      selectedQueues={selectedQueues}
      toggleQueueFilter={toggleQueueFilter}
      clearQueueFilters={clearQueueFilters}
    >
      <div className={`ds-container ds-section ds-stack-lg ${styles.dashboardContainer}`} data-testid="dashboard-success">
        <header className={styles.header}>
          <div className={styles.playerTitleSection}>
            <h1 className={`ds-heading-xl ${styles.playerName}`}>{data.gameName}</h1>
            <span className={styles.playerTag}>#{data.tagLine}</span>
            <span className="ds-badge">{data.region}</span>
          </div>
          <div className={styles.filtersSection}>
            <MatchQueueFilter />
            <MatchRangeFilter />
          </div>
        </header>
        
        <main className={styles.mainContent}>
          <div className={styles.topWidgetsGrid}>
            <WeekdayWinRateChart />
            <DailyPerformanceGrid />
          </div>
          <div className={styles.bottomWidgetRow}>
            <TopChampionsTable />
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
};
