import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { RootTabParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { MiniRestTimer } from '../components/MiniRestTimer';

export const navigationRef = createNavigationContainerRef<RootTabParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <View style={{ flex: 1 }}>
        <BottomTabNavigator />
        <MiniRestTimer />
      </View>
    </NavigationContainer>
  );
}
