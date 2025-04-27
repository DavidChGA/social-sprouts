import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { globalColors, globalStyles } from '../theme/theme';
import { type NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParams } from '../routes/StackNavigator';
import gameConfig from '../assets/sequence-config.json';
import imageMapSequences from '../assets/imageMapSequences';
import { SecondaryButton } from '../components/SecondaryButton';

type GameScreenSequenceRouteProp = RouteProp<RootStackParams, 'GameSequence'>;

const { height } = Dimensions.get('window');

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

        const roundImages = imagesSequence.map((image, index) => ({
            id: index + 1,
            name: image.name,
            imgName: image.imgName,
        }));

        setCurrentImages(roundImages);
    };

    return (
        <View style={[globalStyles.container]}>
            <View style={gameStyles.textContainer}>
                <Text style={globalStyles.title}> {sequence} </Text>
            </View>

            <View style={gameStyles.imageContainer}>
                {currentImages.map((item, index) => (
                    <View key={index} style={{ alignItems: 'center', flexDirection: 'column', width: '15%', height: '100%' }}>
                        <Image
                            source={imageMapSequences[item.imgName]}
                            style={globalStyles.imageButtonSequence}
                            resizeMode="contain"
                        />
                        <Text style={{ fontSize: height * 0.025, color: globalColors.dark, textAlign: 'center'}}> {item.name} </Text>
                    </View>
                ))}
            </View>

            <SecondaryButton
                onPress={() =>
                    navigation.navigate('GameSequence', {
                      sequence: sequence,
                    })
                  }
                label="Memorizado, quiero continuar"
            />
        </View>
    );

};

export default GameScreenSequencePreview;

const gameStyles = StyleSheet.create({
    textContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
        marginTop: '5%',
    },

});


