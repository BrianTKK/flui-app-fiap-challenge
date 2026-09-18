import { ChargingStation, ConnectorType } from '@/constants/mockData';

/**
 * Conectores livres da estacao. E a unica fonte de verdade sobre
 * disponibilidade - nenhuma tela deve guardar um booleano separado.
 * Os valores sao normalizados para tolerar dados inconsistentes da API.
 */
export function getAvailableConnections(station: ChargingStation): number {
  if (!station) return 0;
  const total = Math.max(0, station.totalConnections ?? 0);
  const occupied = Math.min(Math.max(0, station.occupiedConnections ?? 0), total);
  return total - occupied;
}

export function getTotalConnections(station: ChargingStation): number {
  if (!station) return 0;
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
export function countActiveFilters(filters?: StationFilters): number {
  if (!filters) return 0;
  const connectorsCount = (filters.connectors && filters.connectors.length > 0) ? 1 : 0;
  const powerCount = (filters.minPower && filters.minPower > 0) ? 1 : 0;
  const availableCount = filters.availableOnly ? 1 : 0;
  const amenitiesCount = (filters.amenities && filters.amenities.length > 0) ? 1 : 0;

  return connectorsCount + powerCount + availableCount + amenitiesCount;
}

export function filterStations(
  list: ChargingStation[],
  search: string,
  filters: StationFilters = DEFAULT_FILTERS
): ChargingStation[] {
  if (!list || !Array.isArray(list)) return [];
  const activeFilters = filters || DEFAULT_FILTERS;
  const term = (search || '').trim().toLowerCase();

  return list.filter(station => {
    if (!station) return false;

    // 1. Busca textual por nome ou endereço
    if (term !== '') {
      const name = (station.name || '').toLowerCase();
      const address = (station.address || '').toLowerCase();
      if (!name.includes(term) && !address.includes(term)) {
        return false;
      }
    }

    // 2. Filtro de apenas estações disponíveis
    if (activeFilters.availableOnly && !isStationAvailable(station)) {
      return false;
    }

    // 3. Filtro por potência mínima
    if ((station.power ?? 0) < (activeFilters.minPower ?? 0)) {
      return false;
    }

    // 4. Filtro por conectores selecionados
    if (activeFilters.connectors && activeFilters.connectors.length > 0) {
      const stationConnectors = station.connectors || [];
      const hasMatchingConnector = activeFilters.connectors.some(c => {
        return stationConnectors.some(sc => {
          // Trata tanto se for array de string quanto se for array de objetos { type: 'CCS2' }
          return typeof sc === 'string' ? sc === c : (sc as any)?.type === c;
        });
      });
      if (!hasMatchingConnector) return false;
    }

    // 5. Filtro por comodidades (amenities)
    if (activeFilters.amenities && activeFilters.amenities.length > 0) {
      const stationAmenities = station.amenities || [];
      const hasAllAmenities = activeFilters.amenities.every(a =>
        stationAmenities.includes(a)
      );
      if (!hasAllAmenities) return false;
    }

    return true;
  });
}