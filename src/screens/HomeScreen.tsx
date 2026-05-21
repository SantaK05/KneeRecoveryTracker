import React, { useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { WorkoutCard } from '../components/WorkoutCard';
import { useWorkout } from '../context/WorkoutContext';
import { useTimer } from '../hooks/useTimer';
import { colors, spacing } from '../constants';
import { Scheda } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const SCHEDAS: Scheda[] = ['A', 'B', 'C', 'D', 'E'];

const italianDate = (): string =>
  new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  });

export function HomeScreen({ navigation }: Props) {
  const { state, selectScheda, startSession } = useWorkout();
  const timer = useTimer();

  const handleStartWorkout = useCallback(() => {
    if (!state.selectedScheda) return;
    startSession(state.selectedScheda);
    navigation.navigate('ExerciseList');
  }, [state.selectedScheda, startSession, navigation]);

  const toggleTimer = useCallback(() => {
    timer.isRunning ? timer.stop() : timer.start();
  }, [timer]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Allenamento</Text>
          <Text style={styles.date}>{italianDate()}</Text>
        </View>

        {/* Session Timer */}
        <TouchableOpacity style={styles.timerCard} onPress={toggleTimer} activeOpacity={0.8}>
          <Text style={styles.timerLabel}>
            {timer.isRunning ? 'Sessione in corso' : 'Tocca per avviare il timer'}
          </Text>
          <Text style={styles.timerValue}>{timer.formattedTime}</Text>
          <View style={[styles.timerIndicator, timer.isRunning && styles.timerActive]} />
        </TouchableOpacity>

        {/* Scheda Selector */}
        <Text style={styles.sectionTitle}>Seleziona Scheda</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardScroll}
          contentContainerStyle={styles.cardScrollContent}
        >
          {SCHEDAS.map(s => (
            <WorkoutCard
              key={s}
              scheda={s}
              isSelected={state.selectedScheda === s}
              onPress={() => selectScheda(s)}
            />
          ))}
        </ScrollView>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startBtn, !state.selectedScheda && styles.startBtnDisabled]}
          onPress={handleStartWorkout}
          disabled={!state.selectedScheda}
          activeOpacity={0.8}
        >
          <Text style={styles.startBtnText}>Inizia Allenamento →</Text>
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
  scroll: {
    flex: 1,
  },
  content: {
    padding:     spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize:   28,
    fontWeight: '700',
    color:      colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize:   15,
    color:      colors.textSecondary,
    textTransform: 'capitalize',
  },
  timerCard: {
    backgroundColor: colors.surface,
    borderRadius:    20,
    padding:         spacing.xl,
    alignItems:      'center',
    marginBottom:    spacing.xl,
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
  sectionTitle: {
    fontSize:     16,
    fontWeight:   '600',
    color:        colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardScroll: {
    marginHorizontal: -spacing.lg,
    marginBottom:     spacing.xl,
  },
  cardScrollContent: {
    paddingHorizontal: spacing.lg,
  },
  startBtn: {
    backgroundColor: colors.accent,
    borderRadius:    16,
    paddingVertical: spacing.md + 4,
    alignItems:      'center',
    minHeight:       56,
    justifyContent:  'center',
  },
  startBtnDisabled: {
    backgroundColor: colors.surfaceHighlight,
  },
  startBtnText: {
    fontSize:   17,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
});
