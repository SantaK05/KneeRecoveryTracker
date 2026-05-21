import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { HomeScreen }           from '../screens/HomeScreen';
import { ExerciseListScreen }   from '../screens/ExerciseListScreen';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';
import { FeedbackScreen }       from '../screens/FeedbackScreen';
import { colors } from '../constants';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:            { backgroundColor: colors.surface },
        headerTintColor:        colors.text,
        headerTitleStyle:       { fontWeight: '700', fontSize: 17 },
        headerShadowVisible:    false,
        contentStyle:           { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'KneeRecovery', headerShown: false }}
      />
      <Stack.Screen
        name="ExerciseList"
        component={ExerciseListScreen}
        options={{ title: 'Esercizi' }}
      />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{ title: 'Set Logging' }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{ title: 'Feedback Allenamento', headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
}
