import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { useWorkout } from '../context/WorkoutContext';
import { getExercisesForScheda, kneeRoutine, formatSetTarget, formatRestRange } from '../data/workoutData';
import { Exercise } from '../types';
import { colors, spacing } from '../constants';

type Props = NativeStackScreenProps<HomeStackParamList, 'ExerciseList'>;

function formatHHMMSS(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

export function ExerciseListScreen({ route, navigation }: Props) {
  const preview = route.params?.preview ?? false;
  const { state, startSession, pauseSessionTimer, resumeSessionTimer } = useWorkout();
  const scheda = state.selectedScheda!;
  const isUpperBody = !['B', 'D'].includes(scheda);
  const activeRest   = state.activeRest;
  const sessionTimer = state.sessionTimer;

  // Re-render every second while timer is running (skip in preview mode)
  const [, setTick] = useState(0);
  useEffect(() => {
    if (preview || !sessionTimer?.runningFrom) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [preview, sessionTimer?.runningFrom]);

  const sessionIsRunning = sessionTimer !== null && sessionTimer.runningFrom !== null;
  const sessionElapsedMs = sessionTimer
    ? sessionTimer.accumulatedMs + (sessionTimer.runningFrom !== null ? Date.now() - sessionTimer.runningFrom : 0)
    : 0;
  const sessionFormattedTime = formatHHMMSS(Math.floor(sessionElapsedMs / 1000));

  const toggleTimer = useCallback(() => {
    if (sessionIsRunning) pauseSessionTimer();
    else resumeSessionTimer();
  }, [sessionIsRunning, pauseSessionTimer, resumeSessionTimer]);

  const [showKneeRoutine, setShowKneeRoutine] = useState(false);

  const baseExercises = getExercisesForScheda(scheda);
  const exercises: Exercise[] = showKneeRoutine
    ? [...baseExercises, ...kneeRoutine]
    : baseExercises;

  const loggedSetCount = (exerciseName: string): number =>
    state.currentSession?.sets.filter(s => s.exerciseName === exerciseName).length ?? 0;

  const isComplete = (exercise: Exercise): boolean =>
    loggedSetCount(exercise.name) >= exercise.defaultSets;

  const renderItem = ({ item, index }: { item: Exercise; index: number }) => {
    const done    = isComplete(item);
    const logged  = loggedSetCount(item.name);

    return (
      <TouchableOpacity
        style={[styles.row, done && styles.rowDone]}
        onPress={() => navigation.navigate('ExerciseDetail', { exerciseIndex: index, preview })}
        activeOpacity={0.75}
      >
        <View style={styles.rowLeft}>
          <View style={[styles.indexBadge, done && styles.indexBadgeDone]}>
            {done
              ? <Text style={styles.checkmark}>✓</Text>
              : <Text style={styles.indexText}>{index + 1}</Text>
            }
          </View>
          <View style={styles.rowInfo}>
            <Text style={[styles.exerciseName, done && styles.exerciseNameDone]} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.exerciseMeta}>
              {formatSetTarget(item)} · riposo {formatRestRange(item)}
            </Text>
          </View>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>
            {preview ? `${item.defaultSets} set` : `${logged}/${item.defaultSets}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={exercises}
        keyExtractor={item => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {!preview && (
              <TouchableOpacity style={styles.timerCard} onPress={toggleTimer} activeOpacity={0.8}>
                <Text style={styles.timerLabel}>
                  {sessionIsRunning ? 'Sessione in corso' : 'Sessione in pausa'}
                </Text>
                <Text style={styles.timerValue}>{sessionFormattedTime}</Text>
                <View style={[styles.timerIndicator, sessionIsRunning && styles.timerActive]} />
              </TouchableOpacity>
            )}
            {!preview && activeRest && (
              <TouchableOpacity
                style={styles.restBanner}
                onPress={() => navigation.navigate('ExerciseDetail', { exerciseIndex: activeRest.exerciseIndex, preview })}
                activeOpacity={0.8}
              >
                <View style={styles.restBannerLeft}>
                  <View style={styles.restBannerDot} />
                  <Text style={styles.restBannerText}>Riposo in corso</Text>
                </View>
                <Text style={styles.restBannerCta}>Torna →</Text>
              </TouchableOpacity>
            )}
            {isUpperBody && (
              <View style={styles.upperBodyBanner}>
                <Text style={styles.upperBodyText}>Scheda {scheda} — Upper Body</Text>
                <Text style={styles.upperBodySub}>Nessun esercizio lower body in questa scheda.</Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {!preview && isUpperBody && !showKneeRoutine && (
              <TouchableOpacity
                style={styles.kneeBtn}
                onPress={() => setShowKneeRoutine(true)}
              >
                <Text style={styles.kneeBtnText}>+ Aggiungi Routine Ginocchio</Text>
                <Text style={styles.kneeBtnSub}>12–15 min · esercizi di riabilitazione</Text>
              </TouchableOpacity>
            )}
            {!preview ? (
              <TouchableOpacity
                style={styles.endBtn}
                onPress={() => navigation.navigate('Feedback')}
              >
                <Text style={styles.endBtnText}>Termina Allenamento</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.startFromPreviewBtn}
                onPress={() => {
                  startSession(scheda);
                  navigation.replace('ExerciseList');
                }}
              >
                <Text style={styles.startFromPreviewBtnText}>Inizia Allenamento →</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    backgroundColor: colors.surface,
    borderRadius:    14,
    padding:         spacing.md,
    marginBottom:    spacing.sm,
    minHeight:       72,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  rowDone: {
    borderColor: colors.success + '40',
    backgroundColor: '#0D1F12',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    flex:          1,
    marginRight:   spacing.sm,
  },
  indexBadge: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: colors.surfaceHighlight,
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     spacing.sm,
    flexShrink:      0,
  },
  indexBadgeDone: {
    backgroundColor: colors.success + '30',
  },
  indexText: {
    fontSize:   14,
    fontWeight: '600',
    color:      colors.textSecondary,
  },
  checkmark: {
    fontSize: 16,
    color:    colors.success,
  },
  rowInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize:     15,
    fontWeight:   '600',
    color:        colors.text,
    marginBottom: 2,
  },
  exerciseNameDone: {
    color: colors.textSecondary,
  },
  exerciseMeta: {
    fontSize: 12,
    color:    colors.textMuted,
  },
  progressBadge: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius:    8,
    paddingHorizontal: spacing.sm,
    paddingVertical:   4,
    minWidth:          40,
    alignItems:        'center',
  },
  progressText: {
    fontSize:   13,
    fontWeight: '600',
    color:      colors.textSecondary,
  },
  timerCard: {
    backgroundColor: colors.surface,
    borderRadius:    20,
    padding:         spacing.xl,
    alignItems:      'center',
    marginBottom:    spacing.md,
    borderWidth:     1,
    borderColor:     colors.border,
    position:        'relative',
    overflow:        'hidden',
  },
  timerLabel: {
    fontSize:     13,
    color:        colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timerValue: {
    fontSize:      48,
    fontWeight:    '700',
    color:         colors.text,
    letterSpacing: -1,
  },
  timerIndicator: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    height:          3,
    backgroundColor: colors.border,
    borderRadius:    1.5,
  },
  timerActive: {
    backgroundColor: colors.accent,
  },
  upperBodyBanner: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius:    14,
    padding:         spacing.md,
    marginBottom:    spacing.md,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  upperBodyText: {
    fontSize:     15,
    fontWeight:   '600',
    color:        colors.text,
    marginBottom: 4,
  },
  upperBodySub: {
    fontSize: 13,
    color:    colors.textMuted,
  },
  footer: {
    marginTop: spacing.lg,
    gap:       spacing.sm,
  },
  kneeBtn: {
    backgroundColor: colors.surface,
    borderRadius:    14,
    padding:         spacing.md,
    borderWidth:     1,
    borderColor:     colors.accent + '60',
    alignItems:      'center',
    minHeight:       64,
    justifyContent:  'center',
  },
  kneeBtnText: {
    fontSize:   15,
    fontWeight: '600',
    color:      colors.accent,
    marginBottom: 2,
  },
  kneeBtnSub: {
    fontSize: 12,
    color:    colors.textMuted,
  },
  endBtn: {
    backgroundColor: colors.error,
    borderRadius:    14,
    paddingVertical: spacing.md,
    alignItems:      'center',
    minHeight:       52,
    justifyContent:  'center',
  },
  endBtnText: {
    fontSize:   16,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
  restBanner: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    backgroundColor: colors.surface,
    borderRadius:    14,
    padding:         spacing.md,
    marginBottom:    spacing.md,
    borderWidth:     1,
    borderColor:     colors.accent + '80',
  },
  restBannerLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.sm,
  },
  restBannerDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: colors.accent,
  },
  restBannerText: {
    fontSize:   15,
    fontWeight: '600',
    color:      colors.text,
  },
  restBannerCta: {
    fontSize:   14,
    fontWeight: '600',
    color:      colors.accent,
  },
  startFromPreviewBtn: {
    backgroundColor: colors.accent,
    borderRadius:    14,
    paddingVertical: spacing.md,
    alignItems:      'center',
    minHeight:       52,
    justifyContent:  'center',
  },
  startFromPreviewBtnText: {
    fontSize:   16,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
});
