import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SessionReview } from './SessionReview';
import { useDashboard } from '../context/DashboardContext';
import type { MatchSummary } from '../../domain/MatchSummary';

vi.mock('../context/DashboardContext', () => ({
  useDashboard: vi.fn(),
}));

describe('SessionReview Component Tests', () => {
  const createMockMatch = (overrides: Partial<MatchSummary> = {}): MatchSummary => ({
    matchId: `test-${Math.random()}`,
    gameDuration: 1800,
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

  const setupMockMatches = (matches: MatchSummary[]) => {
    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
      selectedQueues: [],
      toggleQueueFilter: vi.fn(),
      selectedRoles: [],
      setSelectedRoles: vi.fn(),
      roleSelectorMatches: matches,
      selectedWeekdays: [],
      setSelectedWeekdays: vi.fn(),
      weekdaySelectorMatches: matches,
      selectedDates: [],
      setSelectedDates: vi.fn(),
      dateSelectorMatches: matches,
      combinedFilteredMatches: matches,
    });
  };

  it('should render empty state when matches are less than 5', () => {
    const matches = Array(4).fill(null).map(() => createMockMatch());
    setupMockMatches(matches);

    render(<SessionReview />);

    expect(screen.getByText('Not enough matches to generate a session review.')).toBeInTheDocument();
    expect(screen.queryByText('Session Review')).not.toBeInTheDocument();
    expect(screen.getByTestId('session-review-empty')).toBeInTheDocument();
  });

  it('should render active state when matches are 5 or more', () => {
    const matches = [
      createMockMatch({ championName: 'Aatrox', win: true, kills: 2, deaths: 2, assists: 2 }),
      createMockMatch({ championName: 'Aatrox', win: true, kills: 2, deaths: 2, assists: 2 }),
      createMockMatch({ championName: 'Aatrox', win: true, kills: 2, deaths: 2, assists: 2 }),
      createMockMatch({ championName: 'Aatrox', win: false, kills: 2, deaths: 2, assists: 2 }),
      createMockMatch({ championName: 'Aatrox', win: false, kills: 2, deaths: 2, assists: 2 }),
    ];
    setupMockMatches(matches);

    render(<SessionReview />);

    expect(screen.getByText('Session Review')).toBeInTheDocument();
    expect(screen.getByText('Matches')).toBeInTheDocument();
    expect(screen.getByText('Win Rate')).toBeInTheDocument();
    expect(screen.getByText('Best Champion')).toBeInTheDocument();
    expect(screen.getByText('Worst Match')).toBeInTheDocument();

    // 5 matches, 3 wins, 2 losses -> 60% win rate
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3W - 2L')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('Avg Deaths: 2.0')).toBeInTheDocument();
  });

  it('should aggregate best champion using deterministic sorting', () => {
    // We want to verify tie breaking: Win Rate desc, then total games played desc, then avg KDA desc, then alphabetical asc
    const matches = [
      // Lux: 1 game, 1 win -> 100% win rate, games: 1, KDA: Perfect (5/0/5) -> 10.0
      createMockMatch({ championName: 'Lux', win: true, kills: 5, deaths: 0, assists: 5 }),
      // Jhin: 2 games, 2 wins -> 100% win rate, games: 2, KDA: Perfect (2/0/2) -> 4.0
      createMockMatch({ championName: 'Jhin', win: true, kills: 2, deaths: 0, assists: 2 }),
      createMockMatch({ championName: 'Jhin', win: true, kills: 2, deaths: 0, assists: 2 }),
      // Aatrox: 2 games, 1 win -> 50% win rate
      createMockMatch({ championName: 'Aatrox', win: true }),
      createMockMatch({ championName: 'Aatrox', win: false }),
    ];
    setupMockMatches(matches);

    render(<SessionReview />);

    // Jhin has 100% win rate and 2 games played. Lux has 100% win rate and 1 game played.
    // Jhin should win because gamesPlayed (2) > gamesPlayed (1) even though Lux has a higher KDA.
    expect(screen.getByText('Jhin')).toBeInTheDocument();
  });

  it('should aggregate best champion alphabetical tie-breaker', () => {
    const matches = [
      // Zed: 1 game, 1 win
      createMockMatch({ championName: 'Zed', win: true, kills: 1, deaths: 1, assists: 1 }),
      // Ahri: 1 game, 1 win
      createMockMatch({ championName: 'Ahri', win: true, kills: 1, deaths: 1, assists: 1 }),
      // Need 5 matches to active
      createMockMatch({ championName: 'Bardo', win: false }),
      createMockMatch({ championName: 'Bardo', win: false }),
      createMockMatch({ championName: 'Bardo', win: false }),
    ];
    setupMockMatches(matches);

    render(<SessionReview />);

    // Ahri and Zed are tied on win rate (100%), games played (1), KDA (2).
    // Ahri should win due to alphabetical sorting.
    expect(screen.getByText('Ahri')).toBeInTheDocument();
  });

  it('should identify the worst match based on KDA (with high deaths as tie-breaker)', () => {
    const matches = [
      // KDA = (1+2)/1 = 3
      createMockMatch({ championName: 'Yasuo', win: false, kills: 1, deaths: 1, assists: 2 }),
      // KDA = (0+0)/8 = 0
      createMockMatch({ championName: 'Yasuo', win: false, kills: 0, deaths: 8, assists: 0 }),
      // KDA = (0+0)/9 = 0 -> Worst KDA (tied) but higher deaths (9 > 8)
      createMockMatch({ championName: 'Teemo', win: false, kills: 0, deaths: 9, assists: 0 }),
      createMockMatch({ championName: 'Yasuo', win: true }),
      createMockMatch({ championName: 'Yasuo', win: true }),
    ];
    setupMockMatches(matches);

    render(<SessionReview />);

    // Should display Teemo match as worst match because of lowest KDA (0) and higher deaths (9)
    expect(screen.getByText('0/9/0 on Teemo')).toBeInTheDocument();
  });

  it('should trigger win rate >= 60% and matches < 10 recommendation (moderated tone)', () => {
    const matches = Array(6).fill(null).map(() => createMockMatch({ championName: 'Aatrox', win: true }));
    setupMockMatches(matches);

    render(<SessionReview />);

    expect(screen.getByText(/Solid start! Keep practicing Aatrox/)).toBeInTheDocument();
  });

  it('should trigger win rate >= 60% and matches >= 10 recommendation', () => {
    const matches = Array(12).fill(null).map(() => createMockMatch({ championName: 'Aatrox', win: true }));
    setupMockMatches(matches);

    render(<SessionReview />);

    expect(screen.getByText(/You're on a roll! Keep playing Aatrox/)).toBeInTheDocument();
  });

  it('should trigger win rate < 45% and matches < 10 recommendation (moderated tone)', () => {
    const matches = Array(6).fill(null).map(() => createMockMatch({ championName: 'Aatrox', win: false }));
    setupMockMatches(matches);

    render(<SessionReview />);

    expect(screen.getByText(/A few tough games recently. Consider reviewing your positioning/)).toBeInTheDocument();
  });

  it('should trigger win rate < 45% and matches >= 10 recommendation with worst match champion name', () => {
    const matches = Array(10).fill(null).map((_, idx) => 
      createMockMatch({ 
        championName: idx === 0 ? 'Yasuo' : 'Aatrox', 
        win: false,
        kills: idx === 0 ? 0 : 2,
        deaths: idx === 0 ? 10 : 2,
        assists: idx === 0 ? 0 : 2,
      })
    );
    setupMockMatches(matches);

    render(<SessionReview />);

    expect(screen.getByText(/Take a break or review your positioning. Focus on reducing deaths, particularly in games like your Yasuo./)).toBeInTheDocument();
  });

  it('should trigger average deaths >= 7 and matches < 10 recommendation', () => {
    // Win rate is 50% (not >= 60%, not < 45%), deaths = 8 (avg deaths >= 7)
    const matches = [
      createMockMatch({ championName: 'Aatrox', win: true, deaths: 8 }),
      createMockMatch({ championName: 'Aatrox', win: true, deaths: 8 }),
      createMockMatch({ championName: 'Aatrox', win: true, deaths: 8 }),
      createMockMatch({ championName: 'Aatrox', win: false, deaths: 8 }),
      createMockMatch({ championName: 'Aatrox', win: false, deaths: 8 }),
      createMockMatch({ championName: 'Aatrox', win: false, deaths: 8 }),
    ];
    setupMockMatches(matches);

    render(<SessionReview />);

    expect(screen.getByText(/Try to prioritize survival in your next games/)).toBeInTheDocument();
  });

  it('should trigger average deaths >= 7 and matches >= 10 recommendation', () => {
    const matches = Array(10).fill(null).map((_, idx) => 
      createMockMatch({ 
        championName: 'Aatrox', 
        win: idx < 5,
        deaths: 8,
      })
    );
    setupMockMatches(matches);

    render(<SessionReview />);

    expect(screen.getByText(/Focus on map awareness and survival. High average deaths are holding back your matches./)).toBeInTheDocument();
  });

  it('should trigger default recommendation when other rules do not match', () => {
    // Win rate = 50%, Average deaths = 2
    const matches = [
      createMockMatch({ championName: 'Aatrox', win: true, deaths: 2 }),
      createMockMatch({ championName: 'Aatrox', win: true, deaths: 2 }),
      createMockMatch({ championName: 'Aatrox', win: true, deaths: 2 }),
      createMockMatch({ championName: 'Aatrox', win: false, deaths: 2 }),
      createMockMatch({ championName: 'Aatrox', win: false, deaths: 2 }),
      createMockMatch({ championName: 'Aatrox', win: false, deaths: 2 }),
    ];
    setupMockMatches(matches);

    render(<SessionReview />);

    expect(screen.getByText(/Analyze your matches to find consistent patterns/)).toBeInTheDocument();
  });

  it('should render fallback circular placeholder on image load error', () => {
    const matches = Array(5).fill(null).map(() => createMockMatch({ championName: 'Aatrox' }));
    setupMockMatches(matches);

    render(<SessionReview />);

    const img = screen.getByAltText('Aatrox') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(screen.queryByTestId('fallback-Aatrox')).not.toBeInTheDocument();

    // Trigger image error
    fireEvent.error(img);

    expect(screen.getByTestId('fallback-Aatrox')).toBeInTheDocument();
    expect(screen.getByTestId('fallback-Aatrox').textContent).toBe('A');
    expect(screen.queryByAltText('Aatrox')).not.toBeInTheDocument();
  });
});
