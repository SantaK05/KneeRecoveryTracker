import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { useWorkout } from '../context/WorkoutContext';
import { getExercisesForScheda, kneeRoutine, formatSetTarget, formatRestRange } from '../data/workoutData';
import { Exercise } from '../types';
import { colors, spacing } from '../constants';

type Props = NativeStackScreenProps<HomeStackParamList, 'ExerciseList'>;

export function ExerciseListScreen({ navigation }: Props) {
  const { state } = useWorkout();
  const scheda = state.selectedScheda!;
  const isUpperBody = !['B', 'D'].includes(scheda);

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
        onPress={() => navigation.navigate('ExerciseDetail', { exerciseIndex: index })}
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
          <Text style={styles.progressText}>{logged}/{item.defaultSets}</Text>
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
          isUpperBody ? (
            <View style={styles.upperBodyBanner}>
              <Text style={styles.upperBodyText}>Scheda {scheda} — Upper Body</Text>
              <Text style={styles.upperBodySub}>Nessun esercizio lower body in questa scheda.</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {isUpperBody && !showKneeRoutine && (
              <TouchableOpacity
                style={styles.kneeBtn}
                onPress={() => setShowKneeRoutine(true)}
              >
                <Text style={styles.kneeBtnText}>+ Aggiungi Routine Ginocchio</Text>
                <Text style={styles.kneeBtnSub}>12–15 min · esercizi di riabilitazione</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.endBtn}
              onPress={() => navigation.navigate('Feedback')}
            >
              <Text style={styles.endBtnText}>Termina Allenamento</Text>
            </TouchableOpacity>
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
});
