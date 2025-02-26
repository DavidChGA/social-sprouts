/* eslint-disable prettier/prettier */
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import React from 'react';
import { GameScreenVocabulary } from '../screens/GameScreenVocabulary';
import { GameOverScreen } from '../screens/GameOverScreen';
import { SetupVocabularyScreen } from '../screens/SetupVocabularyScreen';
import { LogScreen } from '../screens/LogScreen';
import GameModeSelectionScreen from '../screens/GameModeSelectionScreen';

export type RootStackParams = {
  Home: undefined;
  Setup: undefined;
  GameVocabulary: {
    category: string;
    imagesPerRound: number;
    rounds: number;
  };
  GameOver: {
    attempts: number;
    roundsPlayed: number;
  };
  Settings: undefined;
  Logs: undefined;
  ModeSelection: undefined;
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
      <Stack.Screen name="Setup" component={SetupVocabularyScreen} />
      <Stack.Screen name="GameVocabulary" component={GameScreenVocabulary} />
      <Stack.Screen name="GameOver" component={GameOverScreen} />
      <Stack.Screen name="ModeSelection" component={GameModeSelectionScreen} />
      <Stack.Screen name="Logs" component={LogScreen} />
    </Stack.Navigator>
  );
};
