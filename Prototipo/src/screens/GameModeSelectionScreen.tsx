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
  const { selectedVocabularyConfig, selectedSequenceConfig, selectedEmotionsConfig, defaultVocabularyConfig, defaultSequenceConfig, defaultEmotionsConfig } =
    useGlobalStoreSetup();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // Si no hay configuración seleccionada, usamos la por defecto
  const activeVocabularyConfig = selectedVocabularyConfig || defaultVocabularyConfig;
  const activeSequenceConfig = selectedSequenceConfig || defaultSequenceConfig;
  const activeEmotionsConfig = selectedEmotionsConfig || defaultEmotionsConfig;

  return (
    <View style={[globalStyles.container]}>
      <Text style={globalStyles.title}>SELECCIONA UN MINIJUEGO</Text>
      {/* VOCABULARIO */}

      <Text style={globalStyles.subtitle}>VOCABULARIO</Text>

      <View style={styles.fila}>
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
      <View style={styles.fila}>
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameVocabulary', {
              category: activeVocabularyConfig.category,
              imagesPerRound: parseInt(activeVocabularyConfig.imagesPerRound, 10),
              rounds: parseInt(activeVocabularyConfig.rounds, 10),
            })
          }
          label="Vocabulario Extra"
        />
        <SettingsButton onPress={() => navigation.navigate('SetupVocabulary')} />
      </View>
      <Text style={styles.configText}>
        Configuración actual: {activeVocabularyConfig.alias}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* SECUENCIAS */}
        <View style={styles.section}>
          <Text style={globalStyles.subtitle}>SECUENCIA</Text>
          <View style={styles.fila}>
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
          <Text style={styles.configText}>
            Configuración actual: {activeSequenceConfig.alias}
          </Text>
        </View>

        {/* EMOCIONES */}
        <View style={styles.section}>
          <Text style={globalStyles.subtitle}>EMOCIONES</Text>
          <View style={styles.fila}>
            <PrimaryButton
              onPress={() =>
                navigation.navigate('GameEmotions', {
                  emotion: activeEmotionsConfig.emotion,
                  imagesPerRound: parseInt(activeEmotionsConfig.images, 10),
                  correctsPerRound: parseInt(activeEmotionsConfig.correctsPerRound, 10),
                  rounds: parseInt(activeEmotionsConfig.rounds, 10),
                })
              }
              label="Emociones"
            />
            <SettingsButton onPress={() => navigation.navigate('SetupEmotions')} />
          </View>
          <Text style={styles.configText}>
            Configuración actual: {activeEmotionsConfig.alias}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  configText: {
    textAlign: 'center',
    marginVertical: '1%',
  },
  section: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 0.4,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
  },

});

export default GameModeSelectionScreen;
