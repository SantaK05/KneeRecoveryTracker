import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWorkout } from '../context/WorkoutContext';
import { navigationRef } from '../navigation/RootNavigator';
import { colors } from '../constants';

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MiniRestTimer() {
  const { state, clearActiveRest } = useWorkout();
  const { activeRest } = state;

  const [remaining, setRemaining] = useState<number>(0);
  const [isOnDetail, setIsOnDetail] = useState(false);
  const clearCalledRef = useRef(false);

  useEffect(() => {
    if (!activeRest) {
      setRemaining(0);
      clearCalledRef.current = false;
      return;
    }

    setRemaining(Math.max(0, Math.round((activeRest.endsAt - Date.now()) / 1000)));
    clearCalledRef.current = false;

    const interval = setInterval(() => {
      // Check current route via ref — safe to call outside navigator tree
      if (navigationRef.isReady()) {
        setIsOnDetail(navigationRef.getCurrentRoute()?.name === 'ExerciseDetail');
      }

      const r = Math.max(0, Math.round((activeRest.endsAt - Date.now()) / 1000));
      setRemaining(r);

      if (r === 0 && !clearCalledRef.current) {
        clearCalledRef.current = true;
        setTimeout(() => clearActiveRest(), 200);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRest, clearActiveRest]);

  if (!activeRest || isOnDetail) return null;

  return (
    <View style={styles.chip} pointerEvents="box-none">
      <Text style={styles.label}>⏱ {formatTime(remaining)}</Text>
      <TouchableOpacity onPress={clearActiveRest} style={styles.skipBtn} hitSlop={8}>
        <Text style={styles.skipLabel}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    position:          'absolute',
    bottom:            90,
    right:             16,
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   colors.surface,
    borderColor:       colors.border,
    borderWidth:       1,
    borderRadius:      22,
    paddingVertical:   8,
    paddingHorizontal: 12,
    height:            44,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.5,
    shadowRadius:      4,
    elevation:         6,
  },
  label: {
    color:       colors.accent,
    fontSize:    15,
    fontWeight:  '700',
    marginRight: 8,
  },
  skipBtn: {
    justifyContent: 'center',
    alignItems:     'center',
  },
  skipLabel: {
    color:      colors.textMuted,
    fontSize:   13,
    fontWeight: '600',
  },
});
