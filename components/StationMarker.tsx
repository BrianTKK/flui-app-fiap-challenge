import { ChargingStation } from '@/constants/mockData';
import { Colors } from '@/constants/theme';
import {
  getAvailabilityPercentage,
  getAvailableConnections,
  getTotalConnections,
} from '@/lib/stations';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

interface StationMarkerProps {
  station: ChargingStation;
  onPress: () => void;
}

export default function StationMarker({ station, onPress }: StationMarkerProps) {
  const total = getTotalConnections(station);
  const available = getAvailableConnections(station);
  const percentage = getAvailabilityPercentage(station);
  const isAvailable = available > 0;
  const statusColor = isAvailable ? Colors.available : Colors.occupied;

  // Extrai a potência do mock (suporta number, string ou connectors)
  const power = (station as any).power ?? 
    (station.connectors?.length ? Math.max(...station.connectors.map((c: any) => c.powerKW || 0)) : 50);

  return (
    <Marker
      coordinate={{ latitude: station.latitude, longitude: station.longitude }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: -10 }}
      tracksViewChanges={false}
      accessibilityRole="button"
      accessibilityLabel={`Eletroposto ${station.name}, potência de ${power} quilowatts, ${available} de ${total} conectores livres.`}
    >
      <View style={styles.container}>
        {/* Caixa Principal com Potência e Disponibilidade */}
        <View style={[styles.mainBadge, { borderColor: statusColor }]}>
          <View style={styles.badgeTopRow}>
            <Ionicons name="flash" size={11} color={statusColor} />
            <Text style={styles.powerText}>{power}k</Text>
            <View style={styles.divider} />
            <Text style={[styles.fractionText, { color: statusColor }]}>
              {available}/{total}
            </Text>
          </View>

          {/* Mini barra de ocupação */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${percentage}%`, backgroundColor: statusColor },
              ]}
            />
          </View>
        </View>

        {/* Ponta do Pino */}
        <View style={[styles.triangle, { borderTopColor: statusColor }]} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  badgeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  powerText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  divider: {
    width: 1,
    height: 9,
    backgroundColor: '#334155',
    marginHorizontal: 2,
  },
  fractionText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  progressBarBg: {
    width: '100%',
    height: 3,
    backgroundColor: '#1E293B',
    marginTop: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 5,
    borderRightWidth: 4.5,
    borderBottomWidth: 0,
    borderLeftWidth: 4.5,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});