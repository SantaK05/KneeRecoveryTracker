import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import { colors, spacing } from '../constants';
import { ExerciseVariant, SetRecord } from '../types';

export type SetSlotState = 'logged' | 'editing' | 'active' | 'locked' | 'future';

interface BaseProps {
  setNumber: number;
  variant: ExerciseVariant;
}

interface LoggedProps extends BaseProps {
  slotState: 'logged';
  set: SetRecord;
  onTap: () => void;
}

interface EditingProps extends BaseProps {
  slotState: 'editing';
  set: SetRecord;
  onSave: (updates: { weightKg: number | null; reps: number | null; holdSeconds: number | null; note: string }) => void;
  onCancel: () => void;
}

interface ActiveProps extends BaseProps {
  slotState: 'active';
  weightInput: string;
  repsInput: string;
  noteInput: string;
  onChangeWeight: (v: string) => void;
  onChangeReps: (v: string) => void;
  onChangeNote: (v: string) => void;
  onLog: () => void;
}

interface LockedProps extends BaseProps {
  slotState: 'locked';
}

interface FutureProps extends BaseProps {
  slotState: 'future';
}

type Props = LoggedProps | EditingProps | ActiveProps | LockedProps | FutureProps;

function formatValue(set: SetRecord, variant: ExerciseVariant): string {
  if (variant === 'hold') {
    return set.holdSeconds != null ? `${set.holdSeconds}s` : '—';
  }
  const repStr = set.reps != null
    ? `${set.reps}${variant === 'reps_per_side' ? '/lato' : ''} reps`
    : '—';
  const kgStr = set.weightKg != null ? `${set.weightKg} kg` : 'BW';
  return `${kgStr} · ${repStr}`;
}

export function SetSlot(props: Props) {
  const { setNumber, variant, slotState } = props;
  const isHold = variant === 'hold';
  const repLabel = isHold ? 'Secondi' : variant === 'reps_per_side' ? 'Reps/lato' : 'Reps';

  // Edit-form local state (only used when slotState === 'editing')
  const [editWeight, setEditWeight] = useState(
    slotState === 'editing' && props.set.weightKg != null ? String(props.set.weightKg) : ''
  );
  const [editReps, setEditReps] = useState(
    slotState === 'editing'
      ? (isHold
          ? (props.set.holdSeconds != null ? String(props.set.holdSeconds) : '')
          : (props.set.reps != null ? String(props.set.reps) : ''))
      : ''
  );
  const [editNote, setEditNote] = useState(
    slotState === 'editing' ? props.set.note : ''
  );

  // ── Logged (read-only, tappable) ────────────────────────────────────────────
  if (slotState === 'logged') {
    const { set, onTap } = props as LoggedProps;
    return (
      <TouchableOpacity style={styles.row} onPress={onTap} activeOpacity={0.7}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{setNumber}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.value}>{formatValue(set, variant)}</Text>
          {set.note ? <Text style={styles.note} numberOfLines={1}>{set.note}</Text> : null}
        </View>
        <View style={styles.dot} />
      </TouchableOpacity>
    );
  }

  // ── Editing (inline edit form) ──────────────────────────────────────────────
  if (slotState === 'editing') {
    const { onSave, onCancel } = props as EditingProps;

    const handleSave = () => {
      const weight = editWeight.trim() ? parseFloat(editWeight) : null;
      const repsOrHold = editReps.trim() ? parseInt(editReps, 10) : null;
      onSave({
        weightKg:    isHold ? null : weight,
        reps:        isHold ? null : repsOrHold,
        holdSeconds: isHold ? repsOrHold : null,
        note:        editNote.trim(),
      });
    };

    return (
      <View style={[styles.row, styles.rowEditing]}>
        <View style={[styles.badge, styles.badgeEditing]}>
          <Text style={[styles.badgeText, styles.badgeTextEditing]}>{setNumber}</Text>
        </View>
        <View style={styles.editForm}>
          <View style={styles.inputRow}>
            {!isHold && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={editWeight}
                  onChangeText={setEditWeight}
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
                value={editReps}
                onChangeText={setEditReps}
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
              value={editNote}
              onChangeText={setEditNote}
              placeholder="es. 40 kg, buona forma..."
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
            />
          </View>
          <View style={styles.editButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Annulla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>Salva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ── Active (next-set input form) ─────────────────────────────────────────────
  if (slotState === 'active') {
    const { weightInput, repsInput, noteInput, onChangeWeight, onChangeReps, onChangeNote, onLog } = props as ActiveProps;
    return (
      <View style={[styles.row, styles.rowActive]}>
        <View style={[styles.badge, styles.badgeActive]}>
          <Text style={[styles.badgeText, styles.badgeTextActive]}>{setNumber}</Text>
        </View>
        <View style={styles.editForm}>
          <View style={styles.inputRow}>
            {!isHold && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={weightInput}
                  onChangeText={onChangeWeight}
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
                onChangeText={onChangeReps}
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
              onChangeText={onChangeNote}
              placeholder="es. 40 kg, buona forma..."
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
            />
          </View>
          <TouchableOpacity style={styles.logBtn} onPress={onLog} activeOpacity={0.8}>
            <Text style={styles.logBtnText}>✓  Set Completato</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Locked (rest timer running, slot for next set) ───────────────────────────
  if (slotState === 'locked') {
    return (
      <View style={[styles.row, styles.rowLocked]}>
        <View style={[styles.badge, styles.badgeLocked]}>
          <Text style={[styles.badgeText, styles.badgeTextLocked]}>{setNumber}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.value, styles.valueLocked]}>In attesa...</Text>
        </View>
      </View>
    );
  }

  // ── Future (placeholder) ─────────────────────────────────────────────────────
  return (
    <View style={[styles.row, styles.rowFuture]}>
      <View style={[styles.badge, styles.badgeLocked]}>
        <Text style={[styles.badgeText, styles.badgeTextLocked]}>{setNumber}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.value, styles.valueLocked]}>
          {isHold ? '— s' : '— reps  BW'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    paddingVertical:   spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor:   colors.surfaceHighlight,
    borderRadius:      10,
    marginBottom:      spacing.xs,
    minHeight:         48,
  },
  rowActive: {
    borderWidth:  1,
    borderColor:  colors.accent + '60',
    backgroundColor: colors.surface,
  },
  rowEditing: {
    borderWidth:  1,
    borderColor:  colors.warning + '60',
    backgroundColor: colors.surface,
  },
  rowLocked: {
    opacity: 0.45,
  },
  rowFuture: {
    opacity: 0.3,
  },
  badge: {
    width:           28,
    height:          28,
    borderRadius:    8,
    backgroundColor: colors.surface,
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     spacing.sm,
    marginTop:       2,
  },
  badgeActive: {
    backgroundColor: colors.accent,
  },
  badgeEditing: {
    backgroundColor: colors.warning,
  },
  badgeLocked: {
    backgroundColor: colors.surface,
  },
  badgeText: {
    fontSize:   13,
    fontWeight: '600',
    color:      colors.textSecondary,
  },
  badgeTextActive: {
    color: '#FFFFFF',
  },
  badgeTextEditing: {
    color: '#FFFFFF',
  },
  badgeTextLocked: {
    color: colors.textMuted,
  },
  info: {
    flex:           1,
    justifyContent: 'center',
    minHeight:      28,
  },
  value: {
    fontSize:   15,
    fontWeight: '600',
    color:      colors.text,
  },
  valueLocked: {
    color: colors.textMuted,
  },
  note: {
    fontSize:  12,
    color:     colors.textMuted,
    marginTop: 2,
  },
  dot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: colors.success,
    marginTop:       10,
  },
  editForm: {
    flex: 1,
    paddingBottom: spacing.xs,
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
    backgroundColor:   colors.surfaceHighlight,
    borderRadius:      12,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm + 2,
    fontSize:          17,
    color:             colors.text,
    borderWidth:       1,
    borderColor:       colors.border,
    minHeight:         48,
  },
  inputNote: {
    width:        '100%',
    marginBottom: spacing.sm,
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
  editButtons: {
    flexDirection: 'row',
    gap:           spacing.sm,
  },
  cancelBtn: {
    flex:            1,
    backgroundColor: colors.surface,
    borderRadius:    12,
    paddingVertical: spacing.sm,
    alignItems:      'center',
    justifyContent:  'center',
    minHeight:       44,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  cancelBtnText: {
    fontSize:   15,
    fontWeight: '600',
    color:      colors.textSecondary,
  },
  saveBtn: {
    flex:            2,
    backgroundColor: colors.warning,
    borderRadius:    12,
    paddingVertical: spacing.sm,
    alignItems:      'center',
    justifyContent:  'center',
    minHeight:       44,
  },
  saveBtnText: {
    fontSize:   15,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
});
