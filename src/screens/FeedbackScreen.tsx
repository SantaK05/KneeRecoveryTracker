import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { useWorkout } from '../context/WorkoutContext';
import { SliderInput } from '../components/SliderInput';
import { colors, spacing } from '../constants';
import { SessionFeedback } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Feedback'>;

export function FeedbackScreen({ navigation }: Props) {
  const { endSession } = useWorkout();

  const [difficulty,   setDifficulty]   = useState(5);
  const [energy,       setEnergy]       = useState(5);
  const [painLeft,     setPainLeft]     = useState(0);
  const [painRight,    setPainRight]    = useState(0);
  const [swellingLeft, setSwellingLeft] = useState(0);
  const [notes,        setNotes]        = useState('');

  const handleSave = useCallback(() => {
    const feedback: SessionFeedback = {
      difficulty,
      energy,
      painLeft,
      painRight,
      swellingLeft,
      notes: notes.trim(),
    };
    endSession(feedback);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }, [difficulty, energy, painLeft, painRight, swellingLeft, notes, endSession, navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Come è andata?</Text>
        <Text style={styles.subtitle}>Registra la tua percezione dell'allenamento</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance</Text>
          <SliderInput
            label="Difficoltà percepita"
            value={difficulty}
            min={1}
            max={10}
            onChange={setDifficulty}
          />
          <SliderInput
            label="Livello di energia"
            value={energy}
            min={1}
            max={10}
            onChange={setEnergy}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ginocchio</Text>
          <SliderInput
            label="Dolore ginocchio sinistro"
            value={painLeft}
            min={0}
            max={10}
            onChange={setPainLeft}
          />
          <SliderInput
            label="Dolore ginocchio destro"
            value={painRight}
            min={0}
            max={10}
            onChange={setPainRight}
          />
          <SliderInput
            label="Sensazione gonfiore (sx)"
            value={swellingLeft}
            min={0}
            max={10}
            onChange={setSwellingLeft}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Note libere</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Annotazioni, sensazioni, variazioni usate..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Salva e Chiudi</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: colors.background,
  },
  content: {
    padding:       spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize:     26,
    fontWeight:   '700',
    color:        colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize:     14,
    color:        colors.textMuted,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius:    16,
    padding:         spacing.lg,
    marginBottom:    spacing.md,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  cardTitle: {
    fontSize:     13,
    fontWeight:   '700',
    color:        colors.textMuted,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  notesInput: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius:    12,
    padding:         spacing.md,
    fontSize:        15,
    color:           colors.text,
    borderWidth:     1,
    borderColor:     colors.border,
    minHeight:       100,
    lineHeight:      22,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius:    16,
    paddingVertical: spacing.md + 4,
    alignItems:      'center',
    marginTop:       spacing.md,
    minHeight:       56,
    justifyContent:  'center',
  },
  saveBtnText: {
    fontSize:   17,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
});
