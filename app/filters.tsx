import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ConnectorOption = { id: string; label: string; icon?: string };
const connectorOptions: ConnectorOption[] = [
  { id: 'ccs2', label: 'CCS2', icon: 'flash' },
  { id: 'type2', label: 'Type 2', icon: 'flash' },
  { id: 'chademo', label: 'CHAdeMO', icon: 'flash' },
  { id: 'tesla', label: 'Tesla', icon: 'flash' },
];

const amenityOptions = [
  { id: 'parking', label: 'Estacionamento', icon: 'car' },
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi' },
  { id: 'bathroom', label: 'Banheiro', icon: 'water' },
  { id: 'cafe', label: 'Café', icon: 'cafe' },
];

export default function FiltersScreen() {
  const router = useRouter();
  const [selectedConnectors, setSelectedConnectors] = useState<string[]>(['ccs2']);
  const [minPower, setMinPower] = useState(50);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['parking']);

  const toggleConnector = (id: string) => {
    setSelectedConnectors(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={14} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filtros</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Filtros Avançados</Text>

        {/* Connector Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TIPO DE CONECTOR</Text>
          <View style={styles.optionsGrid}>
            {connectorOptions.map(opt => {
              const selected = selectedConnectors.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optionCard, selected && styles.optionCardSelected]}
                  onPress={() => toggleConnector(opt.id)}
                >
                  <Ionicons name="flash" size={24} color={selected ? Colors.primary : Colors.textMuted} />
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Minimum Power */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>POTÊNCIA MÍNIMA</Text>
            <Text style={styles.powerValue}>{minPower} kW</Text>
          </View>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderProgress, { width: `${(minPower / 350) * 100}%` }]} />
            <View style={[styles.sliderThumb, { left: `${(minPower / 350) * 100}%` }]} />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0 kW</Text>
            <Text style={styles.sliderLabel}>350 kW</Text>
          </View>
          <View style={styles.powerButtons}>
            {[22, 50, 100, 150, 250].map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.powerBtn, minPower === p && styles.powerBtnActive]}
                onPress={() => setMinPower(p)}
              >
                <Text style={[styles.powerBtnText, minPower === p && styles.powerBtnTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.toggleSection}>
          <View style={styles.toggleInfo}>
            <View style={styles.toggleIcon}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.toggleTitle}>Apenas Disponíveis</Text>
              <Text style={styles.toggleDesc}>Mostrar somente estações com conectores livres.</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.toggle, availableOnly && styles.toggleActive]}
            onPress={() => setAvailableOnly(!availableOnly)}
          >
            <View style={[styles.toggleDot, availableOnly && styles.toggleDotActive]} />
          </TouchableOpacity>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>COMODIDADES</Text>
          <View style={styles.chipsContainer}>
            {amenityOptions.map(opt => {
              const selected = selectedAmenities.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleAmenity(opt.id)}
                >
                  <Ionicons name={opt.icon as any} size={14} color={selected ? Colors.primary : Colors.textMuted} />
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={() => {
          setSelectedConnectors([]);
          setMinPower(0);
          setAvailableOnly(false);
          setSelectedAmenities([]);
        }}>
          <Text style={styles.resetText}>Limpar tudo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={() => router.back()}>
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
    paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceSolid, alignItems: 'center', justifyContent: 'center',
  },
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
    width: (SCREEN_WIDTH - 60) / 2 - 4, height: 88, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSolid, alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  optionCardSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(0,255,102,0.05)' },
  optionText: { ...Typography.bodyMedium, color: Colors.textMuted },
  optionTextSelected: { color: Colors.primary },

  sliderTrack: {
    height: 4, borderRadius: 2, backgroundColor: Colors.surfaceLow, position: 'relative',
  },
  sliderProgress: { height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  sliderThumb: {
    position: 'absolute', top: -10, width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primary, marginLeft: -12,
    shadowColor: '#00FF66', shadowOpacity: 0.3, shadowRadius: 15,
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
  powerBtnActive: { borderColor: Colors.primary, backgroundColor: 'rgba(0,255,102,0.1)' },
  powerBtnText: { ...Typography.bodySmall, color: Colors.textMuted },
  powerBtnTextActive: { color: Colors.primary },

  toggleSection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  toggleInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  toggleIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceLow, alignItems: 'center', justifyContent: 'center' },
  toggleTitle: { ...Typography.headingMedium, color: Colors.textPrimary, fontSize: 16 },
  toggleDesc: { ...Typography.bodySmall, color: Colors.textMuted, maxWidth: 180 },
  toggle: {
    width: 47, height: 24, borderRadius: 12, backgroundColor: Colors.surfaceLow, justifyContent: 'center', paddingHorizontal: 2,
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
  chipSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(0,255,102,0.1)' },
  chipText: { ...Typography.bodySmall, color: Colors.textMuted },
  chipTextSelected: { color: Colors.primary },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: Spacing.md, padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.xl,
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
    shadowColor: '#00FF66', shadowOpacity: 0.3, shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  applyText: { ...Typography.headingMedium, color: Colors.background, fontSize: 16 },
});
