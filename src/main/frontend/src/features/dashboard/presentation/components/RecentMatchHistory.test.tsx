import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RecentMatchHistory } from './RecentMatchHistory';
import type { MatchSummary } from '../../domain/MatchSummary';
import styles from './RecentMatchHistory.module.css';

const createMatch = (overrides: Partial<MatchSummary> = {}): MatchSummary => ({
  matchId: `match-${Math.random()}`,
  gameDuration: 1812,
  gameCreation: new Date('2026-06-08T12:00:00.000Z').getTime(),
  queueId: 420,
  win: true,
  championId: 1,
  championName: 'Aatrox',
  kills: 10,
  deaths: 2,
  assists: 6,
  totalMinionsKilled: 181,
  neutralMinionsKilled: 7,
  ...overrides,
});

describe('RecentMatchHistory', () => {
  const formatDate = (date: Date) =>
    date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  it('renders an empty state when there are no matches', () => {
    render(<RecentMatchHistory matches={[]} />);

    expect(screen.getByRole('region', { name: 'Recent match history' })).toBeInTheDocument();
    expect(screen.getByText('No matches available for the selected filters.')).toBeInTheDocument();
    expect(screen.queryByTestId('recent-match-history-list')).not.toBeInTheDocument();
  });

  it('renders matches in newest-first order', () => {
    const oldest = createMatch({
      matchId: 'oldest',
      championName: 'Garen',
      gameCreation: new Date('2026-06-08T10:00:00.000Z').getTime(),
      queueId: 440,
      win: false,
      kills: 4,
      deaths: 8,
      assists: 2,
      totalMinionsKilled: 97,
      neutralMinionsKilled: 4,
    });
    const newest = createMatch({
      matchId: 'newest',
      championName: 'Ahri',
      gameCreation: new Date('2026-06-08T14:30:00.000Z').getTime(),
      queueId: 420,
      win: true,
      kills: 11,
      deaths: 1,
      assists: 9,
      totalMinionsKilled: 173,
      neutralMinionsKilled: 10,
    });

    const { container } = render(<RecentMatchHistory matches={[oldest, newest]} />);

    const items = Array.from(container.querySelectorAll('[data-testid="recent-match-history-item"]'));
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Ahri');
    expect(items[1]).toHaveTextContent('Garen');
  });

  it('shows compact match details for a single entry', () => {
    const match = createMatch({
      gameCreation: new Date('2026-06-08T14:30:00.000Z').getTime(),
      queueId: 420,
      win: true,
      championName: 'Lux',
      kills: 7,
      deaths: 3,
      assists: 11,
      totalMinionsKilled: 162,
      neutralMinionsKilled: 14,
      gameDuration: 1599,
    });

    render(<RecentMatchHistory matches={[match]} />);

    expect(screen.getByText('Win')).toBeInTheDocument();
    expect(screen.getByText('Lux')).toBeInTheDocument();
    expect(screen.getByTitle('Ranked Solo/Duo')).toHaveTextContent('Solo/Duo');
    expect(screen.getByText(formatDate(new Date('2026-06-08T14:30:00.000Z')))).toBeInTheDocument();
    expect(screen.getByText('26m 39s')).toBeInTheDocument();
    expect(screen.getByText('KDA')).toBeInTheDocument();
    expect(screen.getByText('7/3/11')).toBeInTheDocument();
    expect(screen.getByText('CS')).toBeInTheDocument();
    expect(screen.getByText('176 CS')).toBeInTheDocument();
  });

  it('marks very short matches as remakes with a blue rail', () => {
    const remake = createMatch({
      matchId: 'remake',
      championName: 'Sona',
      gameCreation: new Date('2026-06-08T15:00:00.000Z').getTime(),
      queueId: 420,
      win: false,
      gameDuration: 540,
    });

    const { container } = render(<RecentMatchHistory matches={[remake]} />);
    const item = container.querySelector('[data-testid="recent-match-history-item"]');
    const rail = item?.querySelector(`.${styles.outcomeRail}`);

    expect(screen.getByText('Remake')).toBeInTheDocument();
    expect(item).toHaveClass(styles.item);
    expect(rail).toHaveClass(styles.outcomeRail);
    expect(rail).toHaveClass(styles.remakeRail);
  });
});
