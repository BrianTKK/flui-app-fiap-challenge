import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { stations, ChargingStation } from '@/constants/mockData';
import SearchBar from './ui/SearchBar';
import StationBentoContent from './StationBentoContent';

const { width, height } = Dimensions.get('window');

// São Paulo center
const MAP_CENTER = { lat: -23.5615, lng: -46.6700 };

/**
 * Generates full Leaflet HTML that is injected into an iframe.
 * Uses CartoDB dark_all tiles for a dark-themed map.
 * Communicates marker clicks back to React Native via postMessage.
 */
function buildMapHTML(filteredStations: ChargingStation[]): string {
  const markersJS = filteredStations
    .map(
      (s) => `
      (function() {
        var s = ${JSON.stringify(s)};
        var totalConnections = s.totalConnections || 0;
        var occupiedConnections = s.occupiedConnections || 0;
        
        // Passo A
        var availableConnections = totalConnections - occupiedConnections;
        
        // Passo B e Validação
        var percentage = 0;
        if (totalConnections > 0) {
          percentage = (availableConnections / totalConnections) * 100;
        }
        percentage = Math.max(0, Math.min(100, percentage));
        
        var hasAvailable = availableConnections > 0;
        var color = hasAvailable ? '#00FF66' : '#FFB4AB';
        
        var icon = L.divIcon({
          className: 'custom-marker',
          html: '<div style="display:flex;flex-direction:column;align-items:center;">'
            + '<div style="background:rgba(20,20,20,0.95);border:1px solid #333;padding:2px 6px;border-radius:4px;display:flex;align-items:center;justify-content:center;">'
            + '<span style="color:#FFF;font-size:11px;font-family:sans-serif;font-weight:bold;">' + availableConnections + '/' + totalConnections + '</span>'
            + '</div>'
            + '<div style="width:30px;height:4px;background:#333;margin-top:2px;border-radius:2px;overflow:hidden;">'
            + '<div style="width:' + percentage + '%;height:100%;background:' + color + ';"></div>'
            + '</div>'
            + '<div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ' + color + ';margin-top:2px;"></div>'
            + '</div>',
          iconSize: [48, 48],
          iconAnchor: [24, 48],
        });
        var marker = L.marker([${s.latitude}, ${s.longitude}], { icon: icon }).addTo(map);
        marker.on('click', function() {
          window.parent.postMessage(JSON.stringify({ type: 'markerPress', stationId: '${s.id}' }), '*');
        });
      })();
    `
    )
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; }
    .custom-marker { background: none !important; border: none !important; }
    .leaflet-control-zoom { display: none; }
    .leaflet-control-attribution { display: none; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      center: [${MAP_CENTER.lat}, ${MAP_CENTER.lng}],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
    ${markersJS}

    // Listen for commands from parent
    window.addEventListener('message', function(e) {
      try {
        var data = JSON.parse(e.data);
        if (data.type === 'flyTo') {
          map.flyTo([data.lat, data.lng], 15, { duration: 0.8 });
        }
      } catch(ex) {}
    });
  </script>
</body>
</html>`;
}

export default function MapScreenWeb() {
  const router = useRouter();
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [searchText, setSearchText] = useState('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const panelAnim = useRef(new Animated.Value(0)).current;

  const filteredStations = stations.filter(
    (s) => searchText === '' || s.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Listen for marker clicks from iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'markerPress') {
          const station = stations.find((s) => s.id === data.stationId);
          if (station) {
            setSelectedStation(station);
            // Fly map to station
            iframeRef.current?.contentWindow?.postMessage(
              JSON.stringify({
                type: 'flyTo',
                lat: station.latitude - 0.005,
                lng: station.longitude,
              }),
              '*'
            );
          }
        }
      } catch {}
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Animate panel in/out
  useEffect(() => {
    Animated.spring(panelAnim, {
      toValue: selectedStation ? 1 : 0,
      useNativeDriver: false,
      tension: 60,
      friction: 12,
    }).start();
  }, [selectedStation]);

  const handleNavigate = useCallback(async (station: ChargingStation) => {
    const { latitude, longitude } = station;
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    await Linking.openURL(webUrl);
  }, []);

  const handleStationDetails = useCallback(
    (station: ChargingStation) => {
      setSelectedStation(null);
      router.push(`/station/${station.id}`);
    },
    [router]
  );

  const closePanel = useCallback(() => {
    setSelectedStation(null);
  }, []);

  const panelTranslateY = panelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  const mapHTML = buildMapHTML(filteredStations);

  return (
    <View style={styles.container}>
      {/* Map iframe */}
      <View style={styles.mapContainer}>
        <iframe
          ref={(ref) => {
            iframeRef.current = ref as any;
          }}
          srcDoc={mapHTML}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          } as any}
          title="Flui Map"
        />
      </View>

      {/* Floating Search Area */}
      <SearchBar searchText={searchText} setSearchText={setSearchText} />

      {/* Station Preview Panel (replaces @gorhom/bottom-sheet on web) */}
      {selectedStation && (
        <Animated.View
          style={[
            styles.panel,
            { transform: [{ translateY: panelTranslateY }] },
          ]}
        >
          <View style={styles.panelHandle}>
            <TouchableOpacity onPress={closePanel} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
            <View style={styles.handleBar} />
          </View>

          <View style={styles.panelScroll}>
            <StationBentoContent
              station={selectedStation}
              onNavigate={() => handleNavigate(selectedStation)}
              onDetails={() => handleStationDetails(selectedStation)}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const PANEL_MAX_WIDTH = 420;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mapContainer: { flex: 1 },

  // Search
  searchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 24,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
    zIndex: 10,
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
    maxWidth: 480,
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

  // Bottom Panel (web replacement for @gorhom/bottom-sheet)
  panel: {
    position: 'absolute',
    bottom: 96, // Ficar acima do custom TabBar (64 de altura + 16 de bottom = 80)
    right: 0,
    left: 0,
    maxHeight: '60%',
    backgroundColor: Colors.surfaceSolid,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderBottomWidth: 0,
    zIndex: 20,
    // Center on wide screens
    ...(width > 768
      ? {
          left: 'auto' as any,
          right: Spacing.xl,
          bottom: 96,
          maxWidth: PANEL_MAX_WIDTH,
          borderRadius: 24,
          borderWidth: 1,
          maxHeight: '80%',
        }
      : {}),
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  panelHandle: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    position: 'relative',
  },
  handleBar: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  closeBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.lg,
    zIndex: 1,
    padding: 4,
  },
  panelScroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },

  // Sheet Header
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.lg,
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
    minWidth: 120,
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
    marginBottom: Spacing.md,
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
    marginBottom: Spacing.xxl,
  },
  detailsLinkText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
  },
});
