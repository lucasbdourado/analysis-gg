import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardProvider, useDashboard } from './DashboardContext';
import type { DashboardContextProps } from './DashboardContext';
import { MatchRangeFilter } from '../components/MatchRangeFilter';
import type { MatchSummary } from '../../domain/MatchSummary';

const createMockMatches = (count: number): MatchSummary[] => {
  return Array.from({ length: count }, (_, i) => ({
    matchId: `match-${i}`,
    gameDuration: 1200,
    gameCreation: Date.now() - i * 1000 * 60 * 30,
    queueId: 420,
    win: i % 2 === 0,
    championId: 1,
    championName: 'Champion',
    kills: 5,
    deaths: 3,
    assists: 10,
    totalMinionsKilled: 150,
    neutralMinionsKilled: 20,
  }));
};

// Helper component to extract context values for testing
const ContextConsumer = ({ callback }: { callback: (val: DashboardContextProps) => void }) => {
  const value = useDashboard();
  callback(value);
  return null;
};

describe('DashboardContext Unit & Integration Tests', () => {
  it('should initialize with default values (activeRange = 20) and correct slice length', () => {
    let contextVal!: DashboardContextProps;
    const rawData = createMockMatches(25);
    render(
      <DashboardProvider rawData={rawData}>
        <ContextConsumer callback={(val) => { contextVal = val; }} />
      </DashboardProvider>
    );

    expect(contextVal.activeRange).toBe(20);
    expect(contextVal.rawData).toEqual(rawData);
    expect(contextVal.filteredMatches).toHaveLength(20);
    expect(contextVal.filteredMatches[0].matchId).toBe('match-0');
    expect(contextVal.filteredMatches[19].matchId).toBe('match-19');
  });

  describe('Slicing Logic', () => {
    it('should handle 0 matches correctly', () => {
      let contextVal!: DashboardContextProps;
      render(
        <DashboardProvider rawData={[]}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );
      expect(contextVal.filteredMatches).toHaveLength(0);
    });

    it('should handle fewer matches (15) than default range (20)', () => {
      let contextVal!: DashboardContextProps;
      const rawData = createMockMatches(15);
      render(
        <DashboardProvider rawData={rawData}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );
      expect(contextVal.filteredMatches).toHaveLength(15);
    });

    it('should slice correctly when changing ranges for 35 matches', () => {
      let contextVal!: DashboardContextProps;
      const rawData = createMockMatches(35);
      render(
        <DashboardProvider rawData={rawData}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );

      // Default activeRange = 20
      expect(contextVal.filteredMatches).toHaveLength(20);

      // Change to 50
      act(() => {
        contextVal.setActiveRange(50);
      });
      expect(contextVal.activeRange).toBe(50);
      expect(contextVal.filteredMatches).toHaveLength(35);

      // Change to 100
      act(() => {
        contextVal.setActiveRange(100);
      });
      expect(contextVal.activeRange).toBe(100);
      expect(contextVal.filteredMatches).toHaveLength(35);
    });

    it('should slice correctly when changing ranges for 120 matches', () => {
      let contextVal!: DashboardContextProps;
      const rawData = createMockMatches(120);
      render(
        <DashboardProvider rawData={rawData}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );

      // Default activeRange = 20
      expect(contextVal.filteredMatches).toHaveLength(20);

      // Change to 50
      act(() => {
        contextVal.setActiveRange(50);
      });
      expect(contextVal.filteredMatches).toHaveLength(50);

      // Change to 100
      act(() => {
        contextVal.setActiveRange(100);
      });
      expect(contextVal.filteredMatches).toHaveLength(100);
    });
  });

  describe('Dropdown Option Label Formatting and States in MatchRangeFilter', () => {
    it('should disable dropdown and display "No matches available" when rawData is empty', () => {
      render(
        <DashboardProvider rawData={[]}>
          <MatchRangeFilter />
        </DashboardProvider>
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select).toBeDisabled();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('No matches available');
    });

    it('should format labels correctly for 15 matches (fewer than all range options)', () => {
      render(
        <DashboardProvider rawData={createMockMatches(15)}>
          <MatchRangeFilter />
        </DashboardProvider>
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select).not.toBeDisabled();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Last 20 (15 available)');
      expect(options[1]).toHaveTextContent('Last 50 (15 available)');
      expect(options[2]).toHaveTextContent('Last 100 (15 available)');
    });

    it('should format labels correctly for 35 matches (between 20 and 50)', () => {
      render(
        <DashboardProvider rawData={createMockMatches(35)}>
          <MatchRangeFilter />
        </DashboardProvider>
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select).not.toBeDisabled();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Last 20');
      expect(options[1]).toHaveTextContent('Last 50 (35 available)');
      expect(options[2]).toHaveTextContent('Last 100 (35 available)');
    });

    it('should format labels correctly for 120 matches (exceeds all range options)', () => {
      render(
        <DashboardProvider rawData={createMockMatches(120)}>
          <MatchRangeFilter />
        </DashboardProvider>
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select).not.toBeDisabled();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Last 20');
      expect(options[1]).toHaveTextContent('Last 50');
      expect(options[2]).toHaveTextContent('Last 100');
    });
  });

  describe('User Interaction & State Change via MatchRangeFilter', () => {
    it('should update context state and sliced matches when user changes select option', () => {
      let contextVal!: DashboardContextProps;
      const rawData = createMockMatches(75);

      render(
        <DashboardProvider rawData={rawData}>
          <MatchRangeFilter />
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );

      // Verify initial state
      expect(contextVal.activeRange).toBe(20);
      expect(contextVal.filteredMatches).toHaveLength(20);

      // Select "50" in the dropdown
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: '50' } });

      // Verify updated state
      expect(contextVal.activeRange).toBe(50);
      expect(contextVal.filteredMatches).toHaveLength(50);

      // Select "100" in the dropdown
      fireEvent.change(select, { target: { value: '100' } });

      // Verify updated state
      expect(contextVal.activeRange).toBe(100);
      expect(contextVal.filteredMatches).toHaveLength(75); // only 75 available
    });
  });

  describe('Match Type / Queue Filtering Logic', () => {
    const createMixedMockMatches = (): MatchSummary[] => {
      // 0: match-0, queueId: 420 (Solo/Duo)
      // 1: match-1, queueId: 440 (Flex)
      // 2: match-2, queueId: 400 (Normal)
      // 3: match-3, queueId: 450 (ARAM)
      // 4: match-4, queueId: 0   (Custom)
      // 5: match-5, queueId: 430 (Normal)
      const queueIds = [420, 440, 400, 450, 0, 430];
      return queueIds.map((queueId, i) => ({
        matchId: `match-${i}`,
        gameDuration: 1200,
        gameCreation: Date.now() - i * 1000 * 60 * 30,
        queueId,
        win: i % 2 === 0,
        championId: 1,
        championName: 'Champion',
        kills: 5,
        deaths: 3,
        assists: 10,
        totalMinionsKilled: 150,
        neutralMinionsKilled: 20,
      }));
    };

    it('should initialize selectedQueues as an empty array', () => {
      let contextVal!: DashboardContextProps;
      render(
        <DashboardProvider rawData={[]}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );
      expect(contextVal.selectedQueues).toEqual([]);
    });

    it('should toggle queues in selectedQueues correctly', () => {
      let contextVal!: DashboardContextProps;
      render(
        <DashboardProvider rawData={[]}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );

      act(() => {
        contextVal.toggleQueueFilter('SOLO_DUO');
      });
      expect(contextVal.selectedQueues).toEqual(['SOLO_DUO']);

      act(() => {
        contextVal.toggleQueueFilter('FLEX');
      });
      expect(contextVal.selectedQueues).toEqual(['SOLO_DUO', 'FLEX']);

      act(() => {
        contextVal.toggleQueueFilter('SOLO_DUO');
      });
      expect(contextVal.selectedQueues).toEqual(['FLEX']);
    });

    it('should filter matches by selected queue type', () => {
      let contextVal!: DashboardContextProps;
      const rawData = createMixedMockMatches();
      render(
        <DashboardProvider rawData={rawData} activeRange={20}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );

      // Default: show all 6 matches
      expect(contextVal.filteredMatches).toHaveLength(6);

      // Filter by Solo/Duo (queue 420)
      act(() => {
        contextVal.toggleQueueFilter('SOLO_DUO');
      });
      expect(contextVal.filteredMatches).toHaveLength(1);
      expect(contextVal.filteredMatches[0].matchId).toBe('match-0');
      expect(contextVal.filteredMatches[0].queueId).toBe(420);
    });

    it('should filter matches by multiple selected queue types combined', () => {
      let contextVal!: DashboardContextProps;
      const rawData = createMixedMockMatches();
      render(
        <DashboardProvider rawData={rawData} activeRange={20}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );

      // Filter by Solo/Duo (420) and Flex (440)
      act(() => {
        contextVal.toggleQueueFilter('SOLO_DUO');
      });
      act(() => {
        contextVal.toggleQueueFilter('FLEX');
      });

      expect(contextVal.filteredMatches).toHaveLength(2);
      const matchIds = contextVal.filteredMatches.map(m => m.matchId);
      expect(matchIds).toContain('match-0');
      expect(matchIds).toContain('match-1');
    });

    it('should handle normal queue types correctly (multiple sub-queues)', () => {
      let contextVal!: DashboardContextProps;
      const rawData = createMixedMockMatches();
      render(
        <DashboardProvider rawData={rawData} activeRange={20}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );

      // Filter by Normal (400 and 430)
      act(() => {
        contextVal.toggleQueueFilter('NORMAL');
      });

      expect(contextVal.filteredMatches).toHaveLength(2);
      const matchIds = contextVal.filteredMatches.map(m => m.matchId);
      expect(matchIds).toContain('match-2'); // 400
      expect(matchIds).toContain('match-5'); // 430
    });

    it('should apply queue filtering before activeRange slicing', () => {
      let contextVal!: DashboardContextProps;
      const rawData = createMixedMockMatches();
      render(
        <DashboardProvider rawData={rawData} activeRange={2}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );

      // If we filter by NORMAL, we should get matches matching NORMAL first, then sliced to activeRange.
      // NORMAL has match-2 (index 2) and match-5 (index 5).
      act(() => {
        contextVal.toggleQueueFilter('NORMAL');
      });

      expect(contextVal.filteredMatches).toHaveLength(2);
      const matchIds = contextVal.filteredMatches.map(m => m.matchId);
      expect(matchIds).toEqual(['match-2', 'match-5']);
    });
  });

  describe('Role Filtering Logic', () => {
    const createRoleMockMatches = (): MatchSummary[] => {
      // 0: match-0, position: TOP
      // 1: match-1, position: JUNGLE
      // 2: match-2, position: MIDDLE
      // 3: match-3, position: BOTTOM
      // 4: match-4, position: UTILITY
      // 5: match-5, position: NONE
      const positions = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY', 'NONE'];
      return positions.map((pos, i) => ({
        matchId: `match-${i}`,
        gameDuration: 1200,
        gameCreation: Date.now() - i * 1000 * 60 * 30,
        queueId: 420,
        win: i % 2 === 0,
        championId: 1,
        championName: 'Champion',
        kills: 5,
        deaths: 3,
        assists: 10,
        totalMinionsKilled: 150,
        neutralMinionsKilled: 20,
        teamPosition: pos,
      }));
    };

    it('should initialize selectedRole as null and roleFilteredMatches as filteredMatches', () => {
      let contextVal!: DashboardContextProps;
      const rawData = createRoleMockMatches();
      render(
        <DashboardProvider rawData={rawData}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );
      expect(contextVal.selectedRole).toBeNull();
      expect(contextVal.roleFilteredMatches).toHaveLength(6);
    });

    it('should filter matches by selected role and allow clearing it', () => {
      let contextVal!: DashboardContextProps;
      const rawData = createRoleMockMatches();
      render(
        <DashboardProvider rawData={rawData}>
          <ContextConsumer callback={(val) => { contextVal = val; }} />
        </DashboardProvider>
      );

      // Select 'Top'
      act(() => {
        contextVal.setSelectedRole('Top');
      });
      expect(contextVal.selectedRole).toBe('Top');
      expect(contextVal.roleFilteredMatches).toHaveLength(1);
      expect(contextVal.roleFilteredMatches[0].matchId).toBe('match-0');

      // Select 'Jungle'
      act(() => {
        contextVal.setSelectedRole('Jungle');
      });
      expect(contextVal.selectedRole).toBe('Jungle');
      expect(contextVal.roleFilteredMatches).toHaveLength(1);
      expect(contextVal.roleFilteredMatches[0].matchId).toBe('match-1');

      // Select 'Mid'
      act(() => {
        contextVal.setSelectedRole('Mid');
      });
      expect(contextVal.selectedRole).toBe('Mid');
      expect(contextVal.roleFilteredMatches).toHaveLength(1);
      expect(contextVal.roleFilteredMatches[0].matchId).toBe('match-2');

      // Select 'Bot'
      act(() => {
        contextVal.setSelectedRole('Bot');
      });
      expect(contextVal.selectedRole).toBe('Bot');
      expect(contextVal.roleFilteredMatches).toHaveLength(1);
      expect(contextVal.roleFilteredMatches[0].matchId).toBe('match-3');

      // Select 'Support'
      act(() => {
        contextVal.setSelectedRole('Support');
      });
      expect(contextVal.selectedRole).toBe('Support');
      expect(contextVal.roleFilteredMatches).toHaveLength(1);
      expect(contextVal.roleFilteredMatches[0].matchId).toBe('match-4');

      // Clear selection
      act(() => {
        contextVal.setSelectedRole(null);
      });
      expect(contextVal.selectedRole).toBeNull();
      expect(contextVal.roleFilteredMatches).toHaveLength(6);
    });
  });
});
