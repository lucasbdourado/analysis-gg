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
  clearQueueFilters?: () => void;
  selectedRole: string | null;
  setSelectedRole: (role: string | null) => void;
  roleFilteredMatches: MatchSummary[];
}

export interface DashboardProviderProps {
  rawData?: MatchSummary[];
  activeRange?: number;
  setActiveRange?: (range: number) => void;
  selectedQueues?: string[];
  toggleQueueFilter?: (queueKey: string) => void;
  clearQueueFilters?: () => void;
  selectedRole?: string | null;
  setSelectedRole?: (role: string | null) => void;
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

const isMatchForRole = (match: MatchSummary, role: string) => {
  const pos = match.teamPosition;
  if (!pos) return false;
  const normalizedPos = pos.toUpperCase();
  if (role === 'Top') return normalizedPos === 'TOP';
  if (role === 'Jungle') return normalizedPos === 'JUNGLE';
  if (role === 'Mid') return normalizedPos === 'MIDDLE';
  if (role === 'Bot') return normalizedPos === 'BOTTOM';
  if (role === 'Support') return normalizedPos === 'UTILITY';
  return false;
};

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ 
  rawData = [], 
  activeRange: propActiveRange,
  setActiveRange: propSetActiveRange,
  selectedQueues: propSelectedQueues,
  toggleQueueFilter: propToggleQueueFilter,
  clearQueueFilters: propClearQueueFilters,
  selectedRole: propSelectedRole,
  setSelectedRole: propSetSelectedRole,
  children 
}) => {
  const [localActiveRange, localSetActiveRange] = useState<number>(20);
  const [localSelectedQueues, setLocalSelectedQueues] = useState<string[]>([]);
  const [localSelectedRole, setLocalSelectedRole] = useState<string | null>(null);

  const activeRange = propActiveRange !== undefined ? propActiveRange : localActiveRange;
  const setActiveRange = propSetActiveRange !== undefined ? propSetActiveRange : localSetActiveRange;

  const selectedQueues = propSelectedQueues !== undefined ? propSelectedQueues : localSelectedQueues;

  const selectedRole = propSelectedRole !== undefined ? propSelectedRole : localSelectedRole;
  const setSelectedRole = propSetSelectedRole !== undefined ? propSetSelectedRole : setLocalSelectedRole;

  const toggleQueueFilter = (queueKey: string) => {
    if (propToggleQueueFilter !== undefined) {
      propToggleQueueFilter(queueKey);
    } else {
      setLocalSelectedQueues(prev => 
         prev.includes(queueKey) 
          ? prev.filter(k => k !== queueKey) 
          : [...prev, queueKey]
      );
    }
  };

  const clearQueueFilters = () => {
    if (propClearQueueFilters !== undefined) {
      propClearQueueFilters();
    } else {
      setLocalSelectedQueues([]);
    }
  };

  const filteredMatches = useMemo(() => {
    const data = rawData || [];
    if (selectedQueues.length === 0) {
      return data.slice(0, Math.min(data.length, activeRange));
    }
    const targetQueueIds = selectedQueues.flatMap(q => QUEUE_MAP[q] || []);
    const filtered = data.filter(match => targetQueueIds.includes(match.queueId));
    return filtered.slice(0, Math.min(filtered.length, activeRange));
  }, [rawData, activeRange, selectedQueues]);

  const roleFilteredMatches = useMemo(() => {
    if (!selectedRole) return filteredMatches;
    return filteredMatches.filter(match => isMatchForRole(match, selectedRole));
  }, [filteredMatches, selectedRole]);

  return (
    <DashboardContext.Provider value={{ 
      rawData: rawData || [], 
      activeRange, 
      setActiveRange, 
      filteredMatches, 
      selectedQueues, 
      toggleQueueFilter,
      clearQueueFilters,
      selectedRole,
      setSelectedRole,
      roleFilteredMatches
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

