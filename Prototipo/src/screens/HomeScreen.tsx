/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Pressable} from 'react-native';
import { globalStyles } from '../theme/theme';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../components/PrimaryButton';
import type { RootStackParams } from '../routes/StackNavigator';
import { SettingsButton } from '../components/SettingsButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import logger from '../logger/Logger';
import useGlobalStoreUser from '../globalState/useGlobalStoreUser';

export const HomeScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {selectedCategory, selectedImages, selectedRounds} = useGlobalStoreSetup();
  const {userName} = useGlobalStoreUser();

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

      <PrimaryButton
        onPress={() => navigation.navigate('Game', {
            category: selectedCategory,
            imagesPerRound: parseInt(selectedImages, 10),
            rounds: parseInt(selectedRounds, 10),
          })
        }
        label="Jugar"
      />

      <View style={homeStyles.buttonContainer}>
      <Pressable
        onPress={() => navigation.navigate('Logs')}>
      <Image
                      source={require('../assets/img/informacion.png')}
                      style={{
                          width: 50,
                          height: 50,
                      }}
                  />
      </Pressable>

        <SettingsButton
          onPress={() => navigation.navigate('Setup')}
        />
      </View>
    </View>
  );
};

const homeStyles = StyleSheet.create({
  container: {
      flexDirection: 'column',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espaciado entre los botones
    alignItems: 'center',  // Alineación vertical en el centro
    padding: 10,
  },
});
