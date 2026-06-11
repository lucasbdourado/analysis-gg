import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RouteWinRateChart } from './RouteWinRateChart';
import { DashboardProvider } from '../context/DashboardContext';
import type { MatchSummary } from '../../domain/MatchSummary';

describe('RouteWinRateChart Component Tests', () => {
  const createMockMatch = (teamPosition: string | null | undefined, win: boolean): MatchSummary => {
    return {
      matchId: `match-${teamPosition}-${Math.random()}`,
      gameDuration: 1200,
      gameCreation: Date.now(),
      queueId: 420,
      win,
      championId: 1,
      championName: 'Champion',
      kills: 5,
      deaths: 3,
      assists: 10,
      totalMinionsKilled: 150,
      neutralMinionsKilled: 20,
      teamPosition: teamPosition as string, // Cast for testing null/undefined cases
    };
  };

  it('should render empty state when no matches are provided', () => {
    render(
      <DashboardProvider rawData={[]}>
        <RouteWinRateChart />
      </DashboardProvider>
    );

    expect(screen.getByText('No match records to display.')).toBeInTheDocument();
  });

  it('should render empty state when only non-standard or missing positions are provided', () => {
    const matches = [
      createMockMatch('NONE', true),
      createMockMatch('', false),
      createMockMatch(null, true),
      createMockMatch(undefined, false),
      createMockMatch('ARAM', true),
    ];

    render(
      <DashboardProvider rawData={matches}>
        <RouteWinRateChart />
      </DashboardProvider>
    );

    expect(screen.getByText('No match records to display.')).toBeInTheDocument();
  });

  it('should group, order, and calculate win rates & play rates for standard roles correctly', () => {
    const matches: MatchSummary[] = [
      // Top (TOP): 2 wins, 1 loss (67% win rate, 3 games)
      createMockMatch('TOP', true),
      createMockMatch('top', true),
      createMockMatch('TOP', false),

      // Jungle (JUNGLE): 1 win, 1 loss (50% win rate, 2 games)
      createMockMatch('JUNGLE', true),
      createMockMatch('jungle', false),

      // Mid (MIDDLE): 3 wins, 0 losses (100% win rate, 3 games)
      createMockMatch('MIDDLE', true),
      createMockMatch('middle', true),
      createMockMatch('MIDDLE', true),

      // Bot (BOTTOM): 0 wins, 2 losses (0% win rate, 2 games)
      createMockMatch('BOTTOM', false),
      createMockMatch('bottom', false),

      // Support (UTILITY): 1 win, 3 losses (25% win rate, 4 games)
      createMockMatch('UTILITY', true),
      createMockMatch('utility', false),
      createMockMatch('UTILITY', false),
      createMockMatch('UTILITY', false),

      // Extra non-standard matches to ensure they are ignored
      createMockMatch('NONE', true),
      createMockMatch(null, false),
    ];

    render(
      <DashboardProvider rawData={matches}>
        <RouteWinRateChart />
      </DashboardProvider>
    );

    expect(screen.queryByText('No match records to display.')).not.toBeInTheDocument();

    // Verify correct sorting order by play count descending:
    // Support (4 games), Top (3 games), Mid (3 games), Jungle (2 games), Bot (2 games)
    const roleNames = screen.getAllByText(/^(Top|Jungle|Mid|Bot|Support)$/).map(el => el.textContent);
    expect(roleNames).toEqual(['Support', 'Top', 'Mid', 'Jungle', 'Bot']);

    // Total games count = 4 (Support) + 3 (Top) + 3 (Mid) + 2 (Jungle) + 2 (Bot) = 14 games
    // Support play rate = 4/14 = 29%
    // Top play rate = 3/14 = 21%
    // Mid play rate = 3/14 = 21%
    // Jungle play rate = 2/14 = 14%
    // Bot play rate = 2/14 = 14%

    expect(screen.getByText('4 Games (29%)')).toBeInTheDocument();
    expect(screen.getAllByText('3 Games (21%)')).toHaveLength(2);
    expect(screen.getAllByText('2 Games (14%)')).toHaveLength(2);

    // Verify exact win/loss records
    expect(screen.getByText('1W - 3L')).toBeInTheDocument(); // Support
    expect(screen.getByText('2W - 1L')).toBeInTheDocument(); // Top
    expect(screen.getByText('3W - 0L')).toBeInTheDocument(); // Mid
    expect(screen.getByText('1W - 1L')).toBeInTheDocument(); // Jungle
    expect(screen.getByText('0W - 2L')).toBeInTheDocument(); // Bot

    // Verify win rates are correct
    expect(screen.getByText('25%')).toBeInTheDocument(); // Support
    expect(screen.getByText('67%')).toBeInTheDocument(); // Top
    expect(screen.getByText('100%')).toBeInTheDocument(); // Mid
    expect(screen.getByText('50%')).toBeInTheDocument(); // Jungle
    expect(screen.getByText('0%')).toBeInTheDocument(); // Bot
  });

  it('should highlight win rates >= 60% with highWinRate class', () => {
    const matches: MatchSummary[] = [
      // Top: 2 wins, 1 loss (67% win rate, >= 60% should be highlighted)
      createMockMatch('TOP', true),
      createMockMatch('TOP', true),
      createMockMatch('TOP', false),

      // Jungle: 1 win, 1 loss (50% win rate, < 60% should NOT be highlighted)
      createMockMatch('JUNGLE', true),
      createMockMatch('JUNGLE', false),
    ];

    render(
      <DashboardProvider rawData={matches}>
        <RouteWinRateChart />
      </DashboardProvider>
    );

    const highWinRateLabel = screen.getByText('67%');
    const normalWinRateLabel = screen.getByText('50%');

    expect(highWinRateLabel.className).toContain('highWinRate');
    expect(normalWinRateLabel.className).not.toContain('highWinRate');
  });

  it('should filter out roles with 0 games played', () => {
    const matches: MatchSummary[] = [
      // Top: 1 game
      createMockMatch('TOP', true),
      // Mid: 1 game
      createMockMatch('MIDDLE', false),
      // Other standard roles (Jungle, Bot, Support) have 0 games and should be filtered out
    ];

    render(
      <DashboardProvider rawData={matches}>
        <RouteWinRateChart />
      </DashboardProvider>
    );

    // Only Top and Mid should be present
    const roleNames = screen.getAllByText(/^(Top|Jungle|Mid|Bot|Support)$/).map(el => el.textContent);
    expect(roleNames).toEqual(['Top', 'Mid']);
    expect(screen.queryByText('Jungle')).not.toBeInTheDocument();
    expect(screen.queryByText('Bot')).not.toBeInTheDocument();
    expect(screen.queryByText('Support')).not.toBeInTheDocument();
  });
});
