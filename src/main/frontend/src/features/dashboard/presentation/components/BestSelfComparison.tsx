import { useMemo } from 'react';
import type { MatchSummary } from '../../domain/MatchSummary';
import styles from './BestSelfComparison.module.css';

type BestSelfComparisonProps = {
  matches: MatchSummary[];
  minMatches?: number;
};

type ComparisonInsight = {
  key: string;
  label: string;
  text: string;
  winsValue: number;
  lossesValue: number;
  winsBetter: boolean;
};

type ChampionInsight = {
  championName: string;
  gamesPlayed: number;
  winRate: number;
  overallWinRate: number;
};

const formatNumber = (value: number): string => value.toFixed(1);

const calculateKda = (match: MatchSummary): number => {
  const kdaBase = match.kills + match.assists;
  return match.deaths === 0 ? kdaBase : kdaBase / match.deaths;
};

const calculateCsPerMinute = (match: MatchSummary): number => {
  const totalCs = (match.totalMinionsKilled || 0) + (match.neutralMinionsKilled || 0);
  const durationMinutes = (match.gameDuration || 0) / 60;
  return durationMinutes > 0 ? totalCs / durationMinutes : 0;
};

const average = (values: number[]): number => {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export function BestSelfComparison({ matches, minMatches = 5 }: BestSelfComparisonProps) {
  const analysis = useMemo(() => {
    const totalMatches = matches.length;
    const wins = matches.filter((match) => match.win);
    const losses = matches.filter((match) => !match.win);
    const winsCount = wins.length;
    const lossesCount = losses.length;
    const overallWinRate = totalMatches > 0 ? (winsCount / totalMatches) * 100 : 0;

    if (totalMatches < minMatches) {
      return {
        totalMatches,
        winsCount,
        lossesCount,
        overallWinRate,
        hasEnoughMatches: false,
        insights: [] as ComparisonInsight[],
        championInsight: null as ChampionInsight | null,
      };
    }

    const winsKda = average(wins.map(calculateKda));
    const lossesKda = average(losses.map(calculateKda));
    const winsDeaths = average(wins.map((match) => match.deaths));
    const lossesDeaths = average(losses.map((match) => match.deaths));
    const winsCsMin = average(wins.map(calculateCsPerMinute));
    const lossesCsMin = average(losses.map(calculateCsPerMinute));

    const insightCandidates: ComparisonInsight[] = [
      {
        key: 'deaths',
        label: 'Deaths',
        winsValue: winsDeaths,
        lossesValue: lossesDeaths,
        winsBetter: winsDeaths < lossesDeaths,
        text: `You die less in wins: ${formatNumber(winsDeaths)} vs ${formatNumber(lossesDeaths)} deaths per game.`,
      },
      {
        key: 'kda',
        label: 'KDA',
        winsValue: winsKda,
        lossesValue: lossesKda,
        winsBetter: winsKda > lossesKda,
        text: `Your KDA is higher in wins: ${formatNumber(winsKda)} vs ${formatNumber(lossesKda)}.`,
      },
      {
        key: 'csMin',
        label: 'CS/min',
        winsValue: winsCsMin,
        lossesValue: lossesCsMin,
        winsBetter: winsCsMin > lossesCsMin,
        text: `Your CS/min is higher in wins: ${formatNumber(winsCsMin)} vs ${formatNumber(lossesCsMin)}.`,
      },
    ];

    const championStats = new Map<string, { wins: number; losses: number }>();
    matches.forEach((match) => {
      const championName = match.championName || 'Unknown';
      const current = championStats.get(championName) || { wins: 0, losses: 0 };
      if (match.win) {
        current.wins += 1;
      } else {
        current.losses += 1;
      }
      championStats.set(championName, current);
    });

    const championInsight = [...championStats.entries()]
      .map(([championName, record]): ChampionInsight | null => {
        const gamesPlayed = record.wins + record.losses;
        if (gamesPlayed < 3) {
          return null;
        }

        return {
          championName,
          gamesPlayed,
          winRate: (record.wins / gamesPlayed) * 100,
          overallWinRate,
        };
      })
      .filter((value): value is ChampionInsight => value !== null)
      .sort((a, b) => {
        if (b.winRate !== a.winRate) {
          return b.winRate - a.winRate;
        }
        if (b.gamesPlayed !== a.gamesPlayed) {
          return b.gamesPlayed - a.gamesPlayed;
        }
        return a.championName.localeCompare(b.championName);
      })[0] || null;

    const championBonus = championInsight && championInsight.winRate > overallWinRate + 5
      ? {
          key: 'champion',
          label: 'Champion',
          winsValue: championInsight.winRate,
          lossesValue: overallWinRate,
          winsBetter: true,
          text: `${championInsight.championName} is your strongest pick here: ${formatNumber(championInsight.winRate)}% win rate across ${championInsight.gamesPlayed} games, above your overall ${formatNumber(overallWinRate)}%.`,
        }
      : null;

    const insights = [...insightCandidates, ...(championBonus ? [championBonus] : [])]
      .filter((insight) => insight.winsBetter)
      .sort((a, b) => {
        const aDelta = Math.abs(a.winsValue - a.lossesValue);
        const bDelta = Math.abs(b.winsValue - b.lossesValue);
        if (bDelta !== aDelta) {
          return bDelta - aDelta;
        }
        return a.label.localeCompare(b.label);
      })
      .slice(0, 2);

    return {
      totalMatches,
      winsCount,
      lossesCount,
      overallWinRate,
      hasEnoughMatches: true,
      insights,
      championInsight,
    };
  }, [matches, minMatches]);

  const winRateClassName = analysis.overallWinRate >= 60 ? styles.highWinRate : '';

  return (
    <section className={`ds-panel ${styles.container}`} aria-label="Best self comparison">
      <div className={styles.header}>
        <div>
          <h3 className={`ds-heading-md ${styles.title}`}>Best Self Comparison</h3>
          <p className={styles.subtitle}>Wins versus losses from the currently filtered match list.</p>
        </div>
        <div className={styles.summaryPill}>
          <span className={styles.summaryLabel}>Match Set</span>
          <span className={styles.summaryValue}>{analysis.totalMatches}</span>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Win Rate</span>
          <span className={`${styles.statValue} ${winRateClassName}`}>{formatNumber(analysis.overallWinRate)}%</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Record</span>
          <span className={styles.statValue}>{analysis.winsCount}W - {analysis.lossesCount}L</span>
        </div>
      </div>

      {!analysis.hasEnoughMatches ? (
        <div className={styles.emptyState} data-testid="best-self-comparison-empty">
          Need at least {minMatches} matches to compare wins versus losses reliably.
        </div>
      ) : analysis.insights.length > 0 ? (
        <div className={styles.insightList} data-testid="best-self-comparison-active">
          {analysis.insights.map((insight) => (
            <article className={styles.insightCard} key={insight.key}>
              <span className={styles.insightBadge}>{insight.label}</span>
              <p className={styles.insightText}>{insight.text}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState} data-testid="best-self-comparison-neutral">
          Your wins and losses look similar on this filtered sample. Try a different filter set for clearer contrasts.
        </div>
      )}
    </section>
  );
}
