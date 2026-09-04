import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { TAB_BAR_SPACE } from '@/constants/layout';
import { stations, ChargingStation } from '@/constants/mockData';
import {
  filterStations,
  getAvailabilityPercentage,
  getAvailableConnections,
  getTotalConnections,
} from '@/lib/stations';
import { openDirections } from '@/lib/directions';
import { useFilters } from '@/context/AppProvider';
import SearchBar from './ui/SearchBar';
import StationBentoContent from './StationBentoContent';

// Centro de Sao Paulo
const MAP_CENTER = { lat: -23.5615, lng: -46.6700 };
const WIDE_SCREEN_BREAKPOINT = 768;
const PANEL_MAX_WIDTH = 420;

/** Serializa dados para dentro de uma tag script sem permitir quebra do HTML. */
function toSafeJSON(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/**
 * Monta o HTML completo do Leaflet injetado no iframe.
 * Usa um basemap escuro sem chave de API e devolve os cliques
 * nos marcadores para o React Native via postMessage.
 */
function buildMapHTML(list: ChargingStation[]): string {
  const markers = list.map((s) => ({
    id: s.id,
    lat: s.latitude,
    lng: s.longitude,
    available: getAvailableConnections(s),
    total: getTotalConnections(s),
    percentage: getAvailabilityPercentage(s),
  }));

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
    /* Escurece o basemap cinza para casar com o tema do app
       (afeta so os tiles, nao os marcadores). */
    .leaflet-tile-pane { filter: brightness(0.42) saturate(0.7); }
    .leaflet-control-zoom { display: none; }
    .leaflet-control-attribution {
      background: rgba(18,18,18,0.7) !important;
      color: #6b7a68 !important;
      font-size: 9px;
      font-family: sans-serif;
    }
    .leaflet-control-attribution a { color: #8aa385 !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      center: [${MAP_CENTER.lat}, ${MAP_CENTER.lng}],
      zoom: 13,
      zoomControl: false,
    });
    // Basemap escuro publico da Esri: nao exige chave de API
    // (os tiles do CARTO passaram a exigir e ficavam com marca d'agua).
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Tiles &copy; Esri',
    }).addTo(map);

    var stations = ${toSafeJSON(markers)};
    stations.forEach(function (s) {
      var color = s.available > 0 ? '${Colors.available}' : '${Colors.occupied}';
      var icon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="display:flex;flex-direction:column;align-items:center;">'
          + '<div style="background:rgba(20,20,20,0.95);border:1px solid #333;padding:2px 6px;border-radius:4px;">'
          + '<span style="color:#FFF;font-size:11px;font-family:sans-serif;font-weight:bold;">' + s.available + '/' + s.total + '</span>'
          + '</div>'
          + '<div style="width:30px;height:4px;background:#333;margin-top:2px;border-radius:2px;overflow:hidden;">'
          + '<div style="width:' + s.percentage + '%;height:100%;background:' + color + ';"></div>'
          + '</div>'
          + '<div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ' + color + ';margin-top:2px;"></div>'
          + '</div>',
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      });
      L.marker([s.lat, s.lng], { icon: icon }).addTo(map).on('click', function () {
        window.parent.postMessage(JSON.stringify({ type: 'markerPress', stationId: s.id }), '*');
      });
    });

    // Comandos vindos do app
    window.addEventListener('message', function (e) {
      try {
        var data = JSON.parse(e.data);
        if (data.type === 'flyTo') {
          map.flyTo([data.lat, data.lng], 15, { duration: 0.8 });
        }
      } catch (ex) {}
    });
  </script>
</body>
</html>`;
}

export default function MapScreenWeb() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [searchText, setSearchText] = useState('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const panelAnim = useRef(new Animated.Value(0)).current;
  const { filters } = useFilters();

  const filteredStations = useMemo(
    () => filterStations(stations, searchText, filters),
    [searchText, filters]
  );

  // O iframe recarrega toda vez que `srcDoc` muda, entao o HTML so pode ser
  // remontado quando a lista de estacoes realmente mudar.
  const mapHTML = useMemo(() => buildMapHTML(filteredStations), [filteredStations]);

  // Cliques nos marcadores dentro do iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Ignora mensagens de outras origens (ex.: ferramentas do Metro/HMR).
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (typeof event.data !== 'string') return;

      try {
        const data = JSON.parse(event.data);
        if (data.type !== 'markerPress') return;

        const station = stations.find((s) => s.id === data.stationId);
        if (!station) return;

        setSelectedStation(station);
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            type: 'flyTo',
            lat: station.latitude - 0.005,
            lng: station.longitude,
          }),
          '*'
        );
      } catch {
        // Mensagem que nao e JSON do mapa - ignorar.
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Entrada/saida do painel
  useEffect(() => {
    Animated.spring(panelAnim, {
      toValue: selectedStation ? 1 : 0,
      useNativeDriver: false,
      tension: 60,
      friction: 12,
    }).start();
  }, [selectedStation, panelAnim]);

  const handleStationDetails = useCallback(
    (station: ChargingStation) => {
      setSelectedStation(null);
      router.push(`/station/${station.id}`);
    },
    [router]
  );

  const closePanel = useCallback(() => setSelectedStation(null), []);

  const panelTranslateY = panelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  const isWideScreen = width > WIDE_SCREEN_BREAKPOINT;

  return (
    <View style={styles.container}>
      {/* Mapa Leaflet */}
      <View style={styles.mapContainer}>
        <iframe
          ref={iframeRef}
          srcDoc={mapHTML}
          style={{ width: '100%', height: '100%', border: 'none' } as any}
          title="Mapa de eletropostos"
        />
      </View>

      {/* Busca flutuante */}
      <SearchBar searchText={searchText} setSearchText={setSearchText} />

      {/* Painel de previa (substitui o @gorhom/bottom-sheet na web) */}
      {selectedStation && (
        <Animated.View
          style={[
            styles.panel,
            isWideScreen && styles.panelWide,
            { transform: [{ translateY: panelTranslateY }] },
          ]}
        >
          <View style={styles.panelHandle}>
            <TouchableOpacity
              onPress={closePanel}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Fechar prévia da estação"
            >
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
            <View style={styles.handleBar} />
          </View>

          <ScrollView contentContainerStyle={styles.panelScroll} showsVerticalScrollIndicator={false}>
            <StationBentoContent
              station={selectedStation}
              onNavigate={() => openDirections(selectedStation)}
              onDetails={() => handleStationDetails(selectedStation)}
            />
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mapContainer: { flex: 1 },

  panel: {
    position: 'absolute',
    bottom: TAB_BAR_SPACE,
    right: 0,
    left: 0,
    maxHeight: '60%',
    backgroundColor: Colors.surfaceSolid,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.borderSubtle,
    zIndex: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  panelWide: {
    left: 'auto',
    right: Spacing.xl,
    maxWidth: PANEL_MAX_WIDTH,
    maxHeight: '80%',
    borderRadius: BorderRadius.xl,
    borderBottomWidth: 1,
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
});
