// Mock data simulating API for Flui App

export type ConnectorType = 'CCS2' | 'Type2' | 'CHAdeMO' | 'Tesla';

export const CONNECTOR_TYPES: ConnectorType[] = ['CCS2', 'Type2', 'CHAdeMO', 'Tesla'];

export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  fastCharger: boolean;
  power: number; // kW
  connectors: ConnectorType[];
  occupiedConnections: number;
  totalConnections: number;
  pricePerKwh: number;
  rating: number;
  reviewCount: number;
  distance: string;
  amenities: string[];
  operatingHours: string;
  network: string;
  imageUrl?: string;
}

export interface ChargingHistory {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  duration: string;
  energy: string;
  cost: string;
  address: string;
}

export interface UserProfile {
  name: string;
  email: string;
  vehicleLabel: string;
  vehicleModel: string;
  batteryCapacity: string;
  totalCharges: number;
  totalEnergy: string;
  memberSince: string;
  avatarUrl?: string;
}

// Eletropostos (Localizados em São Paulo - SP)
// A disponibilidade nunca e armazenada: ela e derivada de
// `totalConnections - occupiedConnections` (ver `lib/stations.ts`).
export const stations: ChargingStation[] = [
  {
    id: '1',
    name: 'EletroCharge Paulista',
    address: 'Av. Paulista, 1578 - Bela Vista, SP',
    latitude: -23.5615,
    longitude: -46.6559,
    fastCharger: true,
    power: 150,
    connectors: ['CCS2', 'Type2'],
    occupiedConnections: 0,
    totalConnections: 4,
    pricePerKwh: 1.89,
    rating: 4.7,
    reviewCount: 128,
    distance: '1.2 km',
    amenities: ['Estacionamento', 'Wi-Fi', 'Banheiro'],
    operatingHours: '24h',
    network: 'EletroCharge',
  },
  {
    id: '2',
    name: 'VoltPark Ibirapuera',
    address: 'Av. Pedro Álvares Cabral - Vila Mariana, SP',
    latitude: -23.5874,
    longitude: -46.6576,
    fastCharger: false,
    power: 22,
    connectors: ['Type2'],
    occupiedConnections: 3,
    totalConnections: 4,
    pricePerKwh: 1.29,
    rating: 4.2,
    reviewCount: 67,
    distance: '3.5 km',
    amenities: ['Estacionamento', 'Café'],
    operatingHours: '06:00 - 22:00',
    network: 'VoltPark',
  },
  {
    id: '3',
    name: 'GreenPlug Faria Lima',
    address: 'Av. Faria Lima, 3477 - Itaim Bibi, SP',
    latitude: -23.5862,
    longitude: -46.6823,
    fastCharger: true,
    power: 100,
    connectors: ['CCS2', 'CHAdeMO'],
    occupiedConnections: 3,
    totalConnections: 3,
    pricePerKwh: 2.19,
    rating: 4.5,
    reviewCount: 94,
    distance: '5.1 km',
    amenities: ['Estacionamento', 'Wi-Fi', 'Café', 'Banheiro'],
    operatingHours: '24h',
    network: 'GreenPlug',
  },
  {
    id: '4',
    name: 'EcoVolt Vila Olímpia',
    address: 'R. Funchal, 411 - Vila Olímpia, SP',
    latitude: -23.5959,
    longitude: -46.6868,
    fastCharger: true,
    power: 120,
    connectors: ['CCS2', 'Type2'],
    occupiedConnections: 1,
    totalConnections: 3,
    pricePerKwh: 1.99,
    rating: 4.8,
    reviewCount: 156,
    distance: '6.2 km',
    amenities: ['Estacionamento', 'Wi-Fi', 'Café'],
    operatingHours: '24h',
    network: 'EcoVolt',
  },
  {
    id: '5',
    name: 'SparkCharge Pinheiros',
    address: 'R. dos Pinheiros, 870 - Pinheiros, SP',
    latitude: -23.5670,
    longitude: -46.6919,
    fastCharger: false,
    power: 22,
    connectors: ['Type2'],
    occupiedConnections: 2,
    totalConnections: 2,
    pricePerKwh: 1.49,
    rating: 3.9,
    reviewCount: 42,
    distance: '4.8 km',
    amenities: ['Estacionamento'],
    operatingHours: '07:00 - 23:00',
    network: 'SparkCharge',
  },
  {
    id: '6',
    name: 'PowerUp Moema',
    address: 'Av. Ibirapuera, 2907 - Moema, SP',
    latitude: -23.6024,
    longitude: -46.6651,
    fastCharger: true,
    power: 150,
    connectors: ['CCS2', 'Type2', 'Tesla'],
    occupiedConnections: 2,
    totalConnections: 4,
    pricePerKwh: 2.09,
    rating: 4.6,
    reviewCount: 201,
    distance: '7.3 km',
    amenities: ['Estacionamento', 'Wi-Fi', 'Café', 'Banheiro'],
    operatingHours: '24h',
    network: 'PowerUp',
  },
];

export const chargingHistory: ChargingHistory[] = [
  {
    id: '1',
    stationId: '1',
    stationName: 'EletroCharge Paulista',
    date: '08/05/2026',
    duration: '45 min',
    energy: '38.2 kWh',
    cost: 'R$ 72,20',
    address: 'Av. Paulista, 1578',
  },
  {
    id: '2',
    stationId: '4',
    stationName: 'EcoVolt Vila Olímpia',
    date: '05/05/2026',
    duration: '32 min',
    energy: '28.5 kWh',
    cost: 'R$ 56,72',
    address: 'R. Funchal, 411',
  },
  {
    id: '3',
    stationId: '6',
    stationName: 'PowerUp Moema',
    date: '01/05/2026',
    duration: '55 min',
    energy: '42.1 kWh',
    cost: 'R$ 87,99',
    address: 'Av. Ibirapuera, 2907',
  },
  {
    id: '4',
    stationId: '2',
    stationName: 'VoltPark Ibirapuera',
    date: '28/04/2026',
    duration: '1h 20min',
    energy: '25.8 kWh',
    cost: 'R$ 33,28',
    address: 'Av. Pedro Álvares Cabral',
  },
];

/** IDs das estacoes que ja vem marcadas como favoritas (estado inicial). */
export const savedStations: string[] = ['1', '4', '6'];

export const userProfile: UserProfile = {
  name: 'Carlos Eduardo',
  email: 'carlos.eduardo@email.com',
  vehicleLabel: 'Meu Veículo',
  vehicleModel: 'BYD Dolphin Mini',
  batteryCapacity: '38 kWh',
  totalCharges: 47,
  totalEnergy: '1.2 MWh',
  memberSince: 'Jan 2025',
  avatarUrl: undefined,
};

export const peakHoursData = [
  { hour: '6h', value: 0.2 },
  { hour: '8h', value: 0.3 },
  { hour: '10h', value: 0.45 },
  { hour: '12h', value: 0.6 },
  { hour: '14h', value: 0.8 },
  { hour: '16h', value: 0.95 },
  { hour: '18h', value: 0.7 },
  { hour: '20h', value: 0.5 },
  { hour: '22h', value: 0.3 },
];

export const reviews = [
  {
    id: '1',
    author: 'Ana Silva',
    date: '3 dias atrás',
    rating: 5,
    text: 'Carregamento super rápido. Local bem iluminado e seguro. O café ao lado é ótimo enquanto espera.',
  },
  {
    id: '2',
    author: 'Pedro Luiz',
    date: '1 semana atrás',
    rating: 4,
    text: 'Todas as estações estavam funcionando perfeitamente. Muito fácil de usar.',
  },
];
