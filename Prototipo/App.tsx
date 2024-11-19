/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './src/routes/StackNavigator';

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <StackNavigator/>
    </NavigationContainer>
  );
}
