/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { globalStyles } from '../theme/theme';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../components/PrimaryButton';
import type { RootStackParams } from '../routes/StackNavigator';

const { height } = Dimensions.get('window');

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
        source={require('../assets/img/Logo_SP.png')}
        style={globalStyles.logo}
        resizeMode="contain"
      />
      <View style={homeStyles.buttonRow}>
        <View style={homeStyles.buttonColumn}>
          <PrimaryButton
            onPress={() => console.log('Aquí va la Partida')}
            label="Modo partida"
          />

          <Pressable
            onPress={() => navigation.navigate('UserConfig')}>
            <Image
              source={require('../assets/img/usuario.png')}
              style={homeStyles.icon}
            />
          </Pressable>
        </View>

        <View style={homeStyles.buttonColumn}>
          <PrimaryButton
            onPress={() => navigation.navigate('ModeSelection')}
            label="Modo minijuegos"
          />

          <Pressable
            onPress={() => navigation.navigate('Logs')}>
            <Image
              source={require('../assets/img/informacion.png')}
              style={homeStyles.icon}
            />
          </Pressable>

        </View>
      </View>
    </View>
  );
};

const homeStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: '1%',
  },

  buttonColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  icon: {
    marginTop: '15%',
    width: height * 0.06,
    height: height * 0.06,
  },
});
