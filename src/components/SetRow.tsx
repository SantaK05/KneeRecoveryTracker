import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants';
import { ExerciseVariant, SetRecord } from '../types';

interface Props {
  set: SetRecord;
  variant: ExerciseVariant;
}

function formatValue(set: SetRecord, variant: ExerciseVariant): string {
  if (variant === 'hold') {
    return set.holdSeconds != null ? `${set.holdSeconds}s` : '—';
  }
  const repStr = set.reps != null
    ? `${set.reps}${variant === 'reps_per_side' ? '/lato' : ''} reps`
    : '—';
  const kgStr  = set.weightKg != null ? `${set.weightKg} kg` : 'BW';
  return `${kgStr} · ${repStr}`;
}

export function SetRow({ set, variant }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{set.setNumber}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.value}>{formatValue(set, variant)}</Text>
        {set.note ? (
          <Text style={styles.note} numberOfLines={1}>{set.note}</Text>
        ) : null}
      </View>
      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceHighlight,
    borderRadius:   10,
    marginBottom:   spacing.xs,
    minHeight:      48,
  },
  badge: {
    width:           28,
    height:          28,
    borderRadius:    8,
    backgroundColor: colors.surface,
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     spacing.sm,
  },
  badgeText: {
    fontSize:   13,
    fontWeight: '600',
    color:      colors.textSecondary,
  },
  info: {
    flex: 1,
  },
  value: {
    fontSize:   15,
    fontWeight: '600',
    color:      colors.text,
  },
  note: {
    fontSize:   12,
    color:      colors.textMuted,
    marginTop:  2,
  },
  dot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: colors.success,
  },
});
