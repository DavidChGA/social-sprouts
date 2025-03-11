/* eslint-disable prettier/prettier */
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { RootStackParams } from '../routes/StackNavigator';
import { PrimaryButton } from '../components/PrimaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import { View } from 'react-native';
import { globalStyles } from '../theme/theme';
import { SettingsButton } from '../components/SettingsButton';
import {Text} from 'react-native'

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
      {/* VOCABULARIO */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameVocabulary', {
              category: activeVocabularyConfig.category,
              imagesPerRound: parseInt(activeVocabularyConfig.images, 10),
              rounds: parseInt(activeVocabularyConfig.rounds, 10),
            })
          }
          label="Vocabulario"
        />
        <SettingsButton onPress={() => navigation.navigate('SetupVocabulary')} />
      </View>

      <Text style={{ textAlign: 'center', marginVertical: 10 }}>
        Configuración actual: {activeVocabularyConfig.alias} (por defecto)
      </Text>

      {/* SECUENCIAS */}
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
        Configuración actual: {activeSequenceConfig.alias} (por defecto)
      </Text>

    </View>
  );
}

export default GameModeSelectionScreen;
