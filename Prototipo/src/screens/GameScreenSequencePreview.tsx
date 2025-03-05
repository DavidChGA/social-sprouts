/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { globalStyles } from '../theme/theme';
import { type NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParams } from '../routes/StackNavigator';
import gameConfig from '../assets/sequence-config.json';
import imageMapSequences from '../assets/imageMapSequences';
import { PrimaryButton } from '../components/PrimaryButton';

type GameScreenSequenceRouteProp = RouteProp<RootStackParams, 'GameSequence'>;

export const GameScreenSequencePreview = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const route = useRoute<GameScreenSequenceRouteProp>();
    const { sequence } = route.params;

    const [currentImages, setCurrentImages] = useState<any[]>([]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        initializeGame();
    }, []);

    const initializeGame = () => {
        const imagesSequence = gameConfig.secuencias[sequence];

        const roundImages = imagesSequence.map(image => ({
            name: image.name,
        }));

        setCurrentImages(roundImages);
    }

    return (
        <View style={[globalStyles.container]}>
            <View style={gameStyles.textContainer}>
                <Text style={globalStyles.title}> {sequence} </Text>
            </View>

            <View style={gameStyles.imageContainer}>
                {currentImages.map((item, index) => (
                    <View key={index} style={{ alignItems: 'center', flexDirection: 'column', width: '17%', height: '100%' }}>
                        <Image
                            source={imageMapSequences[item.name]}
                            style={{ width: 100, height: 100 }}
                            resizeMode="contain"
                        />
                    </View>
                ))}
            </View>

            <PrimaryButton
                onPress={() => console.log("WIP")}
                label="Continuar"
            />
        </View>
    )

}

export default GameScreenSequencePreview

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
});
