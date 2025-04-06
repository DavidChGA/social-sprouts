/* eslint-disable prettier/prettier */
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { RootStackParams } from '../routes/StackNavigator';
import { PrimaryButton } from '../components/PrimaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import { View, StyleSheet, Dimensions } from 'react-native';
import { globalStyles } from '../theme/theme';
import { SettingsButton } from '../components/SettingsButton';
import { Text } from 'react-native';
import { useGlobalStoreUser } from '../globalState/useGlobalStoreUser';

const { height } = Dimensions.get('window');

function GameModeSelectionScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {userName} = useGlobalStoreUser();
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
      <Text style={styles.configTextUserName}>Estás jugando como: {userName}</Text>
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
          label="Fácil"
        />
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameVocabulary', {
              category: activeVocabularyConfig.category,
              imagesPerRound: 3,
              rounds: 5,
            })
          }
          label="Medio"
        />
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameVocabulary', {
              category: activeVocabularyConfig.category,
              imagesPerRound: 5,
              rounds: 4,
            })
          }
          label="Difícil"
        />
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
        Configuración actual - {activeVocabularyConfig.alias}: {activeVocabularyConfig.category} + {activeVocabularyConfig.rounds} rondas + {activeVocabularyConfig.imagesPerRound} imágenes
      </Text>

      {/* EMOCIONES */}
      <Text style={globalStyles.subtitle}>EMOCIONES</Text>
      <View style={styles.fila}>
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameEmotions', {
              emotion: activeEmotionsConfig.emotion,
              imagesPerRound: 3,
              correctsPerRound: 1,
              rounds: 3,
            })
          }
          label="Fácil"
        />
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameEmotions', {
              emotion: activeEmotionsConfig.emotion,
              imagesPerRound: 5,
              correctsPerRound: 2,
              rounds: 3,
            })
          }
          label="Difícil"
        />
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameEmotions', {
              emotion: activeEmotionsConfig.emotion,
              imagesPerRound: parseInt(activeEmotionsConfig.imagesPerRound, 10),
              correctsPerRound: parseInt(activeEmotionsConfig.correctsPerRound, 10),
              rounds: parseInt(activeEmotionsConfig.rounds, 10),
            })
          }
          label="Emociones Extra"
        />
        <SettingsButton onPress={() => navigation.navigate('SetupEmotions')} />
      </View>
      <Text style={styles.configText}>
        Configuración actual - {activeEmotionsConfig.alias}: {activeEmotionsConfig.emotion} + {activeEmotionsConfig.rounds} rondas + {activeEmotionsConfig.imagesPerRound} imágenes + {activeEmotionsConfig.correctsPerRound} imágenes correctas por ronda
      </Text>

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
        Configuración actual - {activeSequenceConfig.alias}: {activeSequenceConfig.sequence}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  configText: {
    fontSize: height * 0.02,
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
  configTextUserName: {
    textAlign: 'center',
    fontSize: height * 0.025,
  },
});

export default GameModeSelectionScreen;
