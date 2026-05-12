import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { darkMapStyle } from '@/constants/mapStyle';
import { stations, ChargingStation } from '@/constants/mockData';
import StationMarker from './StationMarker';
import SearchBar from './ui/SearchBar';
import StationBentoContent from './StationBentoContent';

const { width } = Dimensions.get('window');

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

  const handleMarkerPress = useCallback((station: ChargingStation) => {
    setSelectedStation(station);
    bottomSheetRef.current?.snapToIndex(0);
    mapRef.current?.animateToRegion({
      latitude: station.latitude - 0.008,
      longitude: station.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }, 500);
  }, []);

  const handleNavigate = useCallback(async (station: ChargingStation) => {
    const { latitude, longitude } = station;
    const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;
    const googleUrl = `google.navigation:q=${latitude},${longitude}`;
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    try {
      const canOpenWaze = await Linking.canOpenURL(wazeUrl);
      if (canOpenWaze) {
        await Linking.openURL(wazeUrl);
        return;
      }
      const canOpenGoogle = await Linking.canOpenURL(googleUrl);
      if (canOpenGoogle) {
        await Linking.openURL(googleUrl);
        return;
      }
      await Linking.openURL(webUrl);
    } catch {
      Alert.alert(
        'Navegação',
        'Não foi possível abrir o app de navegação. Verifique se o Waze ou Google Maps está instalado.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  const handleStationDetails = useCallback((station: ChargingStation) => {
    bottomSheetRef.current?.close();
    router.push(`/station/${station.id}`);
  }, [router]);

  const filteredStations = stations.filter(s =>
    searchText === '' || s.name.toLowerCase().includes(searchText.toLowerCase())
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

      {/* Floating Search Area */}
      <SearchBar searchText={searchText} setSearchText={setSearchText} />

      {/* Bottom Sheet - Station Preview */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['55%']}
        enablePanDownToClose
        bottomInset={90} // Empurra o BottomSheet para cima do TabBar
        backgroundStyle={styles.bottomSheetBg}
        handleIndicatorStyle={styles.bottomSheetHandle}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selectedStation && (
            <StationBentoContent
              station={selectedStation}
              onNavigate={() => handleNavigate(selectedStation)}
              onDetails={() => handleStationDetails(selectedStation)}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // Markers
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  markerPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search
  searchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  logo: {
    ...Typography.titleLarge,
    color: Colors.primary,
    textShadowColor: Colors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom Sheet
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
    paddingBottom: 100,
    gap: Spacing.lg,
  },

  // Sheet Header
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sheetHeaderLeft: { flex: 1, gap: 4 },
  sheetTitle: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
  },
  sheetSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  infoText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  infoTextMuted: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  favoriteBtn: {
    padding: Spacing.sm,
  },

  // Bento Grid
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  bentoCard: {
    backgroundColor: Colors.surfaceLow,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
    overflow: 'hidden',
  },
  bentoHalf: {
    flex: 1,
    minWidth: (width - 60) / 2 - 4,
  },
  bentoFull: {
    width: '100%',
  },
  bentoLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bentoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bentoValue: {
    ...Typography.headingMedium,
    color: Colors.textPrimary,
  },
  bentoPriceUnit: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  bentoPriceValue: {
    ...Typography.bodyLarge,
    color: Colors.primary,
    fontFamily: 'Inter_700Bold',
  },
  bentoAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.available,
    borderTopLeftRadius: BorderRadius.md,
    borderBottomLeftRadius: BorderRadius.md,
  },
  connectorsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  connectorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    gap: 4,
  },
  connectorText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },

  // Action Button
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 56,
    gap: Spacing.sm,
    shadowColor: '#00FF66',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  actionButtonText: {
    ...Typography.headingMedium,
    color: Colors.background,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  detailsLinkText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
  },
});
