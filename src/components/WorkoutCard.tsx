import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, spacing, schedaDescriptions } from '../constants';
import { Scheda } from '../types';

interface Props {
  scheda: Scheda;
  isSelected: boolean;
  onPress: () => void;
}

export function WorkoutCard({ scheda, isSelected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.badge, isSelected && styles.badgeSelected]}>
        <Text style={[styles.letter, isSelected && styles.letterSelected]}>
          {scheda}
        </Text>
      </View>
      <Text
        style={[styles.description, isSelected && styles.descriptionSelected]}
        numberOfLines={2}
      >
        {schedaDescriptions[scheda]}
      </Text>
    </TouchableOpacity>
  );
}

const CARD_WIDTH = 140;

const styles = StyleSheet.create({
  card: {
    width:           CARD_WIDTH,
    minHeight:       120,
    backgroundColor: colors.surface,
    borderRadius:    16,
    padding:         spacing.md,
    marginRight:     spacing.sm,
    borderWidth:     2,
    borderColor:     colors.border,
    alignItems:      'flex-start',
    justifyContent:  'space-between',
  },
  cardSelected: {
    borderColor:     colors.accent,
    backgroundColor: '#1A2B4A',
  },
  badge: {
    width:           40,
    height:          40,
    borderRadius:    12,
    backgroundColor: colors.surfaceHighlight,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    spacing.sm,
  },
  badgeSelected: {
    backgroundColor: colors.accent,
  },
  letter: {
    fontSize:   22,
    fontWeight: '700',
    color:      colors.textSecondary,
  },
  letterSelected: {
    color: '#FFFFFF',
  },
  description: {
    fontSize:   12,
    color:      colors.textMuted,
    lineHeight: 16,
  },
  descriptionSelected: {
    color: colors.textSecondary,
  },
});
