import 'react-native-url-polyfill/auto';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { WorkoutProvider } from './src/context/WorkoutContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <WorkoutProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </WorkoutProvider>
  );
}
