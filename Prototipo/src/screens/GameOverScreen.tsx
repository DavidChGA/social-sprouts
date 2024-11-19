/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../theme/theme';
import { type NavigationProp, StackActions, useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../components/PrimaryButton';
import type{ RootStackParams } from '../routes/StackNavigator';

export const  GameOverScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <View style={globalStyles.container}>
      <Text>Hola mundo</Text>
      <PrimaryButton
        onPress={() => navigation.dispatch(StackActions.popToTop())}
        label="Volver a intentar"
      />
    </View>
  );
};
