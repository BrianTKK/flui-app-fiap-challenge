import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { getAmenityIcon } from '@/constants/amenities';
import { stations, peakHoursData, reviews } from '@/constants/mockData';
import { getAvailableConnections, getTotalConnections, isStationAvailable } from '@/lib/stations';
import { openDirections } from '@/lib/directions';
import { useSavedStations } from '@/context/AppProvider';

const CHART_HEIGHT = 100;

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isSaved, toggleSaved } = useSavedStations();
  const station = stations.find(s => s.id === id);

  // Horario de pico destacado = maior valor da serie (antes era um indice fixo).
  const peakIndex = useMemo(() => {
    let index = 0;
    peakHoursData.forEach((point, i) => {
      if (point.value > peakHoursData[index].value) index = i;
    });
    return index;
  }, []);

  if (!station) {
    return (
      <View style={[styles.container, styles.notFound, { paddingTop: insets.top + Spacing.xxl }]}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.notFoundTitle}>Eletroposto não encontrado</Text>
        <Text style={styles.notFoundText}>
          A estação que você tentou abrir não existe ou foi removida.
        </Text>
        <TouchableOpacity style={styles.notFoundBtn} onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.notFoundBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const available = getAvailableConnections(station);
  const total = getTotalConnections(station);
  const isAvailable = isStationAvailable(station);
  const statusColor = isAvailable ? Colors.available : Colors.occupied;
  const statusTint = isAvailable ? 'rgba(0,255,102,0.15)' : 'rgba(255,180,171,0.15)';
  const saved = isSaved(station.id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{station.name}</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => toggleSaved(station.id)}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        >
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient colors={['#1A3A1A', '#0D1F0D']} style={StyleSheet.absoluteFill} />
          <Ionicons name="flash" size={100} color="rgba(0,255,102,0.05)" style={styles.heroIcon} />
          <LinearGradient colors={['transparent', 'rgba(18,18,18,0.9)']} style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <View style={styles.heroLeft}>
                <Text style={styles.heroTitle}>{station.name}</Text>
                <View style={styles.heroAddress}>
                  <Ionicons name="location" size={10} color={Colors.textSecondary} />
                  <Text style={styles.heroAddressText}>{station.address}</Text>
                </View>
                <Text style={styles.heroMeta}>
                  {station.network} · {station.operatingHours}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <View style={styles.ratingTop}>
                  <Ionicons name="star" size={18} color="#FFD700" />
                  <Text style={styles.ratingValue}>{station.rating}</Text>
                </View>
                <Text style={styles.ratingCount}>{station.reviewCount} avaliações</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Cards técnicos */}
        <View style={styles.bentoSection}>
          <View style={styles.bentoRow}>
            <View style={[styles.bentoCard, styles.bentoFlex]}>
              <View style={styles.bentoIconRow}>
                <View style={[styles.bentoIconBox, { backgroundColor: statusTint }]}>
                  <Ionicons name="flash" size={16} color={statusColor} />
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusTint }]}>
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {isAvailable ? 'Disponível' : 'Ocupado'}
                  </Text>
                </View>
              </View>
              <Text style={styles.bentoValue}>{available}/{total}</Text>
              <Text style={styles.bentoLabel}>CONECTORES LIVRES</Text>
              {isAvailable && <View style={styles.bentoAccentLine} />}
            </View>

            <View style={[styles.bentoCard, styles.bentoFlex]}>
              <View style={styles.bentoIconRow}>
                <View style={[styles.bentoIconBox, { backgroundColor: Colors.primarySubtle }]}>
                  <Ionicons name="speedometer" size={16} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.bentoValue}>{station.power}kW</Text>
              <Text style={styles.bentoLabel}>POTÊNCIA MÁX.</Text>
            </View>
          </View>

          <View style={styles.bentoCard}>
            <View style={styles.bentoIconRow}>
              <View style={[styles.bentoIconBox, { backgroundColor: Colors.primarySubtle }]}>
                <Ionicons name="git-branch" size={18} color={Colors.primary} />
              </View>
            </View>
            <Text style={styles.bentoValue}>{station.connectors.join(' & ')}</Text>
            <Text style={styles.bentoLabel}>TIPOS DE CONECTOR</Text>
          </View>
        </View>

        {/* Comodidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comodidades</Text>
          <View style={styles.amenitiesRow}>
            {station.amenities.map(amenity => (
              <View key={amenity} style={styles.amenityItem}>
                <View style={styles.amenityIcon}>
                  <Ionicons name={getAmenityIcon(amenity)} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Horário de pico */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Horário de Pico</Text>
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>Hoje</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            {peakHoursData.map((point, index) => (
              <View key={point.hour} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: point.value * CHART_HEIGHT,
                      backgroundColor: index === peakIndex ? Colors.primary : Colors.surfaceLow,
                    },
                  ]}
                />
              </View>
            ))}
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>{peakHoursData[0].hour}</Text>
            <Text style={styles.chartLabel}>
              {peakHoursData[Math.floor(peakHoursData.length / 2)].hour}
            </Text>
            <Text style={styles.chartLabel}>{peakHoursData[peakHoursData.length - 1].hour}</Text>
          </View>
        </View>

        {/* Avaliações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações da Comunidade</Text>
          <View style={styles.reviewSummary}>
            <Text style={styles.reviewScore}>{station.rating}</Text>
            <View>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Ionicons
                    key={star}
                    name={star <= Math.round(station.rating) ? 'star' : 'star-outline'}
                    size={18}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.reviewCountText}>{station.reviewCount} avaliações</Text>
            </View>
          </View>

          {reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.author}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.writeReviewBtn}
            onPress={() => router.push(`/review/${station.id}`)}
            accessibilityRole="button"
          >
            <Ionicons name="create" size={18} color={Colors.primary} />
            <Text style={styles.writeReviewText}>Escrever uma Avaliação</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Barra de ação */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        <View>
          <Text style={styles.priceLabel}>R$/kWh</Text>
          <Text style={styles.priceValue}>R$ {station.pricePerKwh.toFixed(2).replace('.', ',')}</Text>
        </View>
        <TouchableOpacity
          style={styles.navigateBtn}
          onPress={() => openDirections(station)}
          accessibilityRole="button"
        >
          <Ionicons name="navigate" size={18} color={Colors.background} />
          <Text style={styles.navigateBtnText}>Iniciar Rota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Estado vazio
  notFound: { alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: Spacing.xl },
  notFoundTitle: { ...Typography.titleSmall, color: Colors.textPrimary, textAlign: 'center' },
  notFoundText: { ...Typography.bodyMedium, color: Colors.textMuted, textAlign: 'center' },
  notFoundBtn: {
    marginTop: Spacing.md, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md, backgroundColor: Colors.primary,
  },
  notFoundBtnText: { ...Typography.headingMedium, fontSize: 16, color: Colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surfaceSolid,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceLow,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...Typography.headingMedium, color: Colors.textPrimary, flex: 1, textAlign: 'center', marginHorizontal: Spacing.sm },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: 140, gap: Spacing.xxl },

  // Hero
  hero: { height: 256, borderRadius: BorderRadius.lg, overflow: 'hidden', position: 'relative' },
  heroGradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: Spacing.lg, zIndex: 2 },
  heroIcon: { position: 'absolute', right: 20, top: 20, zIndex: 1 },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: Spacing.md },
  heroLeft: { flex: 1, gap: 4 },
  heroTitle: { ...Typography.titleMedium, color: Colors.textPrimary, fontSize: 24 },
  heroAddress: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroAddressText: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1 },
  heroMeta: { ...Typography.caption, color: Colors.textMuted },
  ratingBadge: {
    backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.md,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  ratingTop: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingValue: { ...Typography.headingMedium, color: Colors.textPrimary },
  ratingCount: { ...Typography.caption, color: Colors.textMuted, marginTop: 4 },

  // Cards
  bentoSection: { gap: Spacing.sm },
  bentoRow: { flexDirection: 'row', gap: Spacing.sm },
  bentoFlex: { flex: 1 },
  bentoCard: {
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, gap: 4, borderWidth: 1, borderColor: Colors.borderSubtle, overflow: 'hidden',
  },
  bentoIconRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  bentoIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statusBadge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: 4 },
  statusText: { ...Typography.bodySmall },
  bentoValue: { ...Typography.headingLarge, color: Colors.textPrimary },
  bentoLabel: { ...Typography.caption, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  bentoAccentLine: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
    backgroundColor: Colors.available, borderTopLeftRadius: BorderRadius.lg, borderBottomLeftRadius: BorderRadius.lg,
  },

  // Seções
  section: {
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, gap: Spacing.lg, borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.headingMedium, color: Colors.textPrimary },
  todayBadge: { backgroundColor: Colors.surfaceLow, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: 4 },
  todayText: { ...Typography.bodySmall, color: Colors.primary },

  // Comodidades
  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', gap: Spacing.md },
  amenityItem: { alignItems: 'center', gap: 8 },
  amenityIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceLow, alignItems: 'center', justifyContent: 'center' },
  amenityText: { ...Typography.bodySmall, color: Colors.textSecondary },

  // Gráfico
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: CHART_HEIGHT + 20 },
  barContainer: { flex: 1, justifyContent: 'flex-end' },
  bar: { borderRadius: 4, width: '100%', minHeight: 8 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  chartLabel: { ...Typography.bodySmall, color: Colors.textMuted },

  // Avaliações
  reviewSummary: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  reviewScore: { ...Typography.titleLarge, color: Colors.textPrimary, fontSize: 36 },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewCountText: { ...Typography.bodySmall, color: Colors.textMuted, marginTop: 4 },
  reviewCard: { backgroundColor: Colors.surfaceLow, borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.sm },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewAuthor: { ...Typography.bodyLarge, color: Colors.textPrimary, fontFamily: 'Inter_700Bold' },
  reviewDate: { ...Typography.bodySmall, color: Colors.textMuted },
  reviewText: { ...Typography.bodyMedium, color: Colors.textSecondary },
  writeReviewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, paddingVertical: Spacing.lg,
  },
  writeReviewText: { ...Typography.headingMedium, color: Colors.primary, fontSize: 16 },

  // Barra inferior
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSolid, borderTopWidth: 1, borderTopColor: Colors.borderSubtle,
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg,
  },
  priceLabel: { ...Typography.bodySmall, color: Colors.textMuted },
  priceValue: { ...Typography.headingLarge, color: Colors.primary },
  navigateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg,
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  navigateBtnText: { ...Typography.headingMedium, color: Colors.background, fontSize: 16 },
});
