import React from 'react';
import {
  Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, schedaDescriptions } from '../constants';
import { Scheda } from '../types';
import {
  getExercisesForScheda, kneeRoutine, formatSetTarget, formatRestRange,
} from '../data/workoutData';

interface Props {
  scheda: Scheda | null;
  onClose: () => void;
}

export function WorkoutPreviewModal({ scheda, onClose }: Props) {
  if (!scheda) return null;

  const exercises = getExercisesForScheda(scheda);
  const isLowerBody = scheda === 'B' || scheda === 'D';

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Scheda {scheda}</Text>
              <Text style={styles.subtitle}>{schedaDescriptions[scheda]}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {exercises.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  La scheda {scheda} è un allenamento Upper Body.{'\n'}
                  Gli esercizi specifici vengono concordati con il trainer.
                </Text>
              </View>
            ) : (
              exercises.map((ex, i) => (
                <View key={ex.name} style={styles.exerciseRow}>
                  <View style={styles.indexBadge}>
                    <Text style={styles.indexText}>{i + 1}</Text>
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.metaChip}>
                        <Text style={styles.metaLabel}>{formatSetTarget(ex)}</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <Ionicons name="timer-outline" size={12} color={colors.textMuted} style={styles.metaIcon} />
                        <Text style={styles.metaLabel}>{formatRestRange(ex)}</Text>
                      </View>
                    </View>
                    {ex.notes ? (
                      <Text style={styles.notes}>{ex.notes}</Text>
                    ) : null}
                  </View>
                </View>
              ))
            )}

            {isLowerBody && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerLabel}>+ Routine Ginocchio</Text>
                  <View style={styles.dividerLine} />
                </View>
                {kneeRoutine.map((ex, i) => (
                  <View key={ex.name} style={[styles.exerciseRow, styles.kneeRow]}>
                    <View style={[styles.indexBadge, styles.kneeBadge]}>
                      <Text style={styles.indexText}>{i + 1}</Text>
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>{ex.name}</Text>
                      <View style={styles.metaRow}>
                        <View style={styles.metaChip}>
                          <Text style={styles.metaLabel}>{formatSetTarget(ex)}</Text>
                        </View>
                        <View style={styles.metaChip}>
                          <Ionicons name="timer-outline" size={12} color={colors.textMuted} style={styles.metaIcon} />
                          <Text style={styles.metaLabel}>{formatRestRange(ex)}</Text>
                        </View>
                      </View>
                      {ex.notes ? (
                        <Text style={styles.notes}>{ex.notes}</Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent:  'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    maxHeight:       '85%',
    paddingBottom:   32,
  },
  handle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: colors.border,
    alignSelf:       'center',
    marginTop:       spacing.sm,
    marginBottom:    spacing.md,
  },
  header: {
    flexDirection:   'row',
    alignItems:      'flex-start',
    justifyContent:  'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom:    spacing.lg,
  },
  title: {
    fontSize:   22,
    fontWeight: '700',
    color:      colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color:    colors.textSecondary,
  },
  closeBtn: {
    padding:         6,
    backgroundColor: colors.surfaceHighlight,
    borderRadius:    10,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom:     spacing.md,
  },
  exerciseRow: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    marginBottom:   spacing.md,
    gap:            spacing.sm,
  },
  kneeRow: {
    opacity: 0.9,
  },
  indexBadge: {
    width:           28,
    height:          28,
    borderRadius:    8,
    backgroundColor: colors.accent + '33',
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
    marginTop:       2,
  },
  kneeBadge: {
    backgroundColor: colors.success + '22',
  },
  indexText: {
    fontSize:   12,
    fontWeight: '700',
    color:      colors.accent,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize:     14,
    fontWeight:   '600',
    color:        colors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap:           spacing.xs,
    marginBottom:  4,
    flexWrap:      'wrap',
  },
  metaChip: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.surfaceHighlight,
    borderRadius:    6,
    paddingHorizontal: 8,
    paddingVertical:   3,
  },
  metaIcon: {
    marginRight: 3,
  },
  metaLabel: {
    fontSize: 12,
    color:    colors.textSecondary,
  },
  notes: {
    fontSize:  12,
    color:     colors.textMuted,
    lineHeight: 17,
  },
  divider: {
    flexDirection:  'row',
    alignItems:     'center',
    marginVertical: spacing.md,
    gap:            spacing.sm,
  },
  dividerLine: {
    flex:            1,
    height:          1,
    backgroundColor: colors.border,
  },
  dividerLabel: {
    fontSize:   11,
    color:      colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing:  0.5,
  },
  emptyBox: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius:    12,
    padding:         spacing.md,
  },
  emptyText: {
    fontSize:   14,
    color:      colors.textSecondary,
    lineHeight: 20,
    textAlign:  'center',
  },
});
