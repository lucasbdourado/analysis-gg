import React, { createContext, useState, useMemo, useContext } from 'react';
import type { ReactNode } from 'react';
import type { MatchSummary } from '../../domain/MatchSummary';

export interface DashboardContextProps {
  rawData: MatchSummary[];
  activeRange: number;
  setActiveRange: (range: number) => void;
  filteredMatches: MatchSummary[];
}

export interface DashboardProviderProps {
  rawData?: MatchSummary[];
  children: ReactNode;
}

export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ rawData = [], children }) => {
  const [activeRange, setActiveRange] = useState<number>(20);

  const filteredMatches = useMemo(() => {
    const data = rawData || [];
    return data.slice(0, Math.min(data.length, activeRange));
  }, [rawData, activeRange]);

  return (
    <DashboardContext.Provider value={{ rawData: rawData || [], activeRange, setActiveRange, filteredMatches }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextProps => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

