import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View, Text, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { useWorkout } from '../context/WorkoutContext';
import { useRestTimer } from '../hooks/useRestTimer';
import { SetSlot } from '../components/SetSlot';
import { RestTimer } from '../components/RestTimer';
import { getExercisesForScheda, kneeRoutine, formatSetTarget, formatRestRange, schedaDProgression, painManagementRule } from '../data/workoutData';
import { colors, spacing } from '../constants';

type Props = NativeStackScreenProps<HomeStackParamList, 'ExerciseDetail'>;

export function ExerciseDetailScreen({ route, navigation }: Props) {
  const { exerciseIndex } = route.params;
  const preview = route.params.preview ?? false;
  const { state, logSet, startActiveRest, clearActiveRest, adjustActiveRest, editSet } = useWorkout();
  const scheda = state.selectedScheda!;

  // Always include knee routine so indices from ExerciseListScreen resolve correctly
  const allExercises = useMemo(
    () => [...getExercisesForScheda(scheda), ...kneeRoutine],
    [scheda]
  );

  const exercise = allExercises[exerciseIndex];

  // Logged sets for this exercise
  const loggedSets = state.currentSession?.sets.filter(
    (s: any) => s.exerciseName === exercise.name
  ) ?? [];

  // Previous session sets for reference chips
  const prevExerciseSets = useMemo(() => {
    for (const session of state.sessions) {
      const sets = session.sets.filter((s: any) => s.exerciseName === exercise.name);
      if (sets.length > 0) return sets;
    }
    return [];
  }, [state.sessions, exercise.name]);

  const nextSetNumber = loggedSets.length + 1;
  const allDone       = loggedSets.length >= exercise.defaultSets;

  // Active-set form state
  const [weightInput,  setWeightInput]  = useState('');
  const [repsInput,    setRepsInput]    = useState('');
  const [noteInput,    setNoteInput]    = useState('');
  const [restDuration, setRestDuration] = useState(exercise.restSecMax || 90);
  const [timerVisible, setTimerVisible] = useState(false);

  // Edit state
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  const onTimerComplete = useCallback(() => {
    setTimerVisible(false);
    clearActiveRest();
  }, [clearActiveRest]);
  const restTimer = useRestTimer(onTimerComplete);

  // Restore a running timer if context has one for this exercise
  useEffect(() => {
    if (preview) return;
    const ar = state.activeRest;
    if (!ar || ar.exerciseIndex !== exerciseIndex) return;
    const remaining = Math.max(0, Math.round((ar.endsAt - Date.now()) / 1000));
    if (remaining > 0) {
      restTimer.startTimer(remaining);
      setTimerVisible(true);
    } else {
      clearActiveRest();
    }
  }, []); // run once on mount only

  const handleLogSet = useCallback(async () => {
    if (allDone) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const weight = weightInput.trim() ? parseFloat(weightInput) : null;
    const repsOrHold = repsInput.trim() ? parseInt(repsInput, 10) : null;

    logSet({
      exerciseName: exercise.name,
      setNumber:    nextSetNumber,
      weightKg:     weight,
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
      startActiveRest(exerciseIndex, restDuration);
    }
  }, [
    allDone, weightInput, repsInput, noteInput,
    exercise, nextSetNumber, logSet, restDuration, restTimer,
    startActiveRest, exerciseIndex,
  ]);

  const handleAdjustDuration = useCallback((delta: number) => {
    setRestDuration(prev => Math.max(15, prev + delta));
    if (restTimer.isRunning && !restTimer.isPaused) {
      restTimer.adjust(delta);
      adjustActiveRest(delta);
    }
  }, [restTimer, adjustActiveRest]);

  const handleSkip = useCallback(() => {
    restTimer.stop();
    setTimerVisible(false);
    clearActiveRest();
  }, [restTimer, clearActiveRest]);

  const handleEditTap = useCallback((setId: string) => {
    setEditingSetId(prev => (prev === setId ? null : setId));
  }, []);

  const handleEditSave = useCallback((setId: string, updates: {
    weightKg: number | null;
    reps: number | null;
    holdSeconds: number | null;
    note: string;
  }) => {
    editSet(setId, updates);
    setEditingSetId(null);
  }, [editSet]);

  const handleEditCancel = useCallback(() => {
    setEditingSetId(null);
  }, []);

  if (!exercise) return null;

  const isHold  = exercise.variant === 'hold';
  const totalSets = exercise.defaultSets;

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
            {preview && (
              <View style={styles.previewBadge}>
                <Text style={styles.previewBadgeText}>ANTEPRIMA — nessun dato verrà registrato</Text>
              </View>
            )}

            {/* Leg Extension Version Logic */}
            {exercise.name === 'Leg extension terapeutica al posto dello squat – versione A' && (
              <View style={styles.versionLogic}>
                <Text style={styles.versionLogicTitle}>🔴 Quando usare SOLO questa versione:</Text>
                <Text style={styles.versionLogicText}>• Ginocchio impastato al mattino</Text>
                <Text style={styles.versionLogicText}>• Fastidio dopo seduta prolungata</Text>
                <Text style={styles.versionLogicText}>{'• Dolore > 2/10 nel warm-up'}</Text>
              </View>
            )}
            {exercise.name === 'Leg extension terapeutica al posto dello squat – versione B' && (
              <View style={styles.versionLogic}>
                <Text style={styles.versionLogicTitle}>🟢 Quando puoi usare questa versione:</Text>
                <Text style={styles.versionLogicText}>• Warm-up è stato ok</Text>
                <Text style={styles.versionLogicText}>• Dolore 0–2/10</Text>
                <Text style={styles.versionLogicText}>• Nessun flare dalla seduta precedente (24h)</Text>
              </View>
            )}

            {/* Pain Management Rule */}
            <View style={styles.painRule}>
              <Text style={styles.painRuleTitle}>📊 Regola Dolore — Guida Progressione</Text>
              <View style={styles.painTable}>
                <View style={styles.painTableRow}>
                  <Text style={styles.painTableHeader}>Dolore</Text>
                  <Text style={[styles.painTableHeader, { flex: 2 }]}>Azione</Text>
                </View>
                <View style={[styles.painTableRow, styles.painTableRowAlt]}>
                  <Text style={styles.painTableKey}>0–2/10</Text>
                  <Text style={[styles.painTableValue, { flex: 2 }]}>Procedi. +1–2 reps, +2,5–5% carico, o +1 set</Text>
                </View>
                <View style={styles.painTableRow}>
                  <Text style={styles.painTableKey}>3/10</Text>
                  <Text style={[styles.painTableValue, { flex: 2 }]}>Se migliora durante serie: mantieni 1 sett.</Text>
                </View>
                <View style={[styles.painTableRow, styles.painTableRowAlt]}>
                  <Text style={styles.painTableKey}>≥4/10</Text>
                  <Text style={[styles.painTableValue, { flex: 2, color: colors.error }]}>Stop/regressione immediata</Text>
                </View>
                <View style={styles.painTableRow}>
                  <Text style={styles.painTableKey}>Giorno dopo</Text>
                  <Text style={[styles.painTableValue, { flex: 2 }]}>Se peggiora: riduci 25–50% per 3–7 giorni</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Rest timer */}
          {!preview && timerVisible && (
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

          {/* All set slots */}
          {!preview && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Serie</Text>
              {Array.from({ length: totalSets }, (_, i) => {
                const slotNumber = i + 1;
                const logged = loggedSets.find((s: any) => s.setNumber === slotNumber);

                if (logged) {
                  if (editingSetId === logged.id) {
                    return (
                      <SetSlot
                        key={logged.id}
                        slotState="editing"
                        setNumber={slotNumber}
                        variant={exercise.variant}
                        set={logged}
                        onSave={(updates) => handleEditSave(logged.id, updates)}
                        onCancel={handleEditCancel}
                        prevSet={prevExerciseSets.find((s: any) => s.setNumber === slotNumber) ?? null}
                      />
                    );
                  }
                  return (
                    <SetSlot
                      key={logged.id}
                      slotState="logged"
                      setNumber={slotNumber}
                      variant={exercise.variant}
                      set={logged}
                      onTap={() => handleEditTap(logged.id)}
                    />
                  );
                }

                // This is the active slot
                if (slotNumber === nextSetNumber && !allDone) {
                  if (timerVisible) {
                    // Timer running — show locked
                    return (
                      <SetSlot
                        key={`slot-${slotNumber}`}
                        slotState="locked"
                        setNumber={slotNumber}
                        variant={exercise.variant}
                      />
                    );
                  }
                  return (
                    <SetSlot
                      key={`slot-${slotNumber}`}
                      slotState="active"
                      setNumber={slotNumber}
                      variant={exercise.variant}
                      weightInput={weightInput}
                      repsInput={repsInput}
                      noteInput={noteInput}
                      onChangeWeight={setWeightInput}
                      onChangeReps={setRepsInput}
                      onChangeNote={setNoteInput}
                      onLog={handleLogSet}
                      prevSet={prevExerciseSets.find((s: any) => s.setNumber === slotNumber) ?? null}
                    />
                  );
                }

                // Future placeholder
                return (
                  <SetSlot
                    key={`slot-${slotNumber}`}
                    slotState="future"
                    setNumber={slotNumber}
                    variant={exercise.variant}
                  />
                );
              })}
            </View>
          )}

          {/* All sets done */}
          {!preview && allDone && !timerVisible && (
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

          {/* Preview summary card */}
          {preview && (
            <View style={styles.previewCard}>
              <Text style={styles.previewCardTitle}>Struttura dell'esercizio</Text>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Serie</Text>
                <Text style={styles.previewValue}>{exercise.defaultSets}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>{exercise.variant === 'hold' ? 'Durata' : 'Ripetizioni'}</Text>
                <Text style={styles.previewValue}>{formatSetTarget(exercise)}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Riposo</Text>
                <Text style={styles.previewValue}>{formatRestRange(exercise)}</Text>
              </View>
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
    marginTop:       spacing.sm,
  },
  notesText: {
    fontSize:   13,
    color:      colors.textSecondary,
    lineHeight: 18,
  },
  versionLogic: {
    backgroundColor: colors.surface,
    borderRadius:    10,
    padding:         spacing.sm,
    marginTop:       spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  versionLogicTitle: {
    fontSize:     13,
    fontWeight:   '600',
    color:        colors.text,
    marginBottom: spacing.xs,
  },
  versionLogicText: {
    fontSize:     12,
    color:        colors.textSecondary,
    marginBottom: 4,
    lineHeight:   16,
  },
  painRule: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius:    10,
    padding:         spacing.md,
    marginTop:       spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  painRuleTitle: {
    fontSize:     14,
    fontWeight:   '600',
    color:        colors.text,
    marginBottom: spacing.sm,
  },
  painTable: {
    backgroundColor: colors.surface,
    borderRadius:    8,
    overflow:        'hidden',
  },
  painTableRow: {
    flexDirection:  'row',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  painTableRowAlt: {
    backgroundColor: colors.surfaceHighlight + '40',
  },
  painTableHeader: {
    fontSize:     12,
    fontWeight:   '600',
    color:        colors.textMuted,
    flex:         1,
  },
  painTableKey: {
    fontSize:     12,
    fontWeight:   '500',
    color:        colors.text,
    flex:         1,
  },
  painTableValue: {
    fontSize:     11,
    color:        colors.textSecondary,
    lineHeight:   14,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize:      13,
    fontWeight:    '600',
    color:         colors.textMuted,
    marginBottom:  spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    backgroundColor:   colors.surface,
    borderRadius:      12,
    paddingVertical:   spacing.sm,
    paddingHorizontal: spacing.xl,
    borderWidth:       1,
    borderColor:       colors.border,
    minHeight:         48,
    justifyContent:    'center',
  },
  backBtnText: {
    fontSize:   15,
    fontWeight: '600',
    color:      colors.textSecondary,
  },
  previewBadge: {
    backgroundColor:   colors.surfaceHighlight,
    borderRadius:      8,
    paddingHorizontal: spacing.sm,
    paddingVertical:   4,
    alignSelf:         'flex-start',
    marginTop:         spacing.sm,
    borderWidth:       1,
    borderColor:       colors.border,
  },
  previewBadgeText: {
    fontSize:      11,
    fontWeight:    '600',
    color:         colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius:    14,
    padding:         spacing.md,
    borderWidth:     1,
    borderColor:     colors.border,
    marginBottom:    spacing.lg,
  },
  previewCardTitle: {
    fontSize:      13,
    fontWeight:    '600',
    color:         colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom:  spacing.md,
  },
  previewRow: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    paddingVertical:   spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  previewLabel: {
    fontSize: 14,
    color:    colors.textSecondary,
  },
  previewValue: {
    fontSize:   14,
    fontWeight: '600',
    color:      colors.text,
  },
});
