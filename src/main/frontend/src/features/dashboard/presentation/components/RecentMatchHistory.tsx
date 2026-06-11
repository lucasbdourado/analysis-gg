import { useMemo } from 'react';
import type { MatchSummary } from '../../domain/MatchSummary';
import styles from './RecentMatchHistory.module.css';

const CHAMPION_ASSET_VERSION = '16.11.1';

type RecentMatchHistoryProps = {
  matches: MatchSummary[];
};

type QueueLabel = {
  label: string;
  shortLabel: string;
};

function getQueueLabel(queueId: number): QueueLabel {
  switch (queueId) {
    case 420:
      return { label: 'Ranked Solo/Duo', shortLabel: 'Solo/Duo' };
    case 440:
      return { label: 'Ranked Flex', shortLabel: 'Flex' };
    case 450:
      return { label: 'ARAM', shortLabel: 'ARAM' };
    case 400:
    case 430:
    case 490:
      return { label: 'Normal', shortLabel: 'Normal' };
    case 0:
      return { label: 'Custom', shortLabel: 'Custom' };
    default:
      return { label: `Queue ${queueId}`, shortLabel: `Q${queueId}` };
  }
}

function formatMatchDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatKda(match: MatchSummary): string {
  return `${match.kills}/${match.deaths}/${match.assists}`;
}

function formatCs(match: MatchSummary): string {
  return `${(match.totalMinionsKilled || 0) + (match.neutralMinionsKilled || 0)} CS`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${String(remainingSeconds).padStart(2, '0')}s`;
}

function isRemake(match: MatchSummary): boolean {
  // Riot remakes are very short matches; keep the heuristic local to presentation.
  return match.gameDuration < 600;
}

export function RecentMatchHistory({ matches }: RecentMatchHistoryProps) {
  const recentMatches = useMemo(() => {
    return [...matches].sort((a, b) => b.gameCreation - a.gameCreation);
  }, [matches]);

  const hasMatches = recentMatches.length > 0;

  return (
    <section className={`ds-panel ${styles.historyCard}`} aria-label="Recent match history">
      <div className={styles.header}>
        <div>
          <h3 className={`ds-heading-md ${styles.title}`}>Recent Match History</h3>
          <p className={styles.subtitle}>Latest games from the already loaded match history.</p>
        </div>
        {hasMatches && <span className={styles.count}>{recentMatches.length} matches</span>}
      </div>

      {!hasMatches ? (
        <div className={styles.emptyState}>No matches available for the selected filters.</div>
      ) : (
        <ul className={styles.list} data-testid="recent-match-history-list">
          {recentMatches.map((match) => {
            const matchIsRemake = isRemake(match);
            const outcomeIsWin = match.win;
            const queueLabel = getQueueLabel(match.queueId);
            const outcomeLabel = matchIsRemake ? 'Remake' : outcomeIsWin ? 'Win' : 'Loss';
            const outcomeRailClass = matchIsRemake
              ? styles.remakeRail
              : outcomeIsWin
                ? styles.winRail
                : styles.lossRail;

            return (
              <li
                key={match.matchId}
                className={styles.item}
                data-testid="recent-match-history-item"
              >
                <div className={`${styles.outcomeRail} ${outcomeRailClass}`} aria-hidden="true" />
                <div className={styles.iconFrame}>
                  <img
                    className={styles.championIcon}
                    src={`https://ddragon.leagueoflegends.com/cdn/${CHAMPION_ASSET_VERSION}/img/champion/${match.championName}.png`}
                    alt={match.championName}
                    loading="lazy"
                  />
                </div>
                <div className={styles.matchCore}>
                  <div className={styles.matchTopLine}>
                    <span
                      className={`${styles.outcomeBadge} ${
                        matchIsRemake ? styles.remakeBadge : outcomeIsWin ? styles.winBadge : styles.lossBadge
                      }`}
                    >
                      {outcomeLabel}
                    </span>
                    <span className={styles.championName}>{match.championName}</span>
                  </div>
                  <div className={styles.matchMeta}>
                    <span title={queueLabel.label}>{queueLabel.shortLabel}</span>
                    <span>{formatMatchDate(match.gameCreation)}</span>
                    <span>{formatDuration(match.gameDuration)}</span>
                  </div>
                </div>
                <div className={`${styles.matchStats} ${styles.kdaStats}`}>
                  <span className={styles.statLabel}>KDA</span>
                  <strong className={styles.statValue}>{formatKda(match)}</strong>
                </div>
                <div className={`${styles.matchStats} ${styles.csStats}`}>
                  <span className={styles.statLabel}>CS</span>
                  <strong className={styles.statValue}>{formatCs(match)}</strong>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
