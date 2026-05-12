import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { stations, peakHoursData, reviews } from '@/constants/mockData';

const { width } = Dimensions.get('window');

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const station = stations.find(s => s.id === id);

  if (!station) return null;

  const handleNavigate = async () => {
    const { latitude, longitude } = station;
    const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;
    const googleUrl = `google.navigation:q=${latitude},${longitude}`;
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    try {
      if (await Linking.canOpenURL(wazeUrl)) { await Linking.openURL(wazeUrl); return; }
      if (await Linking.canOpenURL(googleUrl)) { await Linking.openURL(googleUrl); return; }
      await Linking.openURL(webUrl);
    } catch {
      Alert.alert('Navegação', 'Não foi possível abrir o navegador.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={16} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{station.name}</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="share-outline" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={['transparent', 'rgba(18,18,18,0.9)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroLeft}>
                <Text style={styles.heroTitle}>{station.name}</Text>
                <View style={styles.heroAddress}>
                  <Ionicons name="location" size={10} color={Colors.textSecondary} />
                  <Text style={styles.heroAddressText}>{station.address}</Text>
                </View>
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
          <LinearGradient
            colors={['#1A3A1A', '#0D1F0D']}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons
            name="flash"
            size={100}
            color="rgba(0,255,102,0.05)"
            style={styles.heroIcon}
          />
        </View>

        {/* Bento Technical Cards */}
        <View style={styles.bentoSection}>
          <View style={styles.bentoRow}>
            <View style={[styles.bentoCard, { flex: 1 }]}>
              <View style={styles.bentoIconRow}>
                <View style={[styles.bentoIconBox, { backgroundColor: station.available ? 'rgba(0,255,102,0.15)' : 'rgba(255,180,171,0.15)' }]}>
                  <Ionicons name="flash" size={16} color={station.available ? Colors.available : Colors.occupied} />
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{station.available ? 'Disponível' : 'Ocupado'}</Text>
                </View>
              </View>
              <Text style={styles.bentoValue}>{station.totalConnections ? (station.totalConnections - (station.occupiedConnections || 0)) : 0}/{station.totalConnections || 0}</Text>
              <Text style={styles.bentoLabel}>CONECTORES</Text>
              {station.available && <View style={styles.bentoAccentLine} />}
            </View>

            <View style={[styles.bentoCard, { flex: 1 }]}>
              <View style={styles.bentoIconRow}>
                <View style={[styles.bentoIconBox, { backgroundColor: 'rgba(0,255,102,0.15)' }]}>
                  <Ionicons name="speedometer" size={16} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.bentoValue}>{station.power}kW</Text>
              <Text style={styles.bentoLabel}>POTÊNCIA MÁX.</Text>
            </View>
          </View>

          <View style={styles.bentoCard}>
            <View style={styles.bentoIconRow}>
              <View style={[styles.bentoIconBox, { backgroundColor: 'rgba(0,255,102,0.15)' }]}>
                <Ionicons name="git-branch" size={18} color={Colors.primary} />
              </View>
            </View>
            <Text style={styles.bentoValue}>{station.connectors.join(' & ')}</Text>
            <Text style={styles.bentoLabel}>CONECTORES</Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comodidades</Text>
          <View style={styles.amenitiesRow}>
            {station.amenities.map((a, i) => {
              const icons: Record<string, string> = {
                'Estacionamento': 'car',
                'Wi-Fi': 'wifi',
                'Café': 'cafe',
                'Banheiro': 'water',
              };
              return (
                <View key={i} style={styles.amenityItem}>
                  <View style={styles.amenityIcon}>
                    <Ionicons name={(icons[a] || 'checkmark') as any} size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.amenityText}>{a}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Peak Hours Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Horário de Pico</Text>
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>Hoje</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            {peakHoursData.map((d, i) => (
              <View key={i} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: d.value * 100,
                      backgroundColor: i === 6 ? Colors.primary : Colors.surfaceLow,
                    },
                  ]}
                />
              </View>
            ))}
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>6h</Text>
            <Text style={styles.chartLabel}>14h</Text>
            <Text style={styles.chartLabel}>22h</Text>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações da Comunidade</Text>
          <View style={styles.reviewSummary}>
            <Text style={styles.reviewScore}>{station.rating}</Text>
            <View>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Ionicons key={s} name={s <= Math.round(station.rating) ? 'star' : 'star-outline'} size={18} color="#FFD700" />
                ))}
              </View>
              <Text style={styles.reviewCountText}>{station.reviewCount} avaliações</Text>
            </View>
          </View>

          {reviews.map(r => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{r.author}</Text>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.writeReviewBtn}
            onPress={() => router.push(`/review/${station.id}`)}
          >
            <Ionicons name="create" size={18} color={Colors.primary} />
            <Text style={styles.writeReviewText}>Escrever uma Avaliação</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>R$/kWh</Text>
          <Text style={styles.priceValue}>R$ {station.pricePerKwh.toFixed(2).replace('.', ',')}</Text>
        </View>
        <TouchableOpacity style={styles.navigateBtn} onPress={handleNavigate}>
          <Ionicons name="navigate" size={18} color={Colors.background} />
          <Text style={styles.navigateBtnText}>Iniciar{'\n'}Rota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
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
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: 120, gap: Spacing.xxl },

  // Hero
  hero: { height: 256, borderRadius: BorderRadius.lg, overflow: 'hidden', position: 'relative' },
  heroGradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: Spacing.lg, zIndex: 2 },
  heroIcon: { position: 'absolute', right: 20, top: 20, zIndex: 1 },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  heroLeft: { flex: 1, gap: 4 },
  heroTitle: { ...Typography.titleMedium, color: Colors.textPrimary, fontSize: 24 },
  heroAddress: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroAddressText: { ...Typography.bodySmall, color: Colors.textSecondary },
  ratingBadge: {
    backgroundColor: 'rgba(30,30,30,0.7)', borderRadius: BorderRadius.md,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  ratingTop: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingValue: { ...Typography.headingMedium, color: Colors.textPrimary },
  ratingCount: { ...Typography.caption, color: Colors.textMuted, marginTop: 4 },

  // Bento
  bentoSection: { gap: Spacing.sm },
  bentoRow: { flexDirection: 'row', gap: Spacing.sm },
  bentoCard: {
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, gap: 4, borderWidth: 1, borderColor: Colors.borderSubtle, overflow: 'hidden',
  },
  bentoIconRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  bentoIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statusBadge: { backgroundColor: 'rgba(0,255,102,0.15)', borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: 4 },
  statusText: { ...Typography.bodySmall, color: Colors.available },
  bentoValue: { ...Typography.headingLarge, color: Colors.textPrimary },
  bentoLabel: { ...Typography.caption, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  bentoAccentLine: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
    backgroundColor: Colors.available, borderTopLeftRadius: BorderRadius.lg, borderBottomLeftRadius: BorderRadius.lg,
  },

  // Section
  section: {
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, gap: Spacing.lg, borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.headingMedium, color: Colors.textPrimary },
  todayBadge: { backgroundColor: Colors.surfaceLow, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: 4 },
  todayText: { ...Typography.bodySmall, color: Colors.primary },

  // Amenities
  amenitiesRow: { flexDirection: 'row', justifyContent: 'space-around' },
  amenityItem: { alignItems: 'center', gap: 8 },
  amenityIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceLow, alignItems: 'center', justifyContent: 'center' },
  amenityText: { ...Typography.bodySmall, color: Colors.textSecondary },

  // Chart
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 120 },
  barContainer: { flex: 1, justifyContent: 'flex-end' },
  bar: { borderRadius: 4, width: '100%', minHeight: 8 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  chartLabel: { ...Typography.bodySmall, color: Colors.textMuted },

  // Reviews
  reviewSummary: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  reviewScore: { ...Typography.titleLarge, color: Colors.textPrimary, fontSize: 36 },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewCountText: { ...Typography.bodySmall, color: Colors.textMuted, marginTop: 4 },
  reviewCard: { backgroundColor: Colors.surfaceLow, borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.sm },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewAuthor: { ...Typography.bodyLarge, color: Colors.textPrimary, fontFamily: 'Inter_700Bold' },
  reviewDate: { ...Typography.bodySmall, color: Colors.textMuted },
  reviewText: { ...Typography.bodyMedium, color: Colors.textSecondary, lineHeight: 20 },
  writeReviewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, paddingVertical: Spacing.lg,
  },
  writeReviewText: { ...Typography.headingMedium, color: Colors.primary, fontSize: 16 },

  // Bottom Bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSolid, borderTopWidth: 1, borderTopColor: Colors.borderSubtle,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.lg,
  },
  priceLabel: { ...Typography.bodySmall, color: Colors.textMuted },
  priceValue: { ...Typography.headingLarge, color: Colors.primary },
  navigateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg,
    shadowColor: '#00FF66', shadowOpacity: 0.3, shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  navigateBtnText: { ...Typography.headingMedium, color: Colors.background, fontSize: 16 },
});
