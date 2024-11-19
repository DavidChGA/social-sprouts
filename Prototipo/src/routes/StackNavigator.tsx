/* eslint-disable prettier/prettier */
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import React from 'react';
import { GameScreen } from '../screens/GameScreen';
import { GameOverScreen } from '../screens/GameOverScreen';

export type RootStackParams = {
  Home: undefined,
  Game: undefined,
  GameOver: undefined,
}

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,
      headerStyle: {
        elevation: 0,
        shadowColor: 'transparent',
      },
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="GameOver" component={GameOverScreen} />
    </Stack.Navigator>
  );
};
