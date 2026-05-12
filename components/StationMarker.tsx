import { ChargingStation } from '@/constants/mockData';
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

interface StationMarkerProps {
  station: ChargingStation;
  onPress: () => void;
}

export default function StationMarker({ station, onPress }: StationMarkerProps) {
  const totalConnections = station.totalConnections || 0;
  const occupiedConnections = station.occupiedConnections || 0;

  const availableConnections = totalConnections - occupiedConnections;

  let percentage = 0;
  if (totalConnections > 0) {
    percentage = (availableConnections / totalConnections) * 100;
  }

  percentage = Math.max(0, Math.min(100, percentage));

  const isAvailable = availableConnections > 0;
  const color = isAvailable ? Colors.available : Colors.occupied;

  return (
    <Marker
      coordinate={{ latitude: station.latitude, longitude: station.longitude }}
      onPress={onPress}
      // Adicionamos centerOffset para compensar fisicamente o eixo 
      centerOffset={{ x: 0, y: -10 }}
    >
      <View style={styles.container}>
        {/* Box de Fração */}
        <View style={styles.fractionBox}>
          <Text style={styles.fractionText}>
            {availableConnections}/{totalConnections}
          </Text>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>

        {/* Triângulo (Pino do Mapa) com bordas CSS seguras sem dimensões negativas */}
        <View style={[styles.triangle, { borderTopColor: color }]} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // Aumentar o padding garante que o Canvas Android tire o snapshot de todos os pixels da borda
    padding: 0,
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
    borderTopColor: 'red', // será sobrescrito pelo estilo inline
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});
