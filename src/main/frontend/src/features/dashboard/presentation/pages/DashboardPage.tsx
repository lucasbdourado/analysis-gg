import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardProvider } from '../context/DashboardContext';
import { MatchRangeFilter } from '../components/MatchRangeFilter';
import { MatchQueueFilter } from '../components/MatchQueueFilter';
import { AccountRankedSummary } from '../components/AccountRankedSummary';
import type { PlayerAnalyticsResponse } from '../../infrastructure/api/PlayerAnalyticsResponse';
import { RecentMatchHistory } from '../components/RecentMatchHistory';
import { usePlayerAnalytics } from '../hooks/usePlayerAnalytics';
import { WeekdayWinRateChart } from '../components/WeekdayWinRateChart';
import { RouteWinRateChart } from '../components/RouteWinRateChart';
import { DailyPerformanceGrid } from '../components/DailyPerformanceGrid';
import { TopChampionsTable } from '../components/TopChampionsTable';
import { SessionReview } from '../components/SessionReview';
import { BestSelfComparison } from '../components/BestSelfComparison';
import { useDashboard } from '../context/DashboardContext';
import styles from './DashboardPage.module.css';

type DashboardContentProps = {
  data: PlayerAnalyticsResponse;
};

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
      <DashboardContent data={data} />
    </DashboardProvider>
  );
};

const DashboardContent: React.FC<DashboardContentProps> = ({ data }) => {
  const { combinedFilteredMatches } = useDashboard();
  const navigate = useNavigate();

  const handleBackToSearch = () => {
    navigate('/');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topBar}>
        <button
          className={styles.backButton}
          onClick={handleBackToSearch}
          type="button"
          id="back-to-search"
        >
          <span className={styles.backArrow}>←</span> Account Selection
        </button>
      </div>

      <div className={`ds-container ds-section ds-stack-lg ${styles.dashboardContainer}`} data-testid="dashboard-success">
        <header className={styles.header}>
          <div className={styles.filtersSection} data-testid="dashboard-filters">
            <MatchQueueFilter />
            <MatchRangeFilter />
          </div>
        </header>

        <div className={styles.dashboardLayout}>
          <aside className={styles.sidebar} data-testid="dashboard-profile">
            <AccountRankedSummary
              gameName={data.gameName}
              tagLine={data.tagLine}
              region={data.region}
              profileIconId={data.profileIconId}
              summonerLevel={data.summonerLevel}
              rankedQueues={data.rankedQueues}
              pastSeasonRanks={data.pastSeasonRanks}
            />
          </aside>
          
          <main className={styles.mainContent} data-testid="dashboard-analytics">
            <div className={styles.topWidgetsGrid}>
              <RouteWinRateChart />
              <WeekdayWinRateChart />
              <div className={styles.dailyPerformanceWrapper}>
                <DailyPerformanceGrid />
              </div>
            </div>
            <div className={styles.bottomWidgetRow}>
              <BestSelfComparison matches={combinedFilteredMatches} />
            </div>
            <div className={styles.bottomWidgetRow}>
              <SessionReview />
            </div>
            <div className={styles.bottomWidgetRow}>
              <TopChampionsTable />
            </div>
            <div className={styles.bottomWidgetRow}>
              <RecentMatchHistory matches={combinedFilteredMatches} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
