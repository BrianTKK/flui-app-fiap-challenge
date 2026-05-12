import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { userProfile } from '@/constants/mockData';

const menuItems = [
  { icon: 'car-sport' as const, label: 'Gerenciar Veículos', route: '' },
  { icon: 'card' as const, label: 'Métodos de Pagamento', route: '' },
  { icon: 'settings' as const, label: 'Configurações do App', route: '' },
  { icon: 'help-circle' as const, label: 'Central de Ajuda e Suporte', route: '' },
  { icon: 'log-out' as const, label: 'Encerrar Sessão', route: '', danger: true },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBtn} />
        <Text style={styles.headerTitle}>Flui</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="settings-outline" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
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
          <Text style={styles.profileEmail}>{userProfile.memberSince}</Text>
        </View>

        {/* Vehicle Card */}
        <LinearGradient
          colors={['#1A2E1A', '#0D1F0D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vehicleCard}
        >
          <View style={styles.vehicleContent}>
            <View style={styles.vehicleIconBox}>
              <Ionicons name="car-sport" size={18} color={Colors.primary} />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleLabel}>{userProfile.vehicle}</Text>
              <Text style={styles.vehicleModel}>{userProfile.vehicleModel}</Text>
              <View style={styles.vehicleBattery}>
                <Ionicons name="flash" size={12} color={Colors.primary} />
                <Text style={styles.vehicleBatteryText}>{userProfile.batteryCapacity}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
          </View>
        </LinearGradient>

        {/* Stats Grid */}
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
        <LinearGradient
          colors={['#1A2E1A', '#0D1F0D']}
          style={styles.menuContainer}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.danger ? Colors.occupied : Colors.textSecondary}
                />
                <Text style={[styles.menuItemText, item.danger && { color: Colors.occupied }]}>
                  {item.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </LinearGradient>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
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
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
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
    paddingBottom: 120,
    gap: Spacing.xxl,
  },

  // Profile
  profileSection: {
    alignItems: 'center',
    gap: Spacing.sm,
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
    shadowColor: '#00FF66', shadowOpacity: 0.3, shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  profileName: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
  },
  profileEmail: {
    ...Typography.bodyLarge,
    color: Colors.textMuted,
  },

  // Vehicle Card
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

  // Stats
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

  // Logout
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
