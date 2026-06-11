import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
    render(
      <MemoryRouter>
        <RecentMatchHistory matches={[]} />
      </MemoryRouter>
    );

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

    const { container } = render(
      <MemoryRouter>
        <RecentMatchHistory matches={[oldest, newest]} />
      </MemoryRouter>
    );

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

    render(
      <MemoryRouter>
        <RecentMatchHistory matches={[match]} />
      </MemoryRouter>
    );

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

    const { container } = render(
      <MemoryRouter>
        <RecentMatchHistory matches={[remake]} />
      </MemoryRouter>
    );
    const item = container.querySelector('[data-testid="recent-match-history-item"]');
    const rail = item?.querySelector(`.${styles.outcomeRail}`);

    expect(screen.getByText('Remake')).toBeInTheDocument();
    expect(item).toHaveClass(styles.item);
    expect(rail).toHaveClass(styles.outcomeRail);
    expect(rail).toHaveClass(styles.remakeRail);
  });

  it('should limit list to 5 matches by default and expand on show more click', () => {
    const matches = [
      createMatch({ matchId: 'm1', championName: 'Aatrox', gameCreation: 600 }),
      createMatch({ matchId: 'm2', championName: 'Ahri', gameCreation: 500 }),
      createMatch({ matchId: 'm3', championName: 'Lux', gameCreation: 400 }),
      createMatch({ matchId: 'm4', championName: 'Zac', gameCreation: 300 }),
      createMatch({ matchId: 'm5', championName: 'Zed', gameCreation: 200 }),
      createMatch({ matchId: 'm6', championName: 'Sona', gameCreation: 100 }),
    ];

    const { container } = render(
      <MemoryRouter>
        <RecentMatchHistory matches={matches} />
      </MemoryRouter>
    );

    // Initially, only 5 matches are shown
    const itemsBefore = container.querySelectorAll('[data-testid="recent-match-history-item"]');
    expect(itemsBefore).toHaveLength(5);
    expect(screen.queryByText('Sona')).not.toBeInTheDocument();

    // Click Show More
    const showMoreButton = screen.getByRole('button', { name: 'Show More' });
    expect(showMoreButton).toBeInTheDocument();
    fireEvent.click(showMoreButton);

    // Now all 6 are shown
    const itemsAfter = container.querySelectorAll('[data-testid="recent-match-history-item"]');
    expect(itemsAfter).toHaveLength(6);
    expect(screen.queryByText('Sona')).toBeInTheDocument();

    // Click Show Less
    const showLessButton = screen.getByRole('button', { name: 'Show Less' });
    expect(showLessButton).toBeInTheDocument();
    fireEvent.click(showLessButton);

    // Back to 5
    const itemsFinal = container.querySelectorAll('[data-testid="recent-match-history-item"]');
    expect(itemsFinal).toHaveLength(5);
    expect(screen.queryByText('Sona')).not.toBeInTheDocument();
  });
});
