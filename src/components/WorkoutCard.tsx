import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, schedaDescriptions } from '../constants';
import { Scheda } from '../types';

interface Props {
  scheda: Scheda;
  isSelected: boolean;
  onPress: () => void;
  onInfoPress: () => void;
}

export function WorkoutCard({ scheda, isSelected, onPress, onInfoPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.topRow}>
        <View style={[styles.badge, isSelected && styles.badgeSelected]}>
          <Text style={[styles.letter, isSelected && styles.letterSelected]}>
            {scheda}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onInfoPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.infoBtn}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={isSelected ? colors.accent : colors.textMuted}
          />
        </TouchableOpacity>
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
  topRow: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
    width:          '100%',
    marginBottom:   spacing.sm,
  },
  badge: {
    width:           40,
    height:          40,
    borderRadius:    12,
    backgroundColor: colors.surfaceHighlight,
    alignItems:      'center',
    justifyContent:  'center',
  },
  badgeSelected: {
    backgroundColor: colors.accent,
  },
  infoBtn: {
    padding: 2,
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
