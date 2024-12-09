/* eslint-disable prettier/prettier */
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import React from 'react';
import { GameScreen } from '../screens/GameScreen';
import { GameOverScreen } from '../screens/GameOverScreen';
import { SetupScreen } from '../screens/SetupScreen';

export type RootStackParams = {
  Home: undefined;
  Setup: undefined;
  Game: {
    category: string;
    imagesPerRound: number;
    rounds: number;
  };
  GameOver: {
    attempts: number;
    roundsPlayed: number;
  };
};

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
      <Stack.Screen name="Setup" component={SetupScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="GameOver" component={GameOverScreen} />
    </Stack.Navigator>
  );
};
