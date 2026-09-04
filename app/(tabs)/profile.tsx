import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { TAB_BAR_SPACE } from '@/constants/layout';
import { userProfile } from '@/constants/mockData';
import { showAlert } from '@/lib/alert';

const CARD_GRADIENT = ['#1A2E1A', '#0D1F0D'] as const;

const menuItems: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'car-sport', label: 'Gerenciar Veículos' },
  { icon: 'card', label: 'Métodos de Pagamento' },
  { icon: 'settings', label: 'Configurações do App' },
  { icon: 'help-circle', label: 'Central de Ajuda e Suporte' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  // O protótipo não tem back-end: avisamos em vez de deixar o botão morto.
  const notImplemented = (feature: string) =>
    showAlert(feature, 'Esta função ainda não está disponível no protótipo.');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.headerBtn} />
        <Text style={styles.headerTitle}>Flui</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => notImplemented('Configurações')}
          accessibilityRole="button"
          accessibilityLabel="Configurações"
        >
          <Ionicons name="settings-outline" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_SPACE + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.avatarGradient}
            >
              <Ionicons name="person" size={40} color={Colors.background} />
            </LinearGradient>
          </View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
          <Text style={styles.profileMeta}>Membro desde {userProfile.memberSince}</Text>
        </View>

        {/* Veículo */}
        <LinearGradient
          colors={CARD_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vehicleCard}
        >
          <TouchableOpacity
            style={styles.vehicleContent}
            onPress={() => notImplemented('Gerenciar Veículos')}
            accessibilityRole="button"
          >
            <View style={styles.vehicleIconBox}>
              <Ionicons name="car-sport" size={18} color={Colors.primary} />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleLabel}>{userProfile.vehicleLabel}</Text>
              <Text style={styles.vehicleModel}>{userProfile.vehicleModel}</Text>
              <View style={styles.vehicleBattery}>
                <Ionicons name="flash" size={12} color={Colors.primary} />
                <Text style={styles.vehicleBatteryText}>Bateria: {userProfile.batteryCapacity}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Estatísticas */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="flash" size={22} color={Colors.primary} />
            <Text style={styles.statValue}>{userProfile.totalCharges}</Text>
            <Text style={styles.statLabel}>Recargas</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="battery-full" size={22} color={Colors.primary} />
            <Text style={styles.statValue}>{userProfile.totalEnergy}</Text>
            <Text style={styles.statLabel}>Energia Total</Text>
          </View>
        </View>

        {/* Menu */}
        <LinearGradient colors={CARD_GRADIENT} style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={() => notImplemented(item.label)}
              accessibilityRole="button"
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={20} color={Colors.textSecondary} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </LinearGradient>

        {/* Sair */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => notImplemented('Encerrar Sessão')}
          accessibilityRole="button"
        >
          <Ionicons name="log-out" size={18} color={Colors.occupied} />
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  },
  headerBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.titleLarge,
    fontSize: 24,
    color: Colors.primary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.xxl,
  },

  // Perfil
  profileSection: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  avatarContainer: {
    marginBottom: Spacing.sm,
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  profileName: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
  },
  profileEmail: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  profileMeta: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },

  // Veículo
  vehicleCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
  },
  vehicleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  vehicleIconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  vehicleInfo: {
    flex: 1,
    gap: 4,
  },
  vehicleLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  vehicleModel: {
    ...Typography.headingMedium,
    color: Colors.textPrimary,
  },
  vehicleBattery: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vehicleBatteryText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },

  // Estatísticas
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceSolid,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  statValue: {
    ...Typography.headingLarge,
    color: Colors.textPrimary,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },

  // Menu
  menuContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  menuItemText: {
    ...Typography.headingMedium,
    color: Colors.textPrimary,
    fontSize: 16,
  },

  // Sair
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSolid,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 171, 0.2)',
  },
  logoutText: {
    ...Typography.bodyLarge,
    color: Colors.occupied,
  },
});
