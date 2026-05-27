import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useWorkout } from '../context/WorkoutContext';
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
  const clearCalledRef = useRef(false);

  // Walk nested navigation state to find the focused leaf route name
  const routeName = useNavigationState(navState => {
    if (!navState) return '';
    let s: typeof navState | undefined = navState;
    while (s?.routes?.[s.index ?? 0]?.state) {
      s = s.routes[s.index ?? 0].state as typeof navState;
    }
    return s?.routes?.[s?.index ?? 0]?.name ?? '';
  });

  // Sync remaining on every tick
  useEffect(() => {
    if (!activeRest) {
      setRemaining(0);
      clearCalledRef.current = false;
      return;
    }

    // Compute immediately so there's no initial 0 flash
    setRemaining(Math.max(0, Math.round((activeRest.endsAt - Date.now()) / 1000)));
    clearCalledRef.current = false;

    const interval = setInterval(() => {
      const r = Math.max(0, Math.round((activeRest.endsAt - Date.now()) / 1000));
      setRemaining(r);

      if (r === 0 && !clearCalledRef.current) {
        clearCalledRef.current = true;
        // Show "0:00" briefly, then clear
        setTimeout(() => {
          clearActiveRest();
        }, 200);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRest, clearActiveRest]);

  // Don't render if no active rest
  if (!activeRest) return null;

  // Don't render on ExerciseDetail screen (full timer already visible there)
  if (routeName === 'ExerciseDetail') return null;

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
    position:        'absolute',
    bottom:          90,
    right:           16,
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.surface,
    borderColor:     colors.border,
    borderWidth:     1,
    borderRadius:    22,
    paddingVertical:  8,
    paddingHorizontal: 12,
    height:          44,
    // Shadow (iOS)
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.5,
    shadowRadius:    4,
    // Elevation (Android)
    elevation:       6,
  },
  label: {
    color:      colors.accent,
    fontSize:   15,
    fontWeight: '700',
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
