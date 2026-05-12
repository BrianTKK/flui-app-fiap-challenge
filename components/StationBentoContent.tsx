import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { ChargingStation } from '@/constants/mockData';

interface StationBentoContentProps {
  station: ChargingStation;
  onNavigate: () => void;
  onDetails: () => void;
}

export default function StationBentoContent({ station, onNavigate, onDetails }: StationBentoContentProps) {
  const available = station.totalConnections ? station.totalConnections - (station.occupiedConnections || 0) : 0;
  const total = station.totalConnections || 0;
  const isAvailable = available > 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.sheetHeader}>
        <View style={styles.sheetHeaderLeft}>
          <Text style={styles.sheetTitle}>{station.name}</Text>
          <View style={styles.sheetSubInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={12} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{station.distance}</Text>
            </View>
            <View style={styles.infoDot} />
            <View style={styles.infoItem}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.infoText}>{station.rating}</Text>
              <Text style={styles.infoTextMuted}>({station.reviewCount})</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.favoriteBtn}>
          <Ionicons name="heart-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Bento Grid */}
      <View style={styles.bentoGrid}>
        <View style={[styles.bentoCard, styles.bentoHalf]}>
          <Text style={styles.bentoLabel}>Disponibilidade</Text>
          <View style={styles.bentoContent}>
            <Ionicons name="flash" size={16} color={isAvailable ? Colors.available : Colors.occupied} />
            <Text style={styles.bentoValue}>
              {available}/{total}
            </Text>
          </View>
          {isAvailable && <View style={styles.bentoAccent} />}
        </View>

        <View style={[styles.bentoCard, styles.bentoHalf]}>
          <Text style={styles.bentoLabel}>Preço</Text>
          <View style={styles.bentoContent}>
            <Text style={styles.bentoPriceUnit}>R$/kWh</Text>
            <Text style={styles.bentoPriceValue}>
              R$ {station.pricePerKwh.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        <View style={[styles.bentoCard, styles.bentoFull]}>
          <Text style={styles.bentoLabel}>Conectores</Text>
          <View style={styles.connectorsRow}>
            {station.connectors.map((c, i) => (
              <View key={i} style={styles.connectorChip}>
                <Ionicons name="flash" size={14} color={Colors.primary} />
                <Text style={styles.connectorText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.actionButton} onPress={onNavigate}>
        <Ionicons name="navigate" size={18} color={Colors.background} />
        <Text style={styles.actionButtonText}>Iniciar Rota</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.detailsLink} onPress={onDetails}>
        <Text style={styles.detailsLinkText}>Ver ficha completa</Text>
        <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
