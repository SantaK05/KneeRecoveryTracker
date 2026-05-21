import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, spacing } from '../constants';

interface Props {
  label:    string;
  value:    number;
  min:      number;
  max:      number;
  step?:    number;
  onChange: (value: number) => void;
}

export function SliderInput({ label, value, min, max, step = 1, onChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.accent}
      />
      <View style={styles.range}>
        <Text style={styles.rangeText}>{min}</Text>
        <Text style={styles.rangeText}>{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   spacing.xs,
  },
  label: {
    fontSize:   15,
    color:      colors.text,
    fontWeight: '500',
    flex:       1,
  },
  value: {
    fontSize:   22,
    fontWeight: '700',
    color:      colors.accent,
    minWidth:   32,
    textAlign:  'right',
  },
  slider: {
    width:  '100%',
    height: 40,
  },
  range: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginTop:      -4,
  },
  rangeText: {
    fontSize: 11,
    color:    colors.textMuted,
  },
});
