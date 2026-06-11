import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MatchQueueFilter } from './MatchQueueFilter';
import { DashboardContext } from '../context/DashboardContext';
import type { DashboardContextProps } from '../context/DashboardContext';

describe('MatchQueueFilter Component Tests', () => {
  const defaultContextProps: DashboardContextProps = {
    rawData: [],
    activeRange: 20,
    setActiveRange: vi.fn(),
    filteredMatches: [],
    selectedQueues: [],
    toggleQueueFilter: vi.fn(),
    selectedRole: null,
    setSelectedRole: vi.fn(),
    roleFilteredMatches: [],
  };

  const renderWithContext = (contextProps: Partial<DashboardContextProps>) => {
    return render(
      <DashboardContext.Provider value={{ ...defaultContextProps, ...contextProps }}>
        <MatchQueueFilter />
      </DashboardContext.Provider>
    );
  };

  it('should render all 5 queue buttons', () => {
    renderWithContext({ rawData: Array(5).fill({}) as any });

    expect(screen.getByText('Solo/Duo')).toBeInTheDocument();
    expect(screen.getByText('Flex')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('ARAM')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('should disable all buttons when rawData is empty', () => {
    renderWithContext({ rawData: [] });

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('should highlight active filters based on selectedQueues', () => {
    renderWithContext({
      rawData: [{} as any],
      selectedQueues: ['SOLO_DUO', 'ARAM'],
    });

    const soloBtn = screen.getByTestId('filter-btn-solo-duo');
    const aramBtn = screen.getByTestId('filter-btn-aram');
    const flexBtn = screen.getByTestId('filter-btn-flex');

    expect(soloBtn.className).toContain('active');
    expect(aramBtn.className).toContain('active');
    expect(flexBtn.className).not.toContain('active');
  });

  it('should call toggleQueueFilter when a button is clicked', () => {
    const toggleQueueFilterMock = vi.fn();
    renderWithContext({
      rawData: [{} as any],
      toggleQueueFilter: toggleQueueFilterMock,
    });

    const soloBtn = screen.getByText('Solo/Duo');
    fireEvent.click(soloBtn);

    expect(toggleQueueFilterMock).toHaveBeenCalledTimes(1);
    expect(toggleQueueFilterMock).toHaveBeenCalledWith('SOLO_DUO');
  });

  it('should render Reset Filters button when selectedQueues is not empty', () => {
    renderWithContext({
      rawData: [{} as any],
      selectedQueues: [],
    });

    expect(screen.queryByTestId('reset-filters-btn')).not.toBeInTheDocument();

    render(
      <DashboardContext.Provider value={{ ...defaultContextProps, rawData: [{} as any], selectedQueues: ['SOLO_DUO'] }}>
        <MatchQueueFilter />
      </DashboardContext.Provider>
    );

    expect(screen.getByTestId('reset-filters-btn')).toBeInTheDocument();
  });

  it('should call clearQueueFilters when Reset Filters button is clicked', () => {
    const clearQueueFiltersMock = vi.fn();
    renderWithContext({
      rawData: [{} as any],
      selectedQueues: ['SOLO_DUO'],
      clearQueueFilters: clearQueueFiltersMock,
    });

    const resetBtn = screen.getByTestId('reset-filters-btn');
    fireEvent.click(resetBtn);

    expect(clearQueueFiltersMock).toHaveBeenCalledTimes(1);
  });
});
