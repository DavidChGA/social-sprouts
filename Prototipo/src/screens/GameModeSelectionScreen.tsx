import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react'
import { RootStackParams } from '../routes/StackNavigator';
import { PrimaryButton } from '../components/PrimaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import { View, StyleSheet, Text } from 'react-native';
import { globalStyles } from '../theme/theme';
import { SettingsButton } from '../components/SettingsButton';

function GameModeSelectionScreen() {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { selectedCategory, selectedImages, selectedRounds } = useGlobalStoreSetup();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    });

    return (
        <View style={[globalStyles.container]}>

            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <PrimaryButton
                    onPress={() => navigation.navigate('GameVocabulary', {
                        category: selectedCategory,
                        imagesPerRound: parseInt(selectedImages, 10),
                        rounds: parseInt(selectedRounds, 10),
                    })}
                    label="Vocabulario"
                />
                <SettingsButton
                    onPress={() => navigation.navigate('Setup')}
                />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <PrimaryButton
                    onPress={() => console.log("Aquí va la GameScreenSequence")}
                    label="Secuencia"
                />
                <SettingsButton
                    onPress={() => console.log("WIP")}
                />
            </View>

        </View>
    )
}

const gameStyles = StyleSheet.create({
    textContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    answer: {
        fontSize: 80,
    },

    imageContainer: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
    },

    buttons: {
        width: 120,
        height: 40,
        paddingVertical: 5
    },
});

export default GameModeSelectionScreen