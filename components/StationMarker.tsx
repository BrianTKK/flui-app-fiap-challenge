import { ChargingStation } from '@/constants/mockData';
import { Colors } from '@/constants/theme';
import {
  getAvailabilityPercentage,
  getAvailableConnections,
  getTotalConnections,
} from '@/lib/stations';
import React from 'react';
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
  const color = available > 0 ? Colors.available : Colors.occupied;

  return (
    <Marker
      coordinate={{ latitude: station.latitude, longitude: station.longitude }}
      onPress={onPress}
      // `anchor` posiciona a ponta do triangulo na coordenada (Android);
      // `centerOffset` faz o mesmo no iOS.
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: -10 }}
    >
      <View style={styles.container}>
        {/* Fracao de conectores livres */}
        <View style={styles.fractionBox}>
          <Text style={styles.fractionText}>
            {available}/{total}
          </Text>
        </View>

        {/* Barra de progresso */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>

        {/* Ponta do pino */}
        <View style={[styles.triangle, { borderTopColor: color }]} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fractionBox: {
    backgroundColor: 'rgba(20,20,20,0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
  },
  fractionText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressBarBg: {
    width: 30,
    height: 4,
    backgroundColor: '#333',
    marginTop: 2,
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
    borderTopWidth: 6,
    borderRightWidth: 5,
    borderBottomWidth: 0,
    borderLeftWidth: 5,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});
