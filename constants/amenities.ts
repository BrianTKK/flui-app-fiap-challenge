import { Ionicons } from '@expo/vector-icons';

export type IoniconName = keyof typeof Ionicons.glyphMap;

/**
 * Fonte unica de verdade para as comodidades: o nome exibido tambem e o
 * identificador usado nos filtros e em `ChargingStation.amenities`.
 */
export const AMENITY_ICONS: Record<string, IoniconName> = {
  Estacionamento: 'car',
  'Wi-Fi': 'wifi',
  Banheiro: 'water',
  'Café': 'cafe',
};

export const AMENITY_OPTIONS = Object.keys(AMENITY_ICONS);

export function getAmenityIcon(amenity: string): IoniconName {
  return AMENITY_ICONS[amenity] ?? 'checkmark';
}
