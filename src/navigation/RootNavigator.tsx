import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { RootTabParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { MiniRestTimer } from '../components/MiniRestTimer';

export const navigationRef = createNavigationContainerRef<RootTabParamList>();

export function RootNavigator() {
  const [currentRoute, setCurrentRoute] = useState<string>('');

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setCurrentRoute(navigationRef.getCurrentRoute()?.name ?? '')}
      onStateChange={() => setCurrentRoute(navigationRef.getCurrentRoute()?.name ?? '')}
    >
      <View style={{ flex: 1 }}>
        <BottomTabNavigator />
        <MiniRestTimer currentRoute={currentRoute} />
      </View>
    </NavigationContainer>
  );
}
