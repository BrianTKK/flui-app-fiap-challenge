export interface Connector {
  type: 'Type 2' | 'CCS2' | 'CHAdeMO';
  powerKW: number;
  total: number;
  available: number;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'available' | 'busy' | 'offline';
  connectors: Connector[];
  amenities: ('cafe' | 'wifi' | 'restroom' | 'market')[];
  open24h: boolean;
  quietHours: string;
  rating: number;
}

export const MOCK_STATIONS: Station[] = [
  {
    id: '1',
    name: 'Eletroposto Flui Central - Av. Paulista',
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    latitude: -23.561414,
    longitude: -46.6558819,
    status: 'available',
    connectors: [
      { type: 'CCS2', powerKW: 150, total: 4, available: 3 },
      { type: 'Type 2', powerKW: 22, total: 2, available: 2 },
    ],
    amenities: ['cafe', 'wifi', 'restroom', 'market'],
    open24h: true,
    quietHours: '14:00 às 17:00',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Recarga Rápida Shopping Ibirapuera',
    address: 'Av. Ibirapuera, 3103 - Indianópolis, São Paulo - SP',
    latitude: -23.61019,
    longitude: -46.66699,
    status: 'busy',
    connectors: [
      { type: 'CCS2', powerKW: 120, total: 2, available: 0 },
      { type: 'CHAdeMO', powerKW: 50, total: 1, available: 0 },
    ],
    amenities: ['cafe', 'restroom', 'market'],
    open24h: false,
    quietHours: '10:00 às 12:00',
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Flui Hub Vila Olímpia',
    address: 'Rua Funchal, 200 - Vila Olímpia, São Paulo - SP',
    latitude: -23.5952,
    longitude: -46.6865,
    status: 'available',
    connectors: [
      { type: 'Type 2', powerKW: 43, total: 4, available: 2 },
      { type: 'CCS2', powerKW: 60, total: 2, available: 1 },
    ],
    amenities: ['wifi', 'cafe'],
    open24h: true,
    quietHours: '20:00 às 06:00',
    rating: 4.9,
  },
];