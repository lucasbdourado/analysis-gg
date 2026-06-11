import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeekdayWinRateChart } from './WeekdayWinRateChart';
import { DashboardProvider } from '../context/DashboardContext';
import type { MatchSummary } from '../../domain/MatchSummary';

// Dynamic mock properties for Tooltip
let mockTooltipProps = {
  active: false,
  payload: [] as any[],
  label: '',
};

// Mock Recharts
vi.mock('recharts', async () => {
  const React = await import('react');
  return {
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    BarChart: ({ children, data }: any) => (
      <div data-testid="bar-chart" data-data={JSON.stringify(data)}>
        {children}
      </div>
    ),
    XAxis: (props: any) => <div data-testid="xAxis" data-props={JSON.stringify(props)} />,
    YAxis: () => <div />,
    Tooltip: ({ content }: any) => {
      if (React.isValidElement(content)) {
        return React.cloneElement(content, mockTooltipProps as any);
      }
      return null;
    },
    CartesianGrid: () => <div />,
    Bar: ({ children }: any) => <div data-testid="bar-element">{children}</div>,
    Cell: ({ fill, onClick, ...props }: any) => (
      <button
        data-testid="bar-cell"
        data-fill={fill}
        onClick={onClick}
        {...props}
      />
    ),
  };
});

describe('WeekdayWinRateChart Component Tests', () => {
  beforeEach(() => {
    // Reset mock tooltip properties
    mockTooltipProps = {
      active: false,
      payload: [],
      label: '',
    };
  });

  // Timezone-independent match generator
  const createLocalMatch = (dayOfWeek: number, win: boolean): MatchSummary => {
    const date = new Date();
    date.setHours(12, 0, 0, 0); // avoid midnight transitions
    const currentDay = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = dayOfWeek - currentDay;
    date.setDate(date.getDate() + diff);

    return {
      matchId: `match-${dayOfWeek}-${Math.random()}`,
      gameDuration: 1200,
      gameCreation: date.getTime(),
      queueId: 420,
      win,
      championId: 1,
      championName: 'Champion',
      kills: 5,
      deaths: 3,
      assists: 10,
      totalMinionsKilled: 150,
      neutralMinionsKilled: 20,
    };
  };

  it('should render empty state when no matches are provided', () => {
    render(
      <DashboardProvider rawData={[]}>
        <WeekdayWinRateChart />
      </DashboardProvider>
    );

    expect(screen.getByText('No match records to display.')).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });

  it('should group and sort matches from Monday to Sunday correctly', () => {
    const matches: MatchSummary[] = [
      // Sunday (day 0): 2 wins, 1 loss (67%)
      createLocalMatch(0, true),
      createLocalMatch(0, true),
      createLocalMatch(0, false),

      // Monday (day 1): 2 wins, 0 losses (100%)
      createLocalMatch(1, true),
      createLocalMatch(1, true),

      // Tuesday (day 2): 1 win, 1 loss (50%)
      createLocalMatch(2, true),
      createLocalMatch(2, false),

      // Wednesday (day 3): 1 win, 2 losses (33%)
      createLocalMatch(3, true),
      createLocalMatch(3, false),
      createLocalMatch(3, false),

      // Thursday (day 4): 0 wins, 0 losses (0%)

      // Friday (day 5): 3 wins, 1 loss (75%)
      createLocalMatch(5, true),
      createLocalMatch(5, true),
      createLocalMatch(5, true),
      createLocalMatch(5, false),

      // Saturday (day 6): 0 wins, 1 loss (0%)
      createLocalMatch(6, false),
    ];

    render(
      <DashboardProvider rawData={matches}>
        <WeekdayWinRateChart />
      </DashboardProvider>
    );

    expect(screen.queryByText('No match records to display.')).not.toBeInTheDocument();
    const chartEl = screen.getByTestId('bar-chart');
    const data = JSON.parse(chartEl.getAttribute('data-data') || '[]');

    expect(data).toHaveLength(7);
    
    // Monday (Index 0)
    expect(data[0].dayName).toBe('Monday');
    expect(data[0].wins).toBe(2);
    expect(data[0].losses).toBe(0);
    expect(data[0].winRate).toBe(100);

    // Tuesday (Index 1)
    expect(data[1].dayName).toBe('Tuesday');
    expect(data[1].wins).toBe(1);
    expect(data[1].losses).toBe(1);
    expect(data[1].winRate).toBe(50);

    // Wednesday (Index 2)
    expect(data[2].dayName).toBe('Wednesday');
    expect(data[2].wins).toBe(1);
    expect(data[2].losses).toBe(2);
    expect(data[2].winRate).toBe(33);

    // Thursday (Index 3)
    expect(data[3].dayName).toBe('Thursday');
    expect(data[3].wins).toBe(0);
    expect(data[3].losses).toBe(0);
    expect(data[3].winRate).toBe(0);

    // Friday (Index 4)
    expect(data[4].dayName).toBe('Friday');
    expect(data[4].wins).toBe(3);
    expect(data[4].losses).toBe(1);
    expect(data[4].winRate).toBe(75);

    // Saturday (Index 5)
    expect(data[5].dayName).toBe('Saturday');
    expect(data[5].wins).toBe(0);
    expect(data[5].losses).toBe(1);
    expect(data[5].winRate).toBe(0);

    // Sunday (Index 6)
    expect(data[6].dayName).toBe('Sunday');
    expect(data[6].wins).toBe(2);
    expect(data[6].losses).toBe(1);
    expect(data[6].winRate).toBe(67);
  });

  describe('Custom Tooltip Rendering', () => {
    it('should return null when tooltip is not active', () => {
      mockTooltipProps = {
        active: false,
        label: 'Monday',
        payload: [],
      };

      const matches = [createLocalMatch(1, true)];
      const { container } = render(
        <DashboardProvider rawData={matches}>
          <WeekdayWinRateChart />
        </DashboardProvider>
      );

      // Tooltip is inactive, so tooltipContainer class shouldn't be rendered.
      expect(container.querySelector('[class*="tooltipContainer"]')).toBeNull();
    });

    it('should render tooltip with correct win rate percentage and counts when matches exist', () => {
      mockTooltipProps = {
        active: true,
        label: 'Monday',
        payload: [
          {
            payload: {
              dayName: 'Monday',
              winRate: 75,
              wins: 3,
              losses: 1,
            },
          },
        ],
      };

      const matches = [createLocalMatch(1, true)];
      render(
        <DashboardProvider rawData={matches}>
          <WeekdayWinRateChart />
        </DashboardProvider>
      );

      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText(/Win Rate:/i)).toBeInTheDocument();
      expect(screen.getByText(/3W - 1L/i)).toBeInTheDocument();
    });

    it('should render "No games played" when no games were played on that day', () => {
      mockTooltipProps = {
        active: true,
        label: 'Thursday',
        payload: [
          {
            payload: {
              dayName: 'Thursday',
              winRate: 0,
              wins: 0,
              losses: 0,
            },
          },
        ],
      };

      const matches = [createLocalMatch(1, true)];
      render(
        <DashboardProvider rawData={matches}>
          <WeekdayWinRateChart />
        </DashboardProvider>
      );

      expect(screen.getByText('Thursday')).toBeInTheDocument();
      expect(screen.getByText('No games played')).toBeInTheDocument();
    });
  });

  describe('XAxis Configuration', () => {
    it('should configure XAxis with interval={0} to prevent tick label clipping', () => {
      const matches = [createLocalMatch(1, true)];
      render(
        <DashboardProvider rawData={matches}>
          <WeekdayWinRateChart />
        </DashboardProvider>
      );

      const xAxisEl = screen.getByTestId('xAxis');
      const props = JSON.parse(xAxisEl.getAttribute('data-props') || '{}');
      expect(props.interval).toBe(0);
    });
  });

  describe('Interactivity and Cell Selection', () => {
    it('should select weekday when clicking on cell and toggle off on second click', () => {
      const matches = [createLocalMatch(1, true)]; // Monday match
      const { container } = render(
        <DashboardProvider rawData={matches}>
          <WeekdayWinRateChart />
        </DashboardProvider>
      );

      // Verify cells are rendered. Monday is at index 0.
      const cells = screen.getAllByTestId('bar-cell');
      expect(cells).toHaveLength(7);

      // Verify that all cells initially have the standard cyan color
      cells.forEach(cell => {
        expect(cell.getAttribute('data-fill')).toBe('var(--color-cyan-500)');
      });

      // Click the Monday cell
      fireEvent.click(cells[0]);

      // Monday cell should now have the gold color
      expect(cells[0].getAttribute('data-fill')).toBe('var(--color-gold-500)');

      // Other cells should still be cyan
      for (let i = 1; i < 7; i++) {
        expect(cells[i].getAttribute('data-fill')).toBe('var(--color-cyan-500)');
      }

      // Click the Monday cell again to deselect
      fireEvent.click(cells[0]);

      // Monday cell should revert to cyan
      expect(cells[0].getAttribute('data-fill')).toBe('var(--color-cyan-500)');
    });
  });
});
