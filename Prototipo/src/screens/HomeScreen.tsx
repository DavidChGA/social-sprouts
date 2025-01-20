/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, Image, StyleSheet} from 'react-native';
import { globalStyles } from '../theme/theme';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../components/PrimaryButton';
import type { RootStackParams } from '../routes/StackNavigator';
import { SettingsButton } from '../components/SettingsButton';

export const HomeScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <View style={[globalStyles.container, homeStyles.container]}>
      <Image
        source={require('../img/Logo_SP.png')}
        style={globalStyles.logo}
        resizeMode="contain"
      />

      <PrimaryButton
        onPress={() => navigation.navigate('Setup')}
        label="Jugar"
      />

      <SettingsButton
        onPress={() => navigation.navigate('Setup')}
      />
    </View>
  );
};

const homeStyles = StyleSheet.create({
  container: {
      flexDirection: 'column',
  },
});
