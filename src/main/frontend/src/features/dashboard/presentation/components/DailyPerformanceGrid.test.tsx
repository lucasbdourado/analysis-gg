import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DailyPerformanceGrid } from './DailyPerformanceGrid';
import { useDashboard } from '../context/DashboardContext';
import type { MatchSummary } from '../../domain/MatchSummary';
import styles from './DailyPerformanceGrid.module.css';

// Mock the useDashboard hook
vi.mock('../context/DashboardContext', () => ({
  useDashboard: vi.fn(),
}));

describe('DailyPerformanceGrid Component Tests', () => {
  // Timezone-independent match generator
  const createMockMatch = (date: Date, win: boolean): MatchSummary => ({
    matchId: `test-${Math.random()}`,
    gameDuration: 1200,
    gameCreation: date.getTime(),
    queueId: 420,
    win,
    championId: 1,
    championName: 'ChampionName',
    kills: 5,
    deaths: 3,
    assists: 10,
    totalMinionsKilled: 150,
    neutralMinionsKilled: 20,
  });

  // Dynamic formatting function matching component options
  const expectedFormat = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  it('should render empty state when no matches are provided', () => {
    vi.mocked(useDashboard).mockReturnValue({
      rawData: [],
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: [],
    });

    render(<DailyPerformanceGrid />);

    expect(screen.getByText('No match records to display.')).toBeInTheDocument();
    expect(screen.queryByText('Recent Daily Performance')).toBeInTheDocument();
  });

  it('should construct a grid of exactly 30 cells ending on the latest match date', () => {
    const latestDate = new Date();
    latestDate.setHours(12, 0, 0, 0); // local midday to prevent transitions

    const matches: MatchSummary[] = [
      createMockMatch(latestDate, true),
    ];

    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
    });

    const { container } = render(<DailyPerformanceGrid />);
    const cells = container.querySelectorAll('[data-tooltip]');
    expect(cells).toHaveLength(30);

    // Last cell represents the latest match
    const lastCell = cells[29];
    const expectedLastDateFormatted = expectedFormat(latestDate);
    expect(lastCell.getAttribute('data-tooltip')).toContain(expectedLastDateFormatted);

    // First cell represents 29 days prior
    const firstCell = cells[0];
    const firstDate = new Date(latestDate);
    firstDate.setDate(latestDate.getDate() - 29);
    const expectedFirstDateFormatted = expectedFormat(firstDate);
    expect(firstCell.getAttribute('data-tooltip')).toContain(expectedFirstDateFormatted);
  });

  it('should group matches on the same local date string together', () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const matches: MatchSummary[] = [
      createMockMatch(today, true),
      createMockMatch(today, false),
      createMockMatch(today, false),
    ];

    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
    });

    const { container } = render(<DailyPerformanceGrid />);
    const cells = container.querySelectorAll('[data-tooltip]');
    expect(cells).toHaveLength(30);

    // The last cell (today) should contain the aggregated record of "1W - 2L"
    const todayCell = cells[29];
    const expectedTodayFormatted = expectedFormat(today);
    expect(todayCell.getAttribute('data-tooltip')).toContain(`${expectedTodayFormatted}: 1W - 2L`);
  });

  it('should assign correct status classes for different match records', () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const dayMinus1 = new Date(today);
    dayMinus1.setDate(today.getDate() - 1);

    const dayMinus2 = new Date(today);
    dayMinus2.setDate(today.getDate() - 2);

    const matches: MatchSummary[] = [
      // Day 0: 2 wins -> win
      createMockMatch(today, true),
      createMockMatch(today, true),

      // Day -1: 2 losses -> loss
      createMockMatch(dayMinus1, false),
      createMockMatch(dayMinus1, false),

      // Day -2: 1 win, 1 loss -> tie
      createMockMatch(dayMinus2, true),
      createMockMatch(dayMinus2, false),
    ];

    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
    });

    const { container } = render(<DailyPerformanceGrid />);
    const cells = container.querySelectorAll('[data-tooltip]');
    expect(cells).toHaveLength(30);

    // Day 0 (index 29) -> win status
    const cellToday = cells[29];
    expect(cellToday).toHaveClass(styles.win);
    expect(cellToday).not.toHaveClass(styles.loss);
    expect(cellToday).not.toHaveClass(styles.tie);
    expect(cellToday).not.toHaveClass(styles.none);

    // Day -1 (index 28) -> loss status
    const cellMinus1 = cells[28];
    expect(cellMinus1).toHaveClass(styles.loss);
    expect(cellMinus1).not.toHaveClass(styles.win);
    expect(cellMinus1).not.toHaveClass(styles.tie);
    expect(cellMinus1).not.toHaveClass(styles.none);

    // Day -2 (index 27) -> tie status
    const cellMinus2 = cells[27];
    expect(cellMinus2).toHaveClass(styles.tie);
    expect(cellMinus2).not.toHaveClass(styles.win);
    expect(cellMinus2).not.toHaveClass(styles.loss);
    expect(cellMinus2).not.toHaveClass(styles.none);

    // Day -3 (index 26) -> none status
    const cellMinus3 = cells[26];
    expect(cellMinus3).toHaveClass(styles.none);
    expect(cellMinus3).not.toHaveClass(styles.win);
    expect(cellMinus3).not.toHaveClass(styles.loss);
    expect(cellMinus3).not.toHaveClass(styles.tie);
  });

  it('should render tooltip attributes in correct formats', () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const dayMinus1 = new Date(today);
    dayMinus1.setDate(today.getDate() - 1);

    const dayMinus2 = new Date(today);
    dayMinus2.setDate(today.getDate() - 2);

    const dayMinus3 = new Date(today);
    dayMinus3.setDate(today.getDate() - 3);

    const matches: MatchSummary[] = [
      // Today: Winning Day (1W - 0L)
      createMockMatch(today, true),

      // Day -1: Losing Day (0W - 1L)
      createMockMatch(dayMinus1, false),

      // Day -2: Even Record (1W - 1L)
      createMockMatch(dayMinus2, true),
      createMockMatch(dayMinus2, false),
    ];

    vi.mocked(useDashboard).mockReturnValue({
      rawData: matches,
      activeRange: 20,
      setActiveRange: vi.fn(),
      filteredMatches: matches,
    });

    const { container } = render(<DailyPerformanceGrid />);
    const cells = container.querySelectorAll('[data-tooltip]');
    expect(cells).toHaveLength(30);

    // Today (index 29) -> Winning Day
    const tooltipToday = cells[29].getAttribute('data-tooltip');
    expect(tooltipToday).toBe(`${expectedFormat(today)}: 1W - 0L (Winning Day)`);

    // Day -1 (index 28) -> Losing Day
    const tooltipMinus1 = cells[28].getAttribute('data-tooltip');
    expect(tooltipMinus1).toBe(`${expectedFormat(dayMinus1)}: 0W - 1L (Losing Day)`);

    // Day -2 (index 27) -> Even Record
    const tooltipMinus2 = cells[27].getAttribute('data-tooltip');
    expect(tooltipMinus2).toBe(`${expectedFormat(dayMinus2)}: 1W - 1L (Even Record)`);

    // Day -3 (index 26) -> No games played
    const tooltipMinus3 = cells[26].getAttribute('data-tooltip');
    expect(tooltipMinus3).toBe(`${expectedFormat(dayMinus3)}: No games played`);
  });
});
