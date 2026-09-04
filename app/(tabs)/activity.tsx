import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { TAB_BAR_SPACE } from '@/constants/layout';
import {
  stations,
  chargingHistory,
  ChargingStation,
  ChargingHistory,
} from '@/constants/mockData';
import { isStationAvailable } from '@/lib/stations';
import { useSavedStations } from '@/context/AppProvider';

type Tab = 'historico' | 'salvos';

export default function ActivityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('historico');
  const { savedIds, toggleSaved } = useSavedStations();

  const saved = useMemo(
    () => stations.filter(s => savedIds.includes(s.id)),
    [savedIds]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.headerBtn} />
        <Text style={styles.headerTitle}>Flui</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Notificações"
        >
          <Ionicons name="notifications-outline" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Conteudo */}
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Atividade</Text>

        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'historico' && styles.segmentActive]}
            onPress={() => setActiveTab('historico')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'historico' }}
          >
            <Text style={[styles.segmentText, activeTab === 'historico' && styles.segmentTextActive]}>
              Histórico
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'salvos' && styles.segmentActive]}
            onPress={() => setActiveTab('salvos')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'salvos' }}
          >
            <Text style={[styles.segmentText, activeTab === 'salvos' && styles.segmentTextActive]}>
              Salvos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Listas */}
        {activeTab === 'historico' ? (
          <FlatList
            data={chargingHistory}
            keyExtractor={item => item.id}
            contentContainerStyle={[styles.listContent, { paddingBottom: TAB_BAR_SPACE + insets.bottom }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState message="Nenhuma recarga registrada ainda." />}
            renderItem={({ item }) => (
              <HistoryCard item={item} onPress={() => router.push(`/station/${item.stationId}`)} />
            )}
          />
        ) : (
          <FlatList
            data={saved}
            keyExtractor={item => item.id}
            contentContainerStyle={[styles.listContent, { paddingBottom: TAB_BAR_SPACE + insets.bottom }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState message="Você ainda não salvou nenhum eletroposto." />}
            renderItem={({ item }) => (
              <SavedCard
                item={item}
                onPress={() => router.push(`/station/${item.id}`)}
                onToggleSaved={() => toggleSaved(item.id)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="flash-outline" size={32} color={Colors.textMuted} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

function HistoryCard({ item, onPress }: { item: ChargingHistory; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardAccent} />
      <View style={styles.cardLeft}>
        <View style={styles.cardIcon}>
          <Ionicons name="flash" size={16} color={Colors.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.stationName}</Text>
          <Text style={styles.cardSubtitle}>{item.date} · {item.duration}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardEnergy}>{item.energy}</Text>
        <Text style={styles.cardCost}>{item.cost}</Text>
      </View>
    </TouchableOpacity>
  );
}

function SavedCard({
  item,
  onPress,
  onToggleSaved,
}: {
  item: ChargingStation;
  onPress: () => void;
  onToggleSaved: () => void;
}) {
  const available = isStationAvailable(item);
  const statusColor = available ? Colors.available : Colors.occupied;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.cardAccent, { backgroundColor: statusColor }]} />
      <View style={styles.cardLeft}>
        <View style={styles.cardIcon}>
          <Ionicons name="flash" size={16} color={statusColor} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.address}</Text>
          <Text style={styles.cardSubtitle}>{item.distance} · {item.power}kW</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardEnergy}>{available ? 'Livre' : 'Ocupado'}</Text>
        <Text style={[styles.cardCost, { color: statusColor }]}>
          R$ {item.pricePerKwh.toFixed(2).replace('.', ',')}/kWh
        </Text>
        <TouchableOpacity
          onPress={onToggleSaved}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remover ${item.name} dos favoritos`}
        >
          <Ionicons name="heart" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surfaceSolid,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  headerBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.titleLarge,
    fontSize: 24,
    color: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.xxl,
  },
  pageTitle: {
    ...Typography.titleMedium,
    fontSize: 32,
    color: Colors.textPrimary,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSolid,
    borderRadius: BorderRadius.lg,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  segment: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  segmentActive: {
    backgroundColor: Colors.surfaceLow,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  segmentText: {
    ...Typography.headingMedium,
    color: Colors.textMuted,
  },
  segmentTextActive: {
    color: Colors.primary,
  },
  listContent: {
    gap: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.section,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSolid,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    ...Typography.headingMedium,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  cardSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  cardEnergy: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  cardCost: {
    ...Typography.bodyLarge,
    color: Colors.primary,
    fontFamily: 'Inter_700Bold',
  },
});
