import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { stations } from '@/constants/mockData';
import { showAlert } from '@/lib/alert';

const MAX_REVIEW_LENGTH = 500;

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const station = stations.find(s => s.id === id);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [safetyRating, setSafetyRating] = useState(0);
  const [chargerRating, setChargerRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      showAlert('Avaliação', 'Por favor, selecione uma nota geral.');
      return;
    }

    // Sem back-end no protótipo: apenas confirmamos o envio e voltamos.
    showAlert('Obrigado!', 'Sua avaliação foi registrada.', () => router.back());
  };

  if (!station) {
    return (
      <View style={[styles.container, styles.notFound, { paddingTop: insets.top + Spacing.xxl }]}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.notFoundTitle}>Eletroposto não encontrado</Text>
        <TouchableOpacity style={styles.notFoundBtn} onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.notFoundBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        >
          <Ionicons name="close" size={14} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avaliar Eletroposto</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Contexto */}
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

        {/* Nota geral */}
        <View style={styles.overallSection}>
          <Text style={styles.overallLabel}>Nota Geral</Text>
          <Text style={styles.overallHint}>Toque nas estrelas para avaliar</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                accessibilityRole="button"
                accessibilityLabel={`Dar nota ${star} de 5`}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? '#FFD700' : Colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notas detalhadas */}
        <View style={styles.detailedSection}>
          <RatingRow label="Limpeza" icon="sparkles" rating={cleanlinessRating} onRate={setCleanlinessRating} />
          <RatingRow label="Segurança" icon="shield-checkmark" rating={safetyRating} onRate={setSafetyRating} />
          <RatingRow
            label="Qualidade dos Carregadores"
            icon="flash"
            rating={chargerRating}
            onRate={setChargerRating}
            isLast
          />
        </View>

        {/* Texto */}
        <View style={styles.textSection}>
          <Text style={styles.textLabel}>ESCREVA UMA AVALIAÇÃO</Text>
          <View style={styles.textArea}>
            <TextInput
              style={[styles.textInput, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
              placeholder="Compartilhe detalhes da sua experiência neste local..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={5}
              maxLength={MAX_REVIEW_LENGTH}
              textAlignVertical="top"
              value={reviewText}
              onChangeText={setReviewText}
            />
          </View>
          <Text style={styles.charCount}>
            {reviewText.length}/{MAX_REVIEW_LENGTH}
          </Text>
        </View>
      </ScrollView>

      {/* Enviar */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.xl) }]}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} accessibilityRole="button">
          <Text style={styles.submitText}>Publicar Avaliação</Text>
          <Ionicons name="send" size={16} color={Colors.background} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function RatingRow({
  label,
  icon,
  rating,
  onRate,
  isLast = false,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  rating: number;
  onRate: (value: number) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.ratingRow, isLast && styles.ratingRowLast]}>
      <View style={styles.ratingRowLeft}>
        <Ionicons name={icon} size={16} color={Colors.primary} />
        <Text style={styles.ratingRowLabel}>{label}</Text>
      </View>
      <View style={styles.miniStars}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => onRate(star)}
            accessibilityRole="button"
            accessibilityLabel={`${label}: nota ${star} de 5`}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={20}
              color={star <= rating ? '#FFD700' : Colors.textMuted}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  notFound: { alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: Spacing.xl },
  notFoundTitle: { ...Typography.titleSmall, color: Colors.textPrimary, textAlign: 'center' },
  notFoundBtn: {
    marginTop: Spacing.md, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md, backgroundColor: Colors.primary,
  },
  notFoundBtnText: { ...Typography.headingMedium, fontSize: 16, color: Colors.background },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle,
  },
  closeBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surfaceSolid, alignItems: 'center', justifyContent: 'center',
  },
  headerSpacer: { width: 48 },
  headerTitle: { ...Typography.headingMedium, color: Colors.textPrimary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 140, gap: Spacing.xxl, paddingTop: Spacing.xxl },

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
  contextAddressText: { ...Typography.bodySmall, color: Colors.textMuted, flex: 1 },

  overallSection: { alignItems: 'center', gap: Spacing.sm },
  overallLabel: { ...Typography.titleSmall, color: Colors.textPrimary },
  overallHint: { ...Typography.bodySmall, color: Colors.textMuted },
  starsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },

  detailedSection: {
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, gap: Spacing.lg, borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  ratingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle,
  },
  ratingRowLast: { borderBottomWidth: 0 },
  ratingRowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  ratingRowLabel: { ...Typography.headingMedium, color: Colors.textPrimary, fontSize: 16, flexShrink: 1 },
  miniStars: { flexDirection: 'row', gap: 4 },

  textSection: { gap: Spacing.sm },
  textLabel: { ...Typography.label, color: Colors.textMuted },
  textArea: {
    backgroundColor: Colors.surfaceSolid, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.borderSubtle, padding: Spacing.lg, minHeight: 130,
  },
  textInput: { ...Typography.bodyLarge, color: Colors.textPrimary, minHeight: 100 },
  charCount: { ...Typography.caption, color: Colors.textMuted, alignSelf: 'flex-end' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl,
    backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.borderSubtle,
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 }, elevation: 8,
  },
  submitText: { ...Typography.headingMedium, color: Colors.background },
});
