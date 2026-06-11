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
  selectedRoles: string[];
  setSelectedRoles: (roles: string[]) => void;
  roleSelectorMatches: MatchSummary[];
  selectedWeekdays: string[];
  setSelectedWeekdays: (days: string[]) => void;
  weekdaySelectorMatches: MatchSummary[];
  selectedDates: string[];
  setSelectedDates: (dates: string[]) => void;
  dateSelectorMatches: MatchSummary[];
  combinedFilteredMatches: MatchSummary[];
}

export interface DashboardProviderProps {
  rawData?: MatchSummary[];
  activeRange?: number;
  setActiveRange?: (range: number) => void;
  selectedQueues?: string[];
  toggleQueueFilter?: (queueKey: string) => void;
  clearQueueFilters?: () => void;
  selectedRoles?: string[];
  setSelectedRoles?: (roles: string[]) => void;
  selectedWeekdays?: string[];
  setSelectedWeekdays?: (days: string[]) => void;
  selectedDates?: string[];
  setSelectedDates?: (dates: string[]) => void;
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

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getMatchDayName = (match: MatchSummary) => {
  const date = new Date(match.gameCreation);
  return DAYS_OF_WEEK[date.getDay()];
};

const getLocalDateString = (timestamp: number) => {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

const isMatchForRoles = (match: MatchSummary, roles: string[]) => {
  if (roles.length === 0) return true;
  return roles.some(role => isMatchForRole(match, role));
};

const isMatchForWeekdays = (match: MatchSummary, weekdays: string[]) => {
  if (weekdays.length === 0) return true;
  return weekdays.includes(getMatchDayName(match));
};

const isMatchForDates = (match: MatchSummary, dates: string[]) => {
  if (dates.length === 0) return true;
  return dates.includes(getLocalDateString(match.gameCreation));
};

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ 
  rawData = [], 
  activeRange: propActiveRange,
  setActiveRange: propSetActiveRange,
  selectedQueues: propSelectedQueues,
  toggleQueueFilter: propToggleQueueFilter,
  clearQueueFilters: propClearQueueFilters,
  selectedRoles: propSelectedRoles,
  setSelectedRoles: propSetSelectedRoles,
  selectedWeekdays: propSelectedWeekdays,
  setSelectedWeekdays: propSetSelectedWeekdays,
  selectedDates: propSelectedDates,
  setSelectedDates: propSetSelectedDates,
  children 
}) => {
  const [localActiveRange, localSetActiveRange] = useState<number>(20);
  const [localSelectedQueues, setLocalSelectedQueues] = useState<string[]>([]);
  const [localSelectedRoles, setLocalSelectedRoles] = useState<string[]>([]);
  const [localSelectedWeekdays, setLocalSelectedWeekdays] = useState<string[]>([]);
  const [localSelectedDates, setLocalSelectedDates] = useState<string[]>([]);

  const activeRange = propActiveRange !== undefined ? propActiveRange : localActiveRange;
  const setActiveRange = propSetActiveRange !== undefined ? propSetActiveRange : localSetActiveRange;

  const selectedQueues = propSelectedQueues !== undefined ? propSelectedQueues : localSelectedQueues;

  const selectedRoles = propSelectedRoles !== undefined ? propSelectedRoles : localSelectedRoles;
  const setSelectedRoles = propSetSelectedRoles !== undefined ? propSetSelectedRoles : setLocalSelectedRoles;

  const selectedWeekdays = propSelectedWeekdays !== undefined ? propSelectedWeekdays : localSelectedWeekdays;
  const setSelectedWeekdays = propSetSelectedWeekdays !== undefined ? propSetSelectedWeekdays : setLocalSelectedWeekdays;

  const selectedDates = propSelectedDates !== undefined ? propSelectedDates : localSelectedDates;
  const setSelectedDates = propSetSelectedDates !== undefined ? propSetSelectedDates : setLocalSelectedDates;

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

  // 1. Filtered by range/queues + selectedWeekdays + selectedDates (for Route Chart)
  const roleSelectorMatches = useMemo(() => {
    return filteredMatches
      .filter(m => isMatchForWeekdays(m, selectedWeekdays))
      .filter(m => isMatchForDates(m, selectedDates));
  }, [filteredMatches, selectedWeekdays, selectedDates]);

  // 2. Filtered by range/queues + selectedRoles + selectedDates (for Weekday Chart)
  const weekdaySelectorMatches = useMemo(() => {
    return filteredMatches
      .filter(m => isMatchForRoles(m, selectedRoles))
      .filter(m => isMatchForDates(m, selectedDates));
  }, [filteredMatches, selectedRoles, selectedDates]);

  // 3. Filtered by range/queues + selectedRoles + selectedWeekdays (for Daily Grid)
  const dateSelectorMatches = useMemo(() => {
    return filteredMatches
      .filter(m => isMatchForRoles(m, selectedRoles))
      .filter(m => isMatchForWeekdays(m, selectedWeekdays));
  }, [filteredMatches, selectedRoles, selectedWeekdays]);

  // 4. Combined Filtered Matches (for Top Champions & Match History)
  const combinedFilteredMatches = useMemo(() => {
    return filteredMatches
      .filter(m => isMatchForRoles(m, selectedRoles))
      .filter(m => isMatchForWeekdays(m, selectedWeekdays))
      .filter(m => isMatchForDates(m, selectedDates));
  }, [filteredMatches, selectedRoles, selectedWeekdays, selectedDates]);

  return (
    <DashboardContext.Provider value={{ 
      rawData: rawData || [], 
      activeRange, 
      setActiveRange, 
      filteredMatches, 
      selectedQueues, 
      toggleQueueFilter,
      clearQueueFilters,
      selectedRoles,
      setSelectedRoles,
      roleSelectorMatches,
      selectedWeekdays,
      setSelectedWeekdays,
      weekdaySelectorMatches,
      selectedDates,
      setSelectedDates,
      dateSelectorMatches,
      combinedFilteredMatches
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

