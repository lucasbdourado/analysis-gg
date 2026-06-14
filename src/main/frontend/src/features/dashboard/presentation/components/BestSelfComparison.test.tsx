import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { MatchSummary } from '../../domain/MatchSummary';
import { BestSelfComparison } from './BestSelfComparison';

describe('BestSelfComparison', () => {
  const createMockMatch = (overrides: Partial<MatchSummary> = {}): MatchSummary => ({
    matchId: `test-${Math.random()}`,
    gameDuration: 1800,
    gameCreation: Date.now(),
    queueId: 420,
    win: true,
    championId: 1,
    championName: 'Aatrox',
    kills: 4,
    deaths: 2,
    assists: 6,
    totalMinionsKilled: 150,
    neutralMinionsKilled: 10,
    ...overrides,
  });

  it('shows an informative state when the filtered match list is below the minimum threshold', () => {
    const matches = Array.from({ length: 4 }, () => createMockMatch());

    render(<BestSelfComparison matches={matches} />);

    expect(screen.getByText('Best Self Comparison')).toBeInTheDocument();
    expect(screen.getByTestId('best-self-comparison-empty')).toBeInTheDocument();
    expect(
      screen.getByText('Need at least 5 matches to compare wins versus losses reliably.')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('best-self-comparison-active')).not.toBeInTheDocument();
  });

  it('renders the strongest wins-versus-losses differences when enough matches are available', () => {
    const matches: MatchSummary[] = [
      createMockMatch({ win: true, kills: 8, deaths: 1, assists: 10, totalMinionsKilled: 175, neutralMinionsKilled: 15 }),
      createMockMatch({ win: true, kills: 7, deaths: 2, assists: 8, totalMinionsKilled: 168, neutralMinionsKilled: 12 }),
      createMockMatch({ win: true, kills: 6, deaths: 1, assists: 9, totalMinionsKilled: 172, neutralMinionsKilled: 14 }),
      createMockMatch({ win: false, kills: 1, deaths: 7, assists: 2, totalMinionsKilled: 120, neutralMinionsKilled: 8 }),
      createMockMatch({ win: false, kills: 2, deaths: 8, assists: 1, totalMinionsKilled: 115, neutralMinionsKilled: 7 }),
      createMockMatch({ win: false, kills: 0, deaths: 6, assists: 3, totalMinionsKilled: 118, neutralMinionsKilled: 6 }),
    ];

    render(<BestSelfComparison matches={matches} />);

    expect(screen.getByTestId('best-self-comparison-active')).toBeInTheDocument();
    expect(screen.getByText('You die less in wins: 1.3 vs 7.0 deaths per game.')).toBeInTheDocument();
    expect(screen.getByText('Your KDA is higher in wins: 13.5 vs 0.4.')).toBeInTheDocument();
    expect(screen.queryByText(/Need at least 5 matches/)).not.toBeInTheDocument();
  });

  it('recomputes the analysis when the match list changes', () => {
    const initialMatches = Array.from({ length: 4 }, () => createMockMatch());
    const updatedMatches = [
      createMockMatch({ win: true, kills: 5, deaths: 1, assists: 7, totalMinionsKilled: 160, neutralMinionsKilled: 12 }),
      createMockMatch({ win: true, kills: 4, deaths: 2, assists: 6, totalMinionsKilled: 158, neutralMinionsKilled: 10 }),
      createMockMatch({ win: true, kills: 6, deaths: 1, assists: 8, totalMinionsKilled: 162, neutralMinionsKilled: 14 }),
      createMockMatch({ win: false, kills: 1, deaths: 6, assists: 2, totalMinionsKilled: 120, neutralMinionsKilled: 8 }),
      createMockMatch({ win: false, kills: 2, deaths: 7, assists: 1, totalMinionsKilled: 118, neutralMinionsKilled: 6 }),
    ];

    const { rerender } = render(<BestSelfComparison matches={initialMatches} />);

    expect(screen.getByTestId('best-self-comparison-empty')).toBeInTheDocument();

    rerender(<BestSelfComparison matches={updatedMatches} />);

    expect(screen.getByTestId('best-self-comparison-active')).toBeInTheDocument();
    expect(screen.getByText('You die less in wins: 1.3 vs 6.5 deaths per game.')).toBeInTheDocument();
    expect(screen.getByText('Your KDA is higher in wins: 10.3 vs 0.5.')).toBeInTheDocument();
  });
});
