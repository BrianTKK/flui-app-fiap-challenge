import { ChargingStation, ConnectorType } from '@/constants/mockData';

/**
 * Conectores livres da estacao. E a unica fonte de verdade sobre
 * disponibilidade - nenhuma tela deve guardar um booleano separado.
 * Os valores sao normalizados para tolerar dados inconsistentes da API.
 */
export function getAvailableConnections(station: ChargingStation): number {
  const total = Math.max(0, station.totalConnections ?? 0);
  const occupied = Math.min(Math.max(0, station.occupiedConnections ?? 0), total);
  return total - occupied;
}

export function getTotalConnections(station: ChargingStation): number {
  return Math.max(0, station.totalConnections ?? 0);
}

export function isStationAvailable(station: ChargingStation): boolean {
  return getAvailableConnections(station) > 0;
}

/** Percentual de conectores livres (0-100), pronto para uso em barras de progresso. */
export function getAvailabilityPercentage(station: ChargingStation): number {
  const total = getTotalConnections(station);
  if (total === 0) return 0;
  return (getAvailableConnections(station) / total) * 100;
}

export interface StationFilters {
  connectors: ConnectorType[];
  minPower: number;
  availableOnly: boolean;
  amenities: string[];
}

export const DEFAULT_FILTERS: StationFilters = {
  connectors: [],
  minPower: 0,
  availableOnly: false,
  amenities: [],
};

/** Quantos grupos de filtro estao ativos - usado no badge da lupa. */
export function countActiveFilters(filters: StationFilters): number {
  return (
    (filters.connectors.length > 0 ? 1 : 0) +
    (filters.minPower > 0 ? 1 : 0) +
    (filters.availableOnly ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0)
  );
}

export function filterStations(
  list: ChargingStation[],
  search: string,
  filters: StationFilters = DEFAULT_FILTERS
): ChargingStation[] {
  const term = search.trim().toLowerCase();

  return list.filter(station => {
    if (
      term !== '' &&
      !station.name.toLowerCase().includes(term) &&
      !station.address.toLowerCase().includes(term)
    ) {
      return false;
    }

    if (filters.availableOnly && !isStationAvailable(station)) return false;

    if (station.power < filters.minPower) return false;

    if (
      filters.connectors.length > 0 &&
      !filters.connectors.some(c => station.connectors.includes(c))
    ) {
      return false;
    }

    if (
      filters.amenities.length > 0 &&
      !filters.amenities.every(a => station.amenities.includes(a))
    ) {
      return false;
    }

    return true;
  });
}
