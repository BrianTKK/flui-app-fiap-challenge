import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { stations } from '@/constants/mockData';

export default function ReviewModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const station = stations.find((s) => s.id === id);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSelectRating = (stars: number) => {
    Haptics.selectionAsync();
    setRating(stars);
  };

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Em mock/memória: confirma envio e volta
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Avaliar Eletroposto</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Fechar modal"
        >
          <Ionicons name="close" size={24} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.stationName}>{station?.name ?? 'Eletroposto'}</Text>
        <Text style={styles.label}>Qual foi sua experiência de recarga?</Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleSelectRating(star)}
              accessibilityRole="button"
              accessibilityLabel={`${star} estrelas`}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={36}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Comentário</Text>
        <TextInput
          style={styles.input}
          placeholder="Conte sobre a velocidade da carga, facilidade de acesso ou conservação do plugue..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          accessibilityLabel="Campo de comentário sobre o eletroposto"
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          accessibilityRole="button"
          accessibilityLabel="Publicar avaliação"
        >
          <Text style={styles.submitBtnText}>Publicar Avaliação</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  title: { ...Typography.headingMedium, color: Colors.textPrimary, fontSize: 18 },
  content: { padding: Spacing.xl, gap: Spacing.md },
  stationName: { ...Typography.titleSmall, color: Colors.textPrimary },
  label: { ...Typography.bodyMedium, color: Colors.textSecondary, marginTop: Spacing.sm },
  starsRow: { flexDirection: 'row', gap: Spacing.md, justifyContent: 'center', marginVertical: Spacing.sm },
  input: {
    backgroundColor: Colors.surfaceLow,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    color: Colors.textPrimary,
    padding: Spacing.md,
    textAlignVertical: 'top',
    minHeight: 110,
    fontFamily: 'Inter_400Regular',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitBtnText: { ...Typography.headingMedium, color: Colors.background, fontSize: 16 },
});