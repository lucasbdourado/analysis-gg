import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardProvider } from '../context/DashboardContext';
import { MatchRangeFilter } from '../components/MatchRangeFilter';
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

  const { data, loading, error } = usePlayerAnalytics(gameName, tagLine, region);

  const handleBackToSearch = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles.centeredContainer} data-testid="dashboard-loading">
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Synchronizing Riot API match history...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.centeredContainer} data-testid="dashboard-error">
        <div className={styles.errorCard}>
          <h2 className={styles.errorTitle}>Analysis Refused</h2>
          <p className={styles.errorMessage}>{error || 'Failed to retrieve profile analytics.'}</p>
          <button className={styles.backButton} onClick={handleBackToSearch}>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider rawData={data.matches}>
      <div className={styles.dashboardContainer} data-testid="dashboard-success">
        <header className={styles.header}>
          <div className={styles.playerTitleSection}>
            <h1 className={styles.playerName}>{data.gameName}</h1>
            <span className={styles.playerTag}>#{data.tagLine}</span>
            <span className={styles.regionBadge}>{data.region}</span>
          </div>
          <MatchRangeFilter />
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
