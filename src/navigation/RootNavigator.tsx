import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from './BottomTabNavigator';
import { MiniRestTimer } from '../components/MiniRestTimer';

export function RootNavigator() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <BottomTabNavigator />
        <MiniRestTimer />
      </View>
    </NavigationContainer>
  );
}
