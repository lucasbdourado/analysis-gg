import { createContext } from 'react';
import { MatchSummary } from '../../domain/MatchSummary';

export interface DashboardContextProps {
  rawData: MatchSummary[];
  activeRange: number;
  setActiveRange: (range: number) => void;
  filteredMatches: MatchSummary[];
}

export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);
