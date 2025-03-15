/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { RootStackParams } from '../routes/StackNavigator';
import { PrimaryButton } from '../components/PrimaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import { View, StyleSheet } from 'react-native';
import { globalStyles } from '../theme/theme';
import { SettingsButton } from '../components/SettingsButton';
import { Text } from 'react-native';

function GameModeSelectionScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { selectedVocabularyConfig, selectedSequenceConfig, defaultVocabularyConfig, defaultSequenceConfig } =
    useGlobalStoreSetup();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // Si no hay configuración seleccionada, usamos la por defecto
  const activeVocabularyConfig = selectedVocabularyConfig || defaultVocabularyConfig;
  const activeSequenceConfig = selectedSequenceConfig || defaultSequenceConfig;

  return (
    <View style={[globalStyles.container]}>
      <View style={styles.textContainer}>
        <Text style={globalStyles.title}>SELECCIONA UN MINIJUEGO</Text>
      </View>
      {/* VOCABULARIO */}

      <Text style={globalStyles.subtitle}>VOCABULARIO</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameVocabulary', {
              category: activeVocabularyConfig.category,
              imagesPerRound: 3,
              rounds: 3,
            })
          }
          label="Vocabulario I"
        />
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameVocabulary', {
              category: activeVocabularyConfig.category,
              imagesPerRound: 3,
              rounds: 5,
            })
          }
          label="Vocabulario II"
        />
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameVocabulary', {
              category: activeVocabularyConfig.category,
              imagesPerRound: 5,
              rounds: 4,
            })
          }
          label="Vocabulario III"
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameVocabulary', {
              category: activeVocabularyConfig.category,
              imagesPerRound: parseInt(activeVocabularyConfig.images, 10),
              rounds: parseInt(activeVocabularyConfig.rounds, 10),
            })
          }
          label="Vocabulario Extra"
        />
        <SettingsButton onPress={() => navigation.navigate('SetupVocabulary')} />
      </View>
      <Text style={{ textAlign: 'center', marginVertical: 10 }}>
        Configuración actual: {activeVocabularyConfig.alias}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* SECUENCIAS */}
        <View style={{ flexDirection: 'column', alignItems: 'center', flex: 0.4}}>
          <Text style={globalStyles.subtitle}>SECUENCIA</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PrimaryButton
              onPress={() =>
                navigation.navigate('GameSequencePreview', {
                  sequence: activeSequenceConfig.sequence,
                })
              }
              label="Secuencia"
            />
            <SettingsButton onPress={() => navigation.navigate('SetupSequence')} />
          </View>
          <Text style={{ textAlign: 'center', marginVertical: 10 }}>
            Configuración actual: {activeSequenceConfig.alias}
          </Text>
        </View>

        {/* EMOCIONES */}
        <View style={{ flexDirection: 'column', alignItems: 'center', flex: 0.4}}>
          <Text style={globalStyles.subtitle}>EMOCIONES</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PrimaryButton
              onPress={() =>
                console.log('Aquí va el juego de emociones')
              }
              label="Emociones"
            />
            <SettingsButton onPress={() => console.log('Aquí va la config Emociones')} />
          </View>
          <Text style={{ textAlign: 'center', marginVertical: 10 }}>
            Configuración actual: -
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  soundButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  soundButtonText: {
    color: 'white',
    fontSize: 16,
  },
  textContainer: {
    flex: 0.4,
  },
});

export default GameModeSelectionScreen;
