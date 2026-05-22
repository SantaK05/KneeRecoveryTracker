import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useMemo } from 'react';
import {
  View, Text, SectionList, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../navigation/types';
import { useWorkout } from '../context/WorkoutContext';
import { SetRow } from '../components/SetRow';
import { getExercisesForScheda, kneeRoutine } from '../data/workoutData';
import { colors, spacing, schedaDescriptions } from '../constants';
import { SetRecord, HistorySession, ExerciseVariant } from '../types';

type Props = NativeStackScreenProps<HistoryStackParamList, 'SessionDetail'>;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('it-IT', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  });
}

function formatDuration(startTs: string, endTs: string): string {
  const ms  = new Date(endTs).getTime() - new Date(startTs).getTime();
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

export function SessionDetailScreen({ route, navigation }: Props) {
  const { sessionId } = route.params;
  const { state, deleteSession } = useWorkout();

  const session = useMemo(
    () => state.sessions.find(s => s.id === sessionId) as HistorySession | undefined,
    [state.sessions, sessionId]
  );

  const sections = useMemo(() => {
    if (!session) return [];
    // Group sets by exercise name, preserving order
    const allExerciseNames = [...new Set(session.sets.map(s => s.exerciseName))];
    const allExercises = [
      ...getExercisesForScheda(session.scheda),
      ...kneeRoutine,
    ];
    const variantMap: Record<string, ExerciseVariant> = {};
    allExercises.forEach(e => { variantMap[e.name] = e.variant; });

    return allExerciseNames.map(name => ({
      title:   name,
      variant: variantMap[name] ?? 'reps',
      data:    session.sets.filter(s => s.exerciseName === name),
    }));
  }, [session]);

  const handleDelete = () => {
    Alert.alert(
      'Elimina sessione',
      'Sei sicuro di voler eliminare questa sessione? L\'operazione non è reversibile.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            await deleteSession(sessionId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sessione non trovata.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const fb = session.feedback;

  return (
    <SafeAreaView style={styles.safe}>
      <SectionList
        sections={sections}
        keyExtractor={(item: SetRecord) => item.id}
        renderItem={({ item, section }) => (
          <SetRow set={item} variant={(section as any).variant} />
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        ListHeaderComponent={
          <View>
            {/* Session overview */}
            <View style={styles.overviewCard}>
              <Text style={styles.scheda}>Scheda {session.scheda}</Text>
              <Text style={styles.schedaDesc}>{schedaDescriptions[session.scheda]}</Text>
              <Text style={styles.date}>{formatDate(session.date)}</Text>
              <View style={styles.statRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{session.sets.length}</Text>
                  <Text style={styles.statLabel}>Set totali</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{formatDuration(session.startTs, session.endTs)}</Text>
                  <Text style={styles.statLabel}>Durata</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {fb ? ((fb.painLeft + fb.painRight) / 2).toFixed(1) : '—'}
                  </Text>
                  <Text style={styles.statLabel}>Dolore medio</Text>
                </View>
              </View>
            </View>

            {/* Feedback */}
            {fb && (
              <View style={styles.feedbackCard}>
                <Text style={styles.feedbackTitle}>Feedback</Text>
                <View style={styles.feedbackGrid}>
                  <FeedbackStat label="Difficoltà" value={fb.difficulty} max={10} />
                  <FeedbackStat label="Energia"    value={fb.energy}     max={10} />
                  <FeedbackStat label="Dolore sx"  value={fb.painLeft}   max={10} />
                  <FeedbackStat label="Dolore dx"  value={fb.painRight}  max={10} />
                  <FeedbackStat label="Gonfiore sx" value={fb.swellingLeft} max={10} />
                </View>
                {fb.notes ? (
                  <View style={styles.fbNoteBox}>
                    <Text style={styles.fbNoteText}>{fb.notes}</Text>
                  </View>
                ) : null}
              </View>
            )}

            <Text style={styles.exercisesTitle}>Esercizi</Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.75}>
            <Text style={styles.deleteButtonText}>Elimina sessione</Text>
          </TouchableOpacity>
        }
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
  );
}

function FeedbackStat({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <View style={fbStyles.stat}>
      <Text style={fbStyles.value}>{value}<Text style={fbStyles.max}>/{max}</Text></Text>
      <Text style={fbStyles.label}>{label}</Text>
    </View>
  );
}

const fbStyles = StyleSheet.create({
  stat: {
    alignItems:   'center',
    paddingVertical: spacing.sm,
    minWidth:     72,
  },
  value: {
    fontSize:   22,
    fontWeight: '700',
    color:      colors.accent,
  },
  max: {
    fontSize:   14,
    color:      colors.textMuted,
    fontWeight: '400',
  },
  label: {
    fontSize:  11,
    color:     colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: colors.background,
  },
  content: {
    padding:       spacing.md,
    paddingBottom: spacing.xxl,
  },
  overviewCard: {
    backgroundColor: colors.surface,
    borderRadius:    16,
    padding:         spacing.lg,
    marginBottom:    spacing.md,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  scheda: {
    fontSize:     24,
    fontWeight:   '700',
    color:        colors.text,
  },
  schedaDesc: {
    fontSize:     13,
    color:        colors.textMuted,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize:     14,
    color:        colors.textSecondary,
    marginBottom: spacing.lg,
    textTransform: 'capitalize',
  },
  statRow: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  stat: {
    flex:       1,
    alignItems: 'center',
  },
  statValue: {
    fontSize:     20,
    fontWeight:   '700',
    color:        colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color:    colors.textMuted,
  },
  statDivider: {
    width:      1,
    height:     32,
    backgroundColor: colors.border,
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius:    16,
    padding:         spacing.lg,
    marginBottom:    spacing.md,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  feedbackTitle: {
    fontSize:     13,
    fontWeight:   '700',
    color:        colors.textMuted,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  feedbackGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
  },
  fbNoteBox: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius:    10,
    padding:         spacing.sm,
    marginTop:       spacing.sm,
  },
  fbNoteText: {
    fontSize:   13,
    color:      colors.textSecondary,
    lineHeight: 18,
  },
  exercisesTitle: {
    fontSize:     13,
    fontWeight:   '700',
    color:        colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingVertical:   spacing.xs,
    paddingHorizontal: spacing.xs,
    marginTop:         spacing.sm,
    marginBottom:      spacing.xs,
  },
  sectionTitle: {
    fontSize:   14,
    fontWeight: '600',
    color:      colors.textSecondary,
  },
  empty: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color:    colors.textMuted,
  },
  deleteButton: {
    marginTop:       spacing.xl,
    paddingVertical: spacing.md,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     colors.error,
    alignItems:      'center',
  },
  deleteButtonText: {
    fontSize:   15,
    fontWeight: '600',
    color:      colors.error,
  },
});
