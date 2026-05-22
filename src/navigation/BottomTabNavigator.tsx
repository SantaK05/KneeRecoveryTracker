import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootTabParamList } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import { HistoryStackNavigator } from './HistoryStackNavigator';
import { colors } from '../constants';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom ?? 0;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:    false,
        tabBarStyle:    {
          backgroundColor:   colors.surface,
          borderTopColor:    colors.border,
          borderTopWidth:    1,
          paddingBottom:     bottomInset + 4,
          paddingTop:        4,
          height:            56 + bottomInset,
        },
        tabBarActiveTintColor:   colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackNavigator}
        options={{
          title: 'Storico',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
