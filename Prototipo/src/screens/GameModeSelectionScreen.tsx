/* eslint-disable prettier/prettier */
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { RootStackParams } from '../routes/StackNavigator';
import { PrimaryButton } from '../components/PrimaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import { View } from 'react-native';
import { globalStyles } from '../theme/theme';
import { SettingsButton } from '../components/SettingsButton';

function GameModeSelectionScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { selectedCategory, selectedImages, selectedRounds, selectedSequence } =
    useGlobalStoreSetup();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <View style={[globalStyles.container]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PrimaryButton
          onPress={() =>
            navigation.navigate('GameVocabulary', {
              category: selectedCategory,
              imagesPerRound: parseInt(selectedImages, 10),
              rounds: parseInt(selectedRounds, 10),
            })
          }
          label="Vocabulario"
        />
        <SettingsButton onPress={() => navigation.navigate('SetupVocabulary')} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <PrimaryButton
          onPress={() =>
            navigation.navigate('GameSequence', {
              sequence: selectedSequence,
            })
          }
          label="Secuencia"
        />
        <SettingsButton onPress={() => navigation.navigate('SetupSequence')} />
      </View>
    </View>
  );
}

export default GameModeSelectionScreen;
