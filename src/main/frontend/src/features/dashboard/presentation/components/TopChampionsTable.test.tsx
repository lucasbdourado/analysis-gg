import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopChampionsTable } from './TopChampionsTable';
import { useDashboard } from '../context/DashboardContext';
import type { MatchSummary } from '../../domain/MatchSummary';
import styles from './TopChampionsTable.module.css';

// Mock the useDashboard hook
vi.mock('../context/DashboardContext', () => ({
  useDashboard: vi.fn(),
}));

describe('TopChampionsTable Component Tests', () => {
  // Helper to create mock matches
  const createMockMatch = (overrides: Partial<MatchSummary> = {}): MatchSummary => ({
    matchId: `test-${Math.random()}`,
    gameDuration: 1800, // 30 minutes
    gameCreation: Date.now(),
    queueId: 420,
    win: true,
    championId: 1,
    championName: 'Aatrox',
    kills: 3,
    deaths: 1,
    assists: 5,
    totalMinionsKilled: 150,
    neutralMinionsKilled: 10,
    ...overrides,
  });

  it('should render empty state when no matches are provided', () => {
    vi.mocked(useDashboard).mockReturnValue({
      rawData: [],
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: [],
      selectedQueues: [],
      toggleQueueFilter: vi.fn(),
    });

    render(<TopChampionsTable />);

    expect(screen.getByText('No champion statistics to display.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should aggregate stats correctly (win rate, KDA, CS/min)', () => {
    const matches: MatchSummary[] = [
      createMockMatch({
        championName: 'Aatrox',
        win: true,
        kills: 3,
        deaths: 1,
        assists: 5,
        totalMinionsKilled: 100,
        neutralMinionsKilled: 20,
        gameDuration: 1200, // 20 mins
      }),
      createMockMatch({
        championName: 'Aatrox',
        win: false,
        kills: 1,
        deaths: 3,
        assists: 1,
        totalMinionsKilled: 80,
        neutralMinionsKilled: 10,
        gameDuration: 1800, // 30 mins
      }),
    ];

    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
      selectedQueues: [],
      toggleQueueFilter: vi.fn(),
    });

    const { container } = render(<TopChampionsTable />);

    // Check Champion info
    expect(screen.getByText('Aatrox')).toBeInTheDocument();

    // Check games played: 2
    const playedCell = container.querySelector(`.${styles.tdCenter}`);
    expect(playedCell?.textContent).toBe('2');

    // Check win rate: 50% (1W - 1L)
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('(1W - 1L)')).toBeInTheDocument();

    // Check KDA: 2.50 (2.0/2.0/3.0)
    // total kills = 4, deaths = 4, assists = 6
    // avg kills/game = 2.0, avg deaths/game = 2.0, avg assists/game = 3.0
    // KDA value = (4+6)/4 = 2.50
    expect(screen.getByText('2.50 (2.0/2.0/3.0)')).toBeInTheDocument();

    // Check CS/min: 4.2
    // total CS = 210, total duration = 3000 sec = 50 mins. 210/50 = 4.2
    expect(screen.getByText('4.2')).toBeInTheDocument();
  });

  it('should format perfect KDA correctly when deaths are 0', () => {
    const matches: MatchSummary[] = [
      createMockMatch({
        championName: 'Jhin',
        win: true,
        kills: 5,
        deaths: 0,
        assists: 5,
        gameDuration: 1200,
      }),
    ];

    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
      selectedQueues: [],
      toggleQueueFilter: vi.fn(),
    });

    render(<TopChampionsTable />);

    expect(screen.getByText('Perfect (5.0/0.0/5.0)')).toBeInTheDocument();
  });

  it('should sort by winRate desc, then gamesPlayed desc, then championName asc by default', () => {
    const matches: MatchSummary[] = [
      // Aatrox: 1 game, 1 win -> 100% win rate
      createMockMatch({ championName: 'Aatrox', win: true }),
      // Ahri: 2 games, 2 wins -> 100% win rate
      createMockMatch({ championName: 'Ahri', win: true }),
      createMockMatch({ championName: 'Ahri', win: true }),
      // Zac: 2 games, 1 win -> 50% win rate
      createMockMatch({ championName: 'Zac', win: true }),
      createMockMatch({ championName: 'Zac', win: false }),
      // Zed: 1 game, 0 wins -> 0% win rate
      createMockMatch({ championName: 'Zed', win: false }),
    ];

    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
      selectedQueues: [],
      toggleQueueFilter: vi.fn(),
    });

    const { container } = render(<TopChampionsTable />);

    const names = Array.from(container.querySelectorAll(`.${styles.championNameText}`)).map(
      (el) => el.textContent
    );

    // Expected default order:
    // 1. Ahri (100% win rate, 2 games) - higher games played tie-breaker
    // 2. Aatrox (100% win rate, 1 game)
    // 3. Zac (50% win rate, 2 games)
    // 4. Zed (0% win rate, 1 game)
    expect(names).toEqual(['Ahri', 'Aatrox', 'Zac', 'Zed']);
  });

  it('should sort interactively when clicking column headers', () => {
    const matches: MatchSummary[] = [
      // Aatrox: 2 games, 1 win (50%), 2 kills, 2 deaths, 2 assists per match -> KDA: 2.00, CS: 100, duration: 1000s -> CS/min = 6.0
      createMockMatch({
        championName: 'Aatrox',
        win: true,
        kills: 2,
        deaths: 2,
        assists: 2,
        totalMinionsKilled: 50,
        neutralMinionsKilled: 0,
        gameDuration: 500,
      }),
      createMockMatch({
        championName: 'Aatrox',
        win: false,
        kills: 2,
        deaths: 2,
        assists: 2,
        totalMinionsKilled: 50,
        neutralMinionsKilled: 0,
        gameDuration: 500,
      }),
      // Bard: 4 games, 3 wins (75%), 1 kill, 1 death, 3 assists per match -> KDA: 4.00, CS: 40, duration: 2000s -> CS/min = 1.2
      createMockMatch({
        championName: 'Bard',
        win: true,
        kills: 1,
        deaths: 1,
        assists: 3,
        totalMinionsKilled: 10,
        neutralMinionsKilled: 0,
        gameDuration: 500,
      }),
      createMockMatch({
        championName: 'Bard',
        win: true,
        kills: 1,
        deaths: 1,
        assists: 3,
        totalMinionsKilled: 10,
        neutralMinionsKilled: 0,
        gameDuration: 500,
      }),
      createMockMatch({
        championName: 'Bard',
        win: true,
        kills: 1,
        deaths: 1,
        assists: 3,
        totalMinionsKilled: 10,
        neutralMinionsKilled: 0,
        gameDuration: 500,
      }),
      createMockMatch({
        championName: 'Bard',
        win: false,
        kills: 1,
        deaths: 1,
        assists: 3,
        totalMinionsKilled: 10,
        neutralMinionsKilled: 0,
        gameDuration: 500,
      }),
      // Caitlyn: 3 games, 1 win (33.3%), 3 kills, 1 death, 1 assist per match -> KDA: 4.00, CS: 300, duration: 1500s -> CS/min = 12.0
      createMockMatch({
        championName: 'Caitlyn',
        win: true,
        kills: 3,
        deaths: 1,
        assists: 1,
        totalMinionsKilled: 100,
        neutralMinionsKilled: 0,
        gameDuration: 500,
      }),
      createMockMatch({
        championName: 'Caitlyn',
        win: false,
        kills: 3,
        deaths: 1,
        assists: 1,
        totalMinionsKilled: 100,
        neutralMinionsKilled: 0,
        gameDuration: 500,
      }),
      createMockMatch({
        championName: 'Caitlyn',
        win: false,
        kills: 3,
        deaths: 1,
        assists: 1,
        totalMinionsKilled: 100,
        neutralMinionsKilled: 0,
        gameDuration: 500,
      }),
    ];

    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
      selectedQueues: [],
      toggleQueueFilter: vi.fn(),
    });

    const { container } = render(<TopChampionsTable />);

    const getRenderedNames = () =>
      Array.from(container.querySelectorAll(`.${styles.championNameText}`)).map((el) => el.textContent);

    // Default sort: winRate desc
    // 1st: Bard (75%)
    // 2nd: Aatrox (50%)
    // 3rd: Caitlyn (33.3%)
    expect(getRenderedNames()).toEqual(['Bard', 'Aatrox', 'Caitlyn']);

    // --- Sort by Champion Name ---
    const headers = container.querySelectorAll('thead th');
    const championHeader = headers[0];
    
    // 1st Click: sort championName asc
    fireEvent.click(championHeader);
    expect(getRenderedNames()).toEqual(['Aatrox', 'Bard', 'Caitlyn']);

    // 2nd Click: sort championName desc
    fireEvent.click(championHeader);
    expect(getRenderedNames()).toEqual(['Caitlyn', 'Bard', 'Aatrox']);

    // 3rd Click: reset to default (winRate desc)
    fireEvent.click(championHeader);
    expect(getRenderedNames()).toEqual(['Bard', 'Aatrox', 'Caitlyn']);

    // --- Sort by Played (gamesPlayed) ---
    const playedHeader = headers[1];

    // 1st Click: sort gamesPlayed desc
    fireEvent.click(playedHeader);
    expect(getRenderedNames()).toEqual(['Bard', 'Caitlyn', 'Aatrox']); // 4, 3, 2

    // 2nd Click: sort gamesPlayed asc
    fireEvent.click(playedHeader);
    expect(getRenderedNames()).toEqual(['Aatrox', 'Caitlyn', 'Bard']); // 2, 3, 4

    // 3rd Click: reset to default (winRate desc)
    fireEvent.click(playedHeader);
    expect(getRenderedNames()).toEqual(['Bard', 'Aatrox', 'Caitlyn']);

    // --- Sort by KDA (kdaValue) ---
    const kdaHeader = headers[3];

    // 1st Click: sort kdaValue desc
    // Bard (4.00) and Caitlyn (4.00) are tied.
    // Tie-breaker: gamesPlayed desc -> Bard (4) > Caitlyn (3) -> Bard, Caitlyn, Aatrox
    fireEvent.click(kdaHeader);
    expect(getRenderedNames()).toEqual(['Bard', 'Caitlyn', 'Aatrox']);

    // 2nd Click: sort kdaValue asc
    // Aatrox (2.00) first.
    // Tie-breaker for Bard and Caitlyn: gamesPlayed desc -> Bard (4) > Caitlyn (3) -> Aatrox, Bard, Caitlyn
    fireEvent.click(kdaHeader);
    expect(getRenderedNames()).toEqual(['Aatrox', 'Bard', 'Caitlyn']);

    // --- Sort by CS/min (csMin) ---
    const csHeader = headers[4];

    // 1st Click: sort csMin desc
    fireEvent.click(csHeader);
    expect(getRenderedNames()).toEqual(['Caitlyn', 'Aatrox', 'Bard']); // 12.0, 6.0, 1.2

    // 2nd Click: sort csMin asc
    fireEvent.click(csHeader);
    expect(getRenderedNames()).toEqual(['Bard', 'Aatrox', 'Caitlyn']); // 1.2, 6.0, 12.0
  });

  it('should render fallback circular placeholder on image error', () => {
    const matches = [createMockMatch({ championName: 'Aatrox' })];

    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
      selectedQueues: [],
      toggleQueueFilter: vi.fn(),
    });

    render(<TopChampionsTable />);

    // Verify image tag exists
    const img = screen.getByAltText('Aatrox') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(screen.queryByTestId('fallback-Aatrox')).not.toBeInTheDocument();

    // Trigger image error
    fireEvent.error(img);

    // Verify fallback circle exists and image is removed
    expect(screen.getByTestId('fallback-Aatrox')).toBeInTheDocument();
    expect(screen.getByTestId('fallback-Aatrox').textContent).toBe('A');
    expect(screen.queryByAltText('Aatrox')).not.toBeInTheDocument();
  });

  it('should apply high win rate style if win rate is >= 60%', () => {
    const matches = [
      // Ahri: 1 game, 1 win -> 100% win rate (>= 60%)
      createMockMatch({ championName: 'Ahri', win: true }),
      // Zac: 1 game, 0 wins -> 0% win rate (< 60%)
      createMockMatch({ championName: 'Zac', win: false }),
    ];

    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
      selectedQueues: [],
      toggleQueueFilter: vi.fn(),
    });

    render(<TopChampionsTable />);

    // Get win rate elements
    const ahriWinRate = screen.getByText('100%');
    const zacWinRate = screen.getByText('0%');

    expect(ahriWinRate).toHaveClass(styles.highWinRate);
    expect(zacWinRate).not.toHaveClass(styles.highWinRate);
  });
});
