import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useRouter } from 'expo-router';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Colors, Spacing } from '@/constants/theme';
import { TAB_BAR_SPACE } from '@/constants/layout';
import { darkMapStyle } from '@/constants/mapStyle';
import { stations, ChargingStation } from '@/constants/mockData';
import { filterStations } from '@/lib/stations';
import { openDirections } from '@/lib/directions';
import { useFilters } from '@/context/AppProvider';
import StationMarker from './StationMarker';
import SearchBar from './ui/SearchBar';
import StationBentoContent from './StationBentoContent';

const INITIAL_REGION: Region = {
  latitude: -23.5615,
  longitude: -46.6700,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [searchText, setSearchText] = useState('');
  const { filters } = useFilters();

  const filteredStations = useMemo(
    () => filterStations(stations, searchText, filters),
    [searchText, filters]
  );

  const handleMarkerPress = useCallback((station: ChargingStation) => {
    setSelectedStation(station);
    bottomSheetRef.current?.snapToIndex(0);
    mapRef.current?.animateToRegion(
      {
        latitude: station.latitude - 0.008,
        longitude: station.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500
    );
  }, []);

  const handleStationDetails = useCallback(
    (station: ChargingStation) => {
      bottomSheetRef.current?.close();
      router.push(`/station/${station.id}`);
    },
    [router]
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        customMapStyle={darkMapStyle}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {filteredStations.map((station) => (
          <StationMarker
            key={station.id}
            station={station}
            onPress={() => handleMarkerPress(station)}
          />
        ))}
      </MapView>

      {/* Busca flutuante */}
      <SearchBar searchText={searchText} setSearchText={setSearchText} />

      {/* Bottom Sheet - previa da estacao */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['55%']}
        enablePanDownToClose
        onClose={() => setSelectedStation(null)}
        bottomInset={TAB_BAR_SPACE}
        backgroundStyle={styles.bottomSheetBg}
        handleIndicatorStyle={styles.bottomSheetHandle}
      >
        {/* BottomSheetScrollView (e nao ScrollView) para o scroll interno
            nao brigar com o gesto de arrastar da propria sheet. */}
        <BottomSheetScrollView
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          {selectedStation && (
            <StationBentoContent
              station={selectedStation}
              onNavigate={() => openDirections(selectedStation)}
              onDetails={() => handleStationDetails(selectedStation)}
            />
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  bottomSheetBg: {
    backgroundColor: Colors.surfaceSolid,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  bottomSheetHandle: {
    backgroundColor: Colors.textMuted,
    width: 48,
    height: 4,
  },
  sheetContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
});
