import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { useWorkout } from '../context/WorkoutContext';
import { useRestTimer } from '../hooks/useRestTimer';
import { SetRow } from '../components/SetRow';
import { RestTimer } from '../components/RestTimer';
import { getExercisesForScheda, kneeRoutine, formatSetTarget, formatRestRange } from '../data/workoutData';
import { colors, spacing } from '../constants';

type Props = NativeStackScreenProps<HomeStackParamList, 'ExerciseDetail'>;

export function ExerciseDetailScreen({ route, navigation }: Props) {
  const { exerciseIndex } = route.params;
  const { state, logSet } = useWorkout();
  const scheda = state.selectedScheda!;

  // Always include knee routine so indices from ExerciseListScreen resolve correctly
  const allExercises = useMemo(
    () => [...getExercisesForScheda(scheda), ...kneeRoutine],
    [scheda]
  );

  const exercise = allExercises[exerciseIndex];

  // Logged sets for this exercise
  const loggedSets = state.currentSession?.sets.filter(
    s => s.exerciseName === exercise.name
  ) ?? [];

  const nextSetNumber = loggedSets.length + 1;
  const allDone       = loggedSets.length >= exercise.defaultSets;

  // Form state
  const [weightInput,  setWeightInput]  = useState('');
  const [repsInput,    setRepsInput]    = useState('');
  const [noteInput,    setNoteInput]    = useState('');
  const [restDuration, setRestDuration] = useState(exercise.restSecMax || 90);
  const [timerVisible, setTimerVisible] = useState(false);

  const onTimerComplete = useCallback(() => setTimerVisible(false), []);
  const restTimer = useRestTimer(onTimerComplete);

  const handleLogSet = useCallback(async () => {
    if (allDone) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const weight = weightInput.trim() ? parseFloat(weightInput) : null;
    const repsOrHold = repsInput.trim() ? parseInt(repsInput, 10) : null;

    logSet({
      exerciseName: exercise.name,
      setNumber:    nextSetNumber,
      weightKg:     exercise.variant === 'hold' ? null : weight,
      reps:         exercise.variant === 'hold' ? null : repsOrHold,
      holdSeconds:  exercise.variant === 'hold' ? repsOrHold : null,
      note:         noteInput.trim(),
    });

    // Clear form
    setWeightInput('');
    setRepsInput('');
    setNoteInput('');

    // Start rest timer if duration > 0
    if (restDuration > 0) {
      restTimer.startTimer(restDuration);
      setTimerVisible(true);
    }
  }, [
    allDone, weightInput, repsInput, noteInput,
    exercise, nextSetNumber, logSet, restDuration, restTimer,
  ]);

  const handleAdjustDuration = useCallback((delta: number) => {
    setRestDuration(prev => Math.max(15, prev + delta));
  }, []);

  const handleSkip = useCallback(() => {
    restTimer.stop();
    setTimerVisible(false);
  }, [restTimer]);

  if (!exercise) return null;

  const isHold  = exercise.variant === 'hold';
  const repLabel = isHold ? 'Secondi' : exercise.variant === 'reps_per_side' ? 'Reps/lato' : 'Reps';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Exercise header */}
          <View style={styles.header}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.target}>{formatSetTarget(exercise)} · riposo {formatRestRange(exercise)}</Text>
            {exercise.notes ? (
              <View style={styles.notesBanner}>
                <Text style={styles.notesText}>{exercise.notes}</Text>
              </View>
            ) : null}
          </View>

          {/* Logged sets */}
          {loggedSets.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Set completati</Text>
              {loggedSets.map(s => (
                <SetRow key={s.id} set={s} variant={exercise.variant} />
              ))}
            </View>
          )}

          {/* Rest timer */}
          {timerVisible && (
            <RestTimer
              formattedTime={restTimer.formattedTime}
              isRunning={restTimer.isRunning}
              isPaused={restTimer.isPaused}
              durationSec={restDuration}
              onPause={restTimer.pause}
              onResume={restTimer.resume}
              onRestart={restTimer.restart}
              onSkip={handleSkip}
              onAdjust={handleAdjustDuration}
            />
          )}

          {/* Set input form */}
          {!allDone && !timerVisible && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Set {nextSetNumber} di {exercise.defaultSets}</Text>

              <View style={styles.inputRow}>
                {!isHold && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Peso (kg)</Text>
                    <TextInput
                      style={styles.input}
                      value={weightInput}
                      onChangeText={setWeightInput}
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="decimal-pad"
                      returnKeyType="next"
                    />
                  </View>
                )}
                <View style={[styles.inputGroup, isHold && styles.inputGroupFull]}>
                  <Text style={styles.inputLabel}>{repLabel}</Text>
                  <TextInput
                    style={styles.input}
                    value={repsInput}
                    onChangeText={setRepsInput}
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    returnKeyType="next"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Note (opzionale)</Text>
                <TextInput
                  style={[styles.input, styles.inputNote]}
                  value={noteInput}
                  onChangeText={setNoteInput}
                  placeholder="es. 40 kg, buona forma..."
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="done"
                />
              </View>

              <TouchableOpacity
                style={styles.logBtn}
                onPress={handleLogSet}
                activeOpacity={0.8}
              >
                <Text style={styles.logBtnText}>✓  Set Completato</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* All sets done */}
          {allDone && !timerVisible && (
            <View style={styles.doneCard}>
              <Text style={styles.doneEmoji}>🎯</Text>
              <Text style={styles.doneTitle}>Esercizio Completato!</Text>
              <Text style={styles.doneSub}>Tutti i {exercise.defaultSets} set sono stati registrati.</Text>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Text style={styles.backBtnText}>← Torna alla lista</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  kav:  { flex: 1 },
  content: {
    padding:       spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  exerciseName: {
    fontSize:     22,
    fontWeight:   '700',
    color:        colors.text,
    marginBottom: spacing.xs,
  },
  target: {
    fontSize:     13,
    color:        colors.textMuted,
    marginBottom: spacing.sm,
  },
  notesBanner: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius:    10,
    padding:         spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  notesText: {
    fontSize:   13,
    color:      colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize:     13,
    fontWeight:   '600',
    color:        colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    gap:           spacing.sm,
    marginBottom:  spacing.sm,
  },
  inputGroup: {
    flex: 1,
  },
  inputGroupFull: {
    flex: 1,
  },
  inputLabel: {
    fontSize:     12,
    color:        colors.textMuted,
    marginBottom: 6,
    fontWeight:   '500',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius:    12,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm + 2,
    fontSize:        17,
    color:           colors.text,
    borderWidth:     1,
    borderColor:     colors.border,
    minHeight:       48,
  },
  inputNote: {
    width:     '100%',
    marginBottom: spacing.md,
  },
  logBtn: {
    backgroundColor: colors.accent,
    borderRadius:    14,
    paddingVertical: spacing.md,
    alignItems:      'center',
    minHeight:       52,
    justifyContent:  'center',
  },
  logBtnText: {
    fontSize:   17,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
  doneCard: {
    backgroundColor: '#0D1F12',
    borderRadius:    20,
    padding:         spacing.xl,
    alignItems:      'center',
    borderWidth:     1,
    borderColor:     colors.success + '40',
    marginTop:       spacing.lg,
  },
  doneEmoji: {
    fontSize:     40,
    marginBottom: spacing.sm,
  },
  doneTitle: {
    fontSize:     20,
    fontWeight:   '700',
    color:        colors.success,
    marginBottom: spacing.xs,
  },
  doneSub: {
    fontSize:     14,
    color:        colors.textMuted,
    marginBottom: spacing.xl,
    textAlign:    'center',
  },
  backBtn: {
    backgroundColor: colors.surface,
    borderRadius:    12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderWidth:     1,
    borderColor:     colors.border,
    minHeight:       48,
    justifyContent:  'center',
  },
  backBtnText: {
    fontSize:   15,
    fontWeight: '600',
    color:      colors.textSecondary,
  },
});
