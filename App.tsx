import 'react-native-url-polyfill/auto';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WorkoutProvider } from './src/context/WorkoutContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAppUpdate } from './src/hooks/useAppUpdate';

function AppContent() {
  useAppUpdate();
  return (
    <SafeAreaProvider>
      <WorkoutProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </WorkoutProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  return <AppContent />;
}
