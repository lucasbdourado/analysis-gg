import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccountRankedSummary } from './AccountRankedSummary';
import type { RankedQueues } from '../../infrastructure/api/PlayerAnalyticsResponse';

const rankedQueues: RankedQueues = {
  soloDuo: {
    queueType: 'RANKED_SOLO_5x5',
    tier: 'GOLD',
    rank: 'II',
    leaguePoints: 37,
    wins: 54,
    losses: 48,
    winRate: 54 * 100.0 / 102,
  },
  flex: {
    queueType: 'RANKED_FLEX_SR',
    tier: 'SILVER',
    rank: 'I',
    leaguePoints: 12,
    wins: 10,
    losses: 0,
    winRate: 100,
  },
};

describe('AccountRankedSummary', () => {
  it('renders ranked queue details and the mapped region flag', () => {
    render(
      <AccountRankedSummary
        gameName="Ahri"
        tagLine="BR1"
        region="br1"
        rankedQueues={rankedQueues}
      />
    );

    expect(screen.getByText('Ahri')).toBeInTheDocument();
    expect(screen.getByText('#BR1')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Player profile' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Brazil' })).toBeInTheDocument();
    expect(screen.getByText('Solo/Duo')).toBeInTheDocument();
    expect(screen.getByText('Gold II')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Gold rank emblem' })).toHaveAttribute(
      'src',
      expect.stringMatching(/\/gold\.png$/)
    );
    expect(screen.getByText(/37 LP/)).toBeInTheDocument();
    expect(screen.getByText(/54W 48L/)).toBeInTheDocument();
    expect(screen.getByText(/52.9%/)).toBeInTheDocument();
    expect(screen.getByText('Flex')).toBeInTheDocument();
    expect(screen.getByText('Silver I')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Silver rank emblem' })).toHaveAttribute(
      'src',
      expect.stringMatching(/\/silver\.png$/)
    );
    expect(screen.getByText(/100.0%/)).toBeInTheDocument();
  });

  it('renders missing queues as unranked without LP or win rate', () => {
    render(
      <AccountRankedSummary
        gameName="Faker"
        tagLine="KR1"
        region="kr"
        rankedQueues={{
          soloDuo: {
            queueType: 'RANKED_SOLO_5x5',
            tier: null,
            rank: null,
            leaguePoints: null,
            wins: null,
            losses: null,
            winRate: null,
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
        }}
      />
    );

    expect(screen.getByRole('img', { name: 'Korea' })).toBeInTheDocument();
    expect(screen.getAllByText('Unranked')).toHaveLength(2);
    expect(screen.queryByRole('img', { name: /rank emblem/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/LP/)).not.toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('maps European platforms to the European Union flag label', () => {
    render(
      <AccountRankedSummary
        gameName="Lux"
        tagLine="EUW"
        region="euw1"
        rankedQueues={rankedQueues}
      />
    );

    expect(screen.getByRole('img', { name: 'European Union' })).toBeInTheDocument();
  });
});
