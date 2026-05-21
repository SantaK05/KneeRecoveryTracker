import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HistoryStackParamList } from './types';
import { HistoryScreen }       from '../screens/HistoryScreen';
import { SessionDetailScreen } from '../screens/SessionDetailScreen';
import { colors } from '../constants';

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export function HistoryStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:         { backgroundColor: colors.surface },
        headerTintColor:     colors.text,
        headerTitleStyle:    { fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        contentStyle:        { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Storico Allenamenti' }}
      />
      <Stack.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{ title: 'Dettaglio Sessione' }}
      />
    </Stack.Navigator>
  );
}
