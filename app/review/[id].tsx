import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { stations } from '@/constants/mockData';

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const station = stations.find(s => s.id === id);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [safetyRating, setSafetyRating] = useState(0);
  const [chargerRating, setChargerRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Avaliação', 'Por favor, selecione uma nota geral.');
      return;
    }
    Alert.alert('Obrigado!', 'Sua avaliação foi enviada com sucesso.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  if (!station) return null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={14} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avaliar Eletroposto</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Context Card */}
        <View style={styles.contextCard}>
          <View style={styles.contextIcon}>
            <Ionicons name="flash" size={18} color={Colors.primary} />
          </View>
          <View style={styles.contextInfo}>
            <Text style={styles.contextName}>{station.name}</Text>
            <View style={styles.contextAddress}>
              <Ionicons name="location" size={10} color={Colors.textMuted} />
              <Text style={styles.contextAddressText}>{station.address}</Text>
            </View>
          </View>
        </View>

        {/* Overall Rating */}
        <View style={styles.overallSection}>
          <Text style={styles.overallLabel}>Nota Geral</Text>
          <Text style={styles.overallHint}>Toque nas estrelas para avaliar</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(s => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Ionicons
                  name={s <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={s <= rating ? '#FFD700' : Colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Detailed Ratings */}
        <View style={styles.detailedSection}>
          <RatingRow label="Limpeza" icon="sparkles" rating={cleanlinessRating} onRate={setCleanlinessRating} />
          <RatingRow label="Segurança" icon="shield-checkmark" rating={safetyRating} onRate={setSafetyRating} />
          <RatingRow label="Qualidade dos Carregadores" icon="flash" rating={chargerRating} onRate={setChargerRating} />
        </View>

        {/* Written Review */}
        <View style={styles.textSection}>
          <Text style={styles.textLabel}>ESCREVA UMA AVALIAÇÃO</Text>
          <View style={styles.textArea}>
            <TextInput
              style={styles.textInput}
              placeholder="Compartilhe detalhes da sua experiência neste local..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={reviewText}
              onChangeText={setReviewText}
            />
          </View>
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Publicar Avaliação</Text>
          <Ionicons name="send" size={16} color={Colors.background} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function RatingRow({ label, icon, rating, onRate }: {
  label: string; icon: string; rating: number; onRate: (v: number) => void;
}) {
  return (
    <View style={styles.ratingRow}>
      <View style={styles.ratingRowLeft}>
        <Ionicons name={icon as any} size={16} color={Colors.primary} />
        <Text style={styles.ratingRowLabel}>{label}</Text>
      </View>
      <View style={styles.miniStars}>
        {[1, 2, 3, 4, 5].map(s => (
          <TouchableOpacity key={s} onPress={() => onRate(s)}>
            <Ionicons
              name={s <= rating ? 'star' : 'star-outline'}
              size={20}
              color={s <= rating ? '#FFD700' : Colors.textMuted}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle,
  },
  closeBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surfaceSolid, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...Typography.headingMedium, color: Colors.textPrimary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 120, gap: Spacing.xxl, paddingTop: Spacing.xxl },

  contextCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  contextIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surfaceLow, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  contextInfo: { flex: 1, gap: 4 },
  contextName: { ...Typography.headingMedium, color: Colors.textPrimary },
  contextAddress: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  contextAddressText: { ...Typography.bodySmall, color: Colors.textMuted },

  overallSection: { alignItems: 'center', gap: Spacing.sm },
  overallLabel: { ...Typography.titleSmall, color: Colors.textPrimary },
  overallHint: { ...Typography.bodySmall, color: Colors.textMuted },
  starsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },

  detailedSection: {
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, gap: Spacing.lg, borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  ratingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle,
  },
  ratingRowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  ratingRowLabel: { ...Typography.headingMedium, color: Colors.textPrimary, fontSize: 16 },
  miniStars: { flexDirection: 'row', gap: 4 },

  textSection: { gap: Spacing.sm },
  textLabel: { ...Typography.label, color: Colors.textMuted },
  textArea: {
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.borderSubtle, padding: Spacing.lg, minHeight: 130,
  },
  textInput: { ...Typography.bodyLarge, color: Colors.textPrimary, minHeight: 100 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.xl, paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.xl,
    backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.borderSubtle,
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    shadowColor: '#00FF66', shadowOpacity: 0.3, shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  submitText: { ...Typography.headingMedium, color: Colors.background },
});
