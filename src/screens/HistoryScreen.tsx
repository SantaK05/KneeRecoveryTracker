import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../navigation/types';
import { useWorkout } from '../context/WorkoutContext';
import { colors, spacing } from '../constants';
import { HistorySession } from '../types';

type Props = NativeStackScreenProps<HistoryStackParamList, 'History'>;

function formatDuration(startTs: string, endTs: string): string {
  const ms  = new Date(endTs).getTime() - new Date(startTs).getTime();
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('it-IT', {
    weekday: 'short',
    day:     'numeric',
    month:   'short',
    year:    'numeric',
  });
}

function avgKneePain(session: HistorySession): string {
  if (!session.feedback) return '—';
  const avg = (session.feedback.painLeft + session.feedback.painRight) / 2;
  return avg.toFixed(1);
}

function painColor(avgStr: string): string {
  const v = parseFloat(avgStr);
  if (isNaN(v)) return colors.textMuted;
  if (v <= 2)   return colors.success;
  if (v <= 5)   return colors.warning;
  return colors.error;
}

export function HistoryScreen({ navigation }: Props) {
  const { state, loadHistory } = useWorkout();

  useEffect(() => {
    if (!state.historyLoaded) loadHistory();
  }, []);

  const renderItem = ({ item }: { item: HistorySession }) => {
    const pain = avgKneePain(item);
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.schedaBadge}>
          <Text style={styles.schedaLetter}>{item.scheda}</Text>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.rowDate}>{formatDate(item.date)}</Text>
          <Text style={styles.rowMeta}>
            {item.sets.length} set · {formatDuration(item.startTs, item.endTs)}
          </Text>
        </View>
        <View style={styles.painContainer}>
          <Text style={styles.painLabel}>dolore</Text>
          <Text style={[styles.painValue, { color: painColor(pain) }]}>{pain}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {!state.historyLoaded ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={styles.loadingText}>Caricamento...</Text>
        </View>
      ) : state.sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Nessun allenamento</Text>
          <Text style={styles.emptySub}>Completa il tuo primo workout per vederlo qui.</Text>
        </View>
      ) : (
        <FlatList
          data={state.sessions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.surface,
    borderRadius:    14,
    padding:         spacing.md,
    marginBottom:    spacing.sm,
    minHeight:       72,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  schedaBadge: {
    width:           44,
    height:          44,
    borderRadius:    12,
    backgroundColor: colors.accent + '30',
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     spacing.md,
  },
  schedaLetter: {
    fontSize:   20,
    fontWeight: '700',
    color:      colors.accent,
  },
  rowInfo: {
    flex: 1,
  },
  rowDate: {
    fontSize:     15,
    fontWeight:   '600',
    color:        colors.text,
    marginBottom: 3,
    textTransform: 'capitalize',
  },
  rowMeta: {
    fontSize: 12,
    color:    colors.textMuted,
  },
  painContainer: {
    alignItems: 'center',
    minWidth:   48,
  },
  painLabel: {
    fontSize:   10,
    color:      colors.textMuted,
    marginBottom: 2,
  },
  painValue: {
    fontSize:   18,
    fontWeight: '700',
  },
  loading: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color:    colors.textMuted,
  },
  empty: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    padding:        spacing.xl,
  },
  emptyIcon: {
    fontSize:     52,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize:     20,
    fontWeight:   '700',
    color:        colors.text,
    marginBottom: spacing.sm,
  },
  emptySub: {
    fontSize:  14,
    color:     colors.textMuted,
    textAlign: 'center',
  },
});
