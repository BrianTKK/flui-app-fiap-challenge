import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { AMENITY_OPTIONS, getAmenityIcon } from '@/constants/amenities';
import { CONNECTOR_TYPES, ConnectorType } from '@/constants/mockData';
import { DEFAULT_FILTERS } from '@/lib/stations';
import { useFilters } from '@/context/AppProvider';

const MAX_POWER = 350;
const POWER_PRESETS = [22, 50, 100, 150, 250];

export default function FiltersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { filters, setFilters } = useFilters();

  // Rascunho local: so vai para o estado global quando "Aplicar" e tocado.
  const [connectors, setConnectors] = useState<ConnectorType[]>(filters.connectors);
  const [minPower, setMinPower] = useState(filters.minPower);
  const [availableOnly, setAvailableOnly] = useState(filters.availableOnly);
  const [amenities, setAmenities] = useState<string[]>(filters.amenities);

  const toggleConnector = (connector: ConnectorType) => {
    setConnectors(prev =>
      prev.includes(connector) ? prev.filter(c => c !== connector) : [...prev, connector]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearAll = () => {
    setConnectors(DEFAULT_FILTERS.connectors);
    setMinPower(DEFAULT_FILTERS.minPower);
    setAvailableOnly(DEFAULT_FILTERS.availableOnly);
    setAmenities(DEFAULT_FILTERS.amenities);
  };

  const apply = () => {
    setFilters({ connectors, minPower, availableOnly, amenities });
    router.back();
  };

  const powerPercentage = `${(minPower / MAX_POWER) * 100}%` as const;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Fechar filtros"
        >
          <Ionicons name="close" size={14} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filtros</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Filtros Avançados</Text>

        {/* Tipo de conector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TIPO DE CONECTOR</Text>
          <View style={styles.optionsGrid}>
            {CONNECTOR_TYPES.map(connector => {
              const selected = connectors.includes(connector);
              return (
                <TouchableOpacity
                  key={connector}
                  style={[styles.optionCard, selected && styles.optionCardSelected]}
                  onPress={() => toggleConnector(connector)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                >
                  <Ionicons name="flash" size={24} color={selected ? Colors.primary : Colors.textMuted} />
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {connector}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Potencia minima */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>POTÊNCIA MÍNIMA</Text>
            <Text style={styles.powerValue}>{minPower} kW</Text>
          </View>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderProgress, { width: powerPercentage }]} />
            <View style={[styles.sliderThumb, { left: powerPercentage }]} />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0 kW</Text>
            <Text style={styles.sliderLabel}>{MAX_POWER} kW</Text>
          </View>
          <View style={styles.powerButtons}>
            {POWER_PRESETS.map(power => {
              const selected = minPower === power;
              return (
                <TouchableOpacity
                  key={power}
                  style={[styles.powerBtn, selected && styles.powerBtnActive]}
                  // Tocar de novo no preset ativo volta para "sem minimo".
                  onPress={() => setMinPower(selected ? 0 : power)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.powerBtnText, selected && styles.powerBtnTextActive]}>{power}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Disponibilidade */}
        <View style={styles.toggleSection}>
          <View style={styles.toggleInfo}>
            <View style={styles.toggleIcon}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            </View>
            <View style={styles.toggleTexts}>
              <Text style={styles.toggleTitle}>Apenas Disponíveis</Text>
              <Text style={styles.toggleDesc}>Mostrar somente estações com conectores livres.</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.toggle, availableOnly && styles.toggleActive]}
            onPress={() => setAvailableOnly(!availableOnly)}
            accessibilityRole="switch"
            accessibilityState={{ checked: availableOnly }}
            accessibilityLabel="Apenas disponíveis"
          >
            <View style={[styles.toggleDot, availableOnly && styles.toggleDotActive]} />
          </TouchableOpacity>
        </View>

        {/* Comodidades */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>COMODIDADES</Text>
          <View style={styles.chipsContainer}>
            {AMENITY_OPTIONS.map(amenity => {
              const selected = amenities.includes(amenity);
              return (
                <TouchableOpacity
                  key={amenity}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleAmenity(amenity)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                >
                  <Ionicons
                    name={getAmenityIcon(amenity)}
                    size={14}
                    color={selected ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{amenity}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.xl) }]}>
        <TouchableOpacity style={styles.resetBtn} onPress={clearAll} accessibilityRole="button">
          <Text style={styles.resetText}>Limpar tudo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={apply} accessibilityRole="button">
          <Text style={styles.applyText}>Aplicar Filtros</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceSolid, alignItems: 'center', justifyContent: 'center',
  },
  headerSpacer: { width: 40 },
  headerTitle: { ...Typography.headingMedium, color: Colors.textPrimary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 120, gap: Spacing.xxl },
  pageTitle: { ...Typography.titleMedium, color: Colors.textPrimary },

  section: { gap: Spacing.md },
  sectionLabel: { ...Typography.label, color: Colors.textMuted, textTransform: 'uppercase' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  powerValue: { ...Typography.bodyMedium, color: Colors.primary },

  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  optionCard: {
    // Duas colunas responsivas, sem depender da largura medida no import.
    flexGrow: 1, flexBasis: '45%', height: 88, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSolid, alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  optionCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primarySubtle },
  optionText: { ...Typography.bodyMedium, color: Colors.textMuted },
  optionTextSelected: { color: Colors.primary },

  sliderTrack: {
    height: 4, borderRadius: 2, backgroundColor: Colors.surfaceLow, position: 'relative',
  },
  sliderProgress: { height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  sliderThumb: {
    position: 'absolute', top: -10, width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primary, marginLeft: -12,
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabel: { ...Typography.caption, color: Colors.textMuted },
  powerButtons: { flexDirection: 'row', gap: Spacing.sm },
  powerBtn: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceSolid, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  powerBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySubtle },
  powerBtnText: { ...Typography.bodySmall, color: Colors.textMuted },
  powerBtnTextActive: { color: Colors.primary },

  toggleSection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.borderSubtle, gap: Spacing.md,
  },
  toggleInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  toggleTexts: { flex: 1 },
  toggleIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceLow, alignItems: 'center', justifyContent: 'center' },
  toggleTitle: { ...Typography.headingMedium, color: Colors.textPrimary, fontSize: 16 },
  toggleDesc: { ...Typography.bodySmall, color: Colors.textMuted },
  toggle: {
    width: 48, height: 24, borderRadius: 12, backgroundColor: Colors.surfaceLow, justifyContent: 'center', paddingHorizontal: 2,
  },
  toggleActive: { backgroundColor: Colors.primary },
  toggleDot: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.textMuted,
  },
  toggleDotActive: { backgroundColor: Colors.background, alignSelf: 'flex-end' },

  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg, paddingVertical: 10, borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSolid, borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  chipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primarySubtle },
  chipText: { ...Typography.bodySmall, color: Colors.textMuted },
  chipTextSelected: { color: Colors.primary },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: Spacing.md, padding: Spacing.xl,
    backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.borderSubtle,
  },
  resetBtn: {
    flex: 1, borderRadius: BorderRadius.md, paddingVertical: Spacing.lg,
    borderWidth: 1, borderColor: Colors.borderLight, alignItems: 'center',
  },
  resetText: { ...Typography.headingMedium, color: Colors.textSecondary, fontSize: 16 },
  applyBtn: {
    flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    borderRadius: BorderRadius.md, paddingVertical: Spacing.lg, backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  applyText: { ...Typography.headingMedium, color: Colors.background, fontSize: 16 },
});
