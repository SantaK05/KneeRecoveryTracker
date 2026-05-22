import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { WorkoutCard } from '../components/WorkoutCard';
import { useWorkout } from '../context/WorkoutContext';
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

  const handleStartWorkout = useCallback(() => {
    if (!state.selectedScheda) return;
    startSession(state.selectedScheda);
    navigation.navigate('ExerciseList');
  }, [state.selectedScheda, startSession, navigation]);

  const handleResumeWorkout = useCallback(() => {
    navigation.navigate('ExerciseList');
  }, [navigation]);

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

        {/* Resume banner when a session is already active */}
        {state.currentSession && (
          <TouchableOpacity style={styles.resumeCard} onPress={handleResumeWorkout} activeOpacity={0.8}>
            <View style={styles.resumeCardLeft}>
              <View style={styles.resumeDot} />
              <View>
                <Text style={styles.resumeTitle}>Allenamento in corso</Text>
                <Text style={styles.resumeSub}>Scheda {state.currentSession.scheda} · Tocca per riprendere</Text>
              </View>
            </View>
            <Text style={styles.resumeArrow}>→</Text>
          </TouchableOpacity>
        )}

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
  resumeCard: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    backgroundColor: colors.surface,
    borderRadius:    16,
    padding:         spacing.md,
    marginBottom:    spacing.xl,
    borderWidth:     1,
    borderColor:     colors.accent + '80',
  },
  resumeCardLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.md,
    flex:          1,
  },
  resumeDot: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: colors.accent,
    flexShrink:      0,
  },
  resumeTitle: {
    fontSize:     15,
    fontWeight:   '600',
    color:        colors.text,
    marginBottom: 2,
  },
  resumeSub: {
    fontSize: 13,
    color:    colors.textMuted,
  },
  resumeArrow: {
    fontSize:   18,
    color:      colors.accent,
    fontWeight: '600',
  },
});
