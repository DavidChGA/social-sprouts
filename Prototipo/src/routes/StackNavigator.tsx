/* eslint-disable prettier/prettier */
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import React from 'react';
import { GameScreenVocabulary } from '../screens/GameScreenVocabulary';
import { GameOverScreen } from '../screens/GameOverScreen';
import { SetupVocabularyScreen } from '../screens/SetupVocabularyScreen';
import { SetupSequenceScreen } from '../screens/SetupSequenceScreen';
import { LogScreen } from '../screens/LogScreen';
import GameModeSelectionScreen from '../screens/GameModeSelectionScreen';
import { UserConfigScreen } from '../screens/UserConfigScreen';
import GameScreenSequencePreview from '../screens/GameScreenSequencePreview';
import { GameScreenSequence } from '../screens/GameScreenSequence';
import { SetupEmotionsScreen } from '../screens/SetupEmotionsScreen';
import { GameScreenEmotions } from '../screens/GameScreenEmotions';
import { SetupSessionScreen } from '../screens/SetupSessionScreen';

export type RootStackParams = {
  Home: undefined;
  SetupSession: undefined;
  SetupVocabulary?: {
    addInSession: boolean;
  };
  GameVocabulary: {
    category: string;
    imagesPerRound: number;
    rounds: number;
  };
  SetupSequence?: {
    addInSession: boolean;
  };
  GameSequence: {
    sequence: string;
  };
  GameSequencePreview: {
    sequence: string;
  };
  SetupEmotions?: {
    addInSession: boolean;
  };
  GameEmotions: {
    emotion: string;
    imagesPerRound: number;
    correctsPerRound: number;
    rounds: number;
  };
  GameOver: {
    correctAnswers: number;
    wrongAnswers: number;
    roundsPlayed: number;
  };
  Settings: undefined;
  Logs: undefined;
  ModeSelection: undefined;
  UserConfig: undefined;
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
      <Stack.Screen name="SetupSession" component={SetupSessionScreen} />
      <Stack.Screen name="SetupVocabulary" component={SetupVocabularyScreen} />
      <Stack.Screen name="GameVocabulary" component={GameScreenVocabulary} />
      <Stack.Screen name="SetupSequence" component={SetupSequenceScreen} />
      <Stack.Screen name="GameSequence" component={GameScreenSequence} />
      <Stack.Screen name="GameSequencePreview" component={GameScreenSequencePreview} />
      <Stack.Screen name="SetupEmotions" component={SetupEmotionsScreen} />
      <Stack.Screen name="GameEmotions" component={GameScreenEmotions} />
      <Stack.Screen name="GameOver" component={GameOverScreen} />
      <Stack.Screen name="ModeSelection" component={GameModeSelectionScreen} />
      <Stack.Screen name="UserConfig" component={UserConfigScreen} />
      <Stack.Screen name="Logs" component={LogScreen} />
    </Stack.Navigator>
  );
};
