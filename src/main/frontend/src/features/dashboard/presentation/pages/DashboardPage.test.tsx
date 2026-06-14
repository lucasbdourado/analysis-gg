import { render, screen, within, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { DashboardPage } from './DashboardPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.mock('../hooks/usePlayerAnalytics', () => ({
  usePlayerAnalytics: () => ({
    loading: false,
    error: null,
    data: {
      puuid: 'player-puuid',
      gameName: 'Ahri',
      tagLine: 'BR1',
      region: 'br1',
      rankedQueues: {
        soloDuo: {
          queueType: 'RANKED_SOLO_5x5',
          tier: 'GOLD',
          rank: 'II',
          leaguePoints: 37,
          wins: 54,
          losses: 48,
          winRate: 52.9,
        },
        flex: {
          queueType: 'RANKED_FLEX_SR',
          tier: null,
          rank: null,
          leaguePoints: null,
          wins: null,
          losses: null,
          winRate: null,
        },
      },
      matches: [
        {
          matchId: 'match-old',
          gameDuration: 1200,
          gameCreation: new Date('2026-06-08T11:00:00.000Z').getTime(),
          queueId: 420,
          win: false,
          championId: 84,
          championName: 'Akali',
          kills: 4,
          deaths: 5,
          assists: 3,
          totalMinionsKilled: 145,
          neutralMinionsKilled: 12,
        },
      ],
    },
  }),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filters, player profile, and analytics in that order', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard?name=Ahri&tag=BR1&region=br1']}>
        <DashboardPage />
      </MemoryRouter>
    );

    const filters = screen.getByTestId('dashboard-filters');
    const profile = screen.getByTestId('dashboard-profile');
    const analytics = screen.getByTestId('dashboard-analytics');

    expect(filters.compareDocumentPosition(profile) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(profile.compareDocumentPosition(analytics) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const historyRegion = screen.getByRole('region', { name: 'Recent match history' });
    expect(historyRegion).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /best self comparison/i })).toBeInTheDocument();
    expect(within(historyRegion).getByText('Akali')).toBeInTheDocument();
  });

  it('navigates back to account selection screen when clicking the back button', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard?name=Ahri&tag=BR1&region=br1']}>
        <DashboardPage />
      </MemoryRouter>
    );

    const backButton = screen.getByRole('button', { name: /account selection/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
