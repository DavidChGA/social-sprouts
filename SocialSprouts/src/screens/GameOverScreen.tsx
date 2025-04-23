/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {globalStyles} from '../theme/theme';
import {
  type NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import {PrimaryButton} from '../components/PrimaryButton';
import type {RootStackParams} from '../routes/StackNavigator';

export const GameOverScreen = ({ route }) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { correctAnswers, wrongAnswers, roundsPlayed } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <View style={globalStyles.container}>

        <Text style={globalStyles.title}>¡Juego Terminado!</Text>
        <Text style={globalStyles.title}>Rondas Jugadas: {roundsPlayed}</Text>
        <Text style={globalStyles.title}>Respuestas correctas: {correctAnswers}</Text>
        <Text style={globalStyles.title}>Respuestas incorrectas: {wrongAnswers}</Text>

      <PrimaryButton
        onPress={() => navigation.dispatch(StackActions.popToTop())}
        label="Volver a intentar"
      />
    </View>
  );
};
