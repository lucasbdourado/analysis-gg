import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { MatchDetailPage } from './MatchDetailPage';
import type { MatchDetail } from '../../domain/MatchDetail';

const { fetchMatchDetailMock } = vi.hoisted(() => ({
  fetchMatchDetailMock: vi.fn(),
}));

vi.mock('../../infrastructure/api/matchDetailApi', () => ({
  fetchMatchDetail: fetchMatchDetailMock,
}));

function createParticipant(overrides: Partial<MatchDetail['participants'][number]> = {}) {
  return {
    puuid: `puuid-${Math.random().toString(36).slice(2)}`,
    gameName: 'Ahri',
    tagLine: 'BR1',
    championId: 103,
    championName: 'Ahri',
    win: true,
    kills: 10,
    deaths: 2,
    assists: 8,
    totalMinionsKilled: 180,
    neutralMinionsKilled: 12,
    teamPosition: 'MIDDLE',
    teamId: 100,
    summoner1Id: 4,
    summoner2Id: 14,
    item0: 6655,
    item1: 3020,
    item2: 4645,
    item3: 3089,
    item4: 3157,
    item5: 1058,
    item6: 3363,
    primaryStyleId: 8000,
    subStyleId: 8100,
    keystoneId: 8112,
    ...overrides,
  };
}

function createMatchDetail(overrides: Partial<MatchDetail> = {}): MatchDetail {
  return {
    matchId: 'BR1_3250888251',
    gameDuration: 1612,
    gameCreation: new Date('2026-06-08T18:30:00.000Z').getTime(),
    queueId: 420,
    win: true,
    championId: 103,
    championName: 'Ahri',
    kills: 10,
    deaths: 2,
    assists: 8,
    totalMinionsKilled: 180,
    neutralMinionsKilled: 12,
    teamPosition: 'MIDDLE',
    participants: [
      createParticipant({ puuid: 'searched-player', gameName: 'Joeyzenhu', tagLine: 'br1' }),
      createParticipant({
        puuid: 'blue-2',
        gameName: 'TopLaner',
        tagLine: 'BR1',
        championName: 'Garen',
        championId: 86,
        teamPosition: 'TOP',
        kills: 6,
        deaths: 4,
        assists: 5,
        item0: 3078,
        item1: 3047,
        item2: 6333,
        item3: 3068,
        item4: 0,
        item5: 0,
        item6: 3340,
      }),
      createParticipant({
        puuid: 'red-1',
        gameName: 'EnemyOne',
        tagLine: 'BR1',
        championName: 'Lux',
        championId: 99,
        teamId: 200,
        win: false,
        kills: 3,
        deaths: 7,
        assists: 11,
        item0: 6656,
        item1: 3165,
        item2: 3135,
        item3: 4628,
        item4: 0,
        item5: 0,
        item6: 3363,
      }),
      createParticipant({
        puuid: 'red-2',
        gameName: 'EnemyTwo',
        tagLine: 'BR1',
        championName: 'Sona',
        championId: 37,
        teamId: 200,
        win: false,
        kills: 1,
        deaths: 8,
        assists: 14,
        item0: 6617,
        item1: 3158,
        item2: 3504,
        item3: 0,
        item4: 0,
        item5: 0,
        item6: 3364,
      }),
    ],
    ...overrides,
  };
}

describe('MatchDetailPage', () => {
  it('renders the match overview with item icons and readable row spacing', async () => {
    fetchMatchDetailMock.mockResolvedValueOnce(createMatchDetail());

    render(
      <MemoryRouter initialEntries={['/match/BR1_3250888251?region=br1&name=Joeyzenhu&tag=br1']}>
        <Routes>
          <Route path="/match/:matchId" element={<MatchDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading match details…')).toBeInTheDocument();

    expect(await screen.findByText('Blue Team')).toBeInTheDocument();
    expect(screen.getByText('Blue Team')).toBeInTheDocument();
    expect(screen.getByText('Red Team')).toBeInTheDocument();
    expect(screen.getByText('Joeyzenhu')).toBeInTheDocument();
    expect(screen.getByText('TopLaner')).toBeInTheDocument();
    expect(screen.getByText('EnemyOne')).toBeInTheDocument();

    const itemIcons = screen.getAllByAltText(/^Item \d+$/);
    expect(itemIcons.length).toBeGreaterThanOrEqual(10);
    expect(screen.getByAltText('Item 6655')).toHaveAttribute(
      'src',
      expect.stringContaining('/img/item/6655.png')
    );

    await waitFor(() => {
      expect(fetchMatchDetailMock).toHaveBeenCalledWith('BR1_3250888251', 'br1', 'Joeyzenhu', 'br1');
    });
  });
});
