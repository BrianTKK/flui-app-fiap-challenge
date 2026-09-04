import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { savedStations as initialSavedStations } from '@/constants/mockData';
import { DEFAULT_FILTERS, StationFilters } from '@/lib/stations';

interface AppState {
  filters: StationFilters;
  setFilters: (filters: StationFilters) => void;
  resetFilters: () => void;
  savedIds: string[];
  isSaved: (stationId: string) => boolean;
  toggleSaved: (stationId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

/**
 * Estado compartilhado do app (filtros do mapa e favoritos).
 * Em memoria de proposito: o projeto ainda nao tem back-end nem persistencia.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<StationFilters>(DEFAULT_FILTERS);
  const [savedIds, setSavedIds] = useState<string[]>(initialSavedStations);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const isSaved = useCallback(
    (stationId: string) => savedIds.includes(stationId),
    [savedIds]
  );

  const toggleSaved = useCallback((stationId: string) => {
    setSavedIds(prev =>
      prev.includes(stationId) ? prev.filter(id => id !== stationId) : [...prev, stationId]
    );
  }, []);

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters, savedIds, isSaved, toggleSaved }),
    [filters, resetFilters, savedIds, isSaved, toggleSaved]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext precisa estar dentro de <AppProvider>.');
  }
  return context;
}

export function useFilters() {
  const { filters, setFilters, resetFilters } = useAppContext();
  return { filters, setFilters, resetFilters };
}

export function useSavedStations() {
  const { savedIds, isSaved, toggleSaved } = useAppContext();
  return { savedIds, isSaved, toggleSaved };
}
