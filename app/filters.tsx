import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useFilters } from '@/context/AppProvider';
import { ConnectorType } from '@/constants/mockData';

const CONNECTORS: ConnectorType[] = ['CCS2', 'Type 2', 'CHAdeMO'];
const POWERS = [
  { label: 'Todos', value: 0 },
  { label: '≥ 50 kW', value: 50 },
  { label: '≥ 120 kW', value: 120 },
];
const AMENITIES = [
  { key: 'Café', icon: 'cafe-outline' },
  { key: 'Wi-Fi', icon: 'wifi-outline' },
  { key: 'Banheiro', icon: 'water-outline' },
  { key: 'Conveniência', icon: 'cart-outline' },
];

export default function FiltersModal() {
  const router = useRouter();
  const { filters, setFilters, resetFilters } = useFilters();

  const [selectedConnector, setSelectedConnector] = useState<ConnectorType | null>(
    filters.connectorType
  );
  const [selectedPower, setSelectedPower] = useState<number>(filters.minPower);
  const [open24h, setOpen24h] = useState<boolean>(filters.open24HoursOnly);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    filters.amenities
  );

  const toggleAmenity = (key: string) => {
    Haptics.selectionAsync();
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFilters({
      connectorType: selectedConnector,
      minPower: selectedPower,
      open24HoursOnly: open24h,
      amenities: selectedAmenities,
    });
    router.back();
  };

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    resetFilters();
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filtros de Busca</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Fechar modal de filtros"
        >
          <Ionicons name="close" size={24} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Tipo de Conector</Text>
        <View style={styles.chipGroup}>
          {CONNECTORS.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.chip,
                selectedConnector === type && styles.chipActive,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedConnector(selectedConnector === type ? null : type);
              }}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.chipText,
                  selectedConnector === type && styles.chipTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Potência Mínima</Text>
        <View style={styles.chipGroup}>
          {POWERS.map((p) => (
            <TouchableOpacity
              key={p.label}
              style={[styles.chip, selectedPower === p.value && styles.chipActive]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedPower(p.value);
              }}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.chipText,
                  selectedPower === p.value && styles.chipTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Comodidades Próximas</Text>
        <View style={styles.chipGroup}>
          {AMENITIES.map((a) => {
            const active = selectedAmenities.includes(a.key);
            return (
              <TouchableOpacity
                key={a.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleAmenity(a.key)}
                accessibilityRole="button"
              >
                <Ionicons
                  name={a.icon as any}
                  size={14}
                  color={active ? Colors.background : Colors.textMuted}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {a.key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Disponibilidade</Text>
        <TouchableOpacity
          style={[styles.chip, open24h && styles.chipActive]}
          onPress={() => {
            Haptics.selectionAsync();
            setOpen24h(!open24h);
          }}
          accessibilityRole="button"
        >
          <Text style={[styles.chipText, open24h && styles.chipTextActive]}>
            Somente Abertos 24h
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} accessibilityRole="button">
          <Text style={styles.resetBtnText}>Limpar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply} accessibilityRole="button">
          <Text style={styles.applyBtnText}>Aplicar Filtros</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceSolid },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  title: {
    color: Colors.textPrimary,
    ...Typography.headingMedium,
    fontSize: 18,
  },
  content: { padding: Spacing.xl },
  sectionTitle: {
    color: Colors.textSecondary,
    ...Typography.headingMedium,
    fontSize: 13,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLow,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    ...Typography.bodyMedium,
  },
  chipTextActive: {
    color: Colors.background,
    ...Typography.headingMedium,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    gap: Spacing.md,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  resetBtnText: {
    color: Colors.textMuted,
    ...Typography.headingMedium,
  },
  applyBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  applyBtnText: {
    color: Colors.background,
    ...Typography.headingMedium,
  },
});