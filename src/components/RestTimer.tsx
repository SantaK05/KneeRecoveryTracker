import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants';

interface Props {
  formattedTime: string;
  isRunning:     boolean;
  isPaused:      boolean;
  durationSec:   number;
  onPause:       () => void;
  onResume:      () => void;
  onRestart:     () => void;
  onSkip:        () => void;
  onAdjust:      (delta: number) => void;
}

export function RestTimer({
  formattedTime,
  isRunning,
  isPaused,
  durationSec,
  onPause,
  onResume,
  onRestart,
  onSkip,
  onAdjust,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Recupero</Text>

      <View style={styles.adjustRow}>
        <TouchableOpacity style={styles.adjustBtn} onPress={() => onAdjust(-15)}>
          <Text style={styles.adjustBtnText}>−15s</Text>
        </TouchableOpacity>
        <Text style={styles.durationLabel}>{durationSec}s</Text>
        <TouchableOpacity style={styles.adjustBtn} onPress={() => onAdjust(+15)}>
          <Text style={styles.adjustBtnText}>+15s</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.countdown}>{formattedTime}</Text>

      <View style={styles.controls}>
        {isRunning && !isPaused ? (
          <TouchableOpacity style={styles.controlBtn} onPress={onPause}>
            <Text style={styles.controlBtnText}>Pausa</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.controlBtn} onPress={onResume}>
            <Text style={styles.controlBtnText}>Riprendi</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.controlBtn} onPress={onRestart}>
          <Text style={styles.controlBtnText}>Riavvia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, styles.skipBtn]} onPress={onSkip}>
          <Text style={[styles.controlBtnText, styles.skipBtnText]}>Salta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    borderRadius:    20,
    padding:         spacing.xl,
    alignItems:      'center',
    marginTop:       spacing.lg,
  },
  label: {
    fontSize:      14,
    color:         colors.textMuted,
    marginBottom:  spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  spacing.md,
    gap:           spacing.md,
  },
  adjustBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.xs,
    backgroundColor:   colors.surfaceHighlight,
    borderRadius:      8,
    minWidth:          52,
    alignItems:        'center',
    minHeight:         36,
    justifyContent:    'center',
  },
  adjustBtnText: {
    fontSize:   13,
    color:      colors.textSecondary,
    fontWeight: '600',
  },
  durationLabel: {
    fontSize:  14,
    color:     colors.textMuted,
    minWidth:  40,
    textAlign: 'center',
  },
  countdown: {
    fontSize:      64,
    fontWeight:    '700',
    color:         colors.accent,
    letterSpacing: -2,
    marginBottom:  spacing.xl,
  },
  controls: {
    flexDirection: 'row',
    gap:           spacing.sm,
  },
  controlBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    backgroundColor:   colors.surfaceHighlight,
    borderRadius:      10,
    minHeight:         44,
    justifyContent:    'center',
    alignItems:        'center',
    minWidth:          80,
  },
  controlBtnText: {
    fontSize:   14,
    color:      colors.textSecondary,
    fontWeight: '600',
  },
  skipBtn: {
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  skipBtnText: {
    color: colors.textMuted,
  },
});
