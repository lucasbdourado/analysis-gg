import React, { createContext, useState, useMemo, useContext } from 'react';
import type { ReactNode } from 'react';
import type { MatchSummary } from '../../domain/MatchSummary';

export interface DashboardContextProps {
  rawData: MatchSummary[];
  activeRange: number;
  setActiveRange: (range: number) => void;
  filteredMatches: MatchSummary[];
  selectedQueues: string[];
  toggleQueueFilter: (queueKey: string) => void;
}

export interface DashboardProviderProps {
  rawData?: MatchSummary[];
  activeRange?: number;
  setActiveRange?: (range: number) => void;
  children: ReactNode;
}

export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

const QUEUE_MAP: Record<string, number[]> = {
  SOLO_DUO: [420],
  FLEX: [440],
  NORMAL: [400, 430, 490],
  ARAM: [450],
  CUSTOM: [0]
};

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ 
  rawData = [], 
  activeRange: propActiveRange,
  setActiveRange: propSetActiveRange,
  children 
}) => {
  const [localActiveRange, localSetActiveRange] = useState<number>(20);
  const [selectedQueues, setSelectedQueues] = useState<string[]>([]);

  const activeRange = propActiveRange !== undefined ? propActiveRange : localActiveRange;
  const setActiveRange = propSetActiveRange !== undefined ? propSetActiveRange : localSetActiveRange;

  const toggleQueueFilter = (queueKey: string) => {
    setSelectedQueues(prev => 
      prev.includes(queueKey) 
        ? prev.filter(k => k !== queueKey) 
        : [...prev, queueKey]
    );
  };

  const filteredMatches = useMemo(() => {
    const data = rawData || [];
    const sliced = data.slice(0, Math.min(data.length, activeRange));
    if (selectedQueues.length === 0) {
      return sliced;
    }
    const targetQueueIds = selectedQueues.flatMap(q => QUEUE_MAP[q] || []);
    return sliced.filter(match => targetQueueIds.includes(match.queueId));
  }, [rawData, activeRange, selectedQueues]);

  return (
    <DashboardContext.Provider value={{ 
      rawData: rawData || [], 
      activeRange, 
      setActiveRange, 
      filteredMatches, 
      selectedQueues, 
      toggleQueueFilter 
    }}>
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

