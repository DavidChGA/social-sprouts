/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { type NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParams } from '../routes/StackNavigator';
import gameConfig from '../assets/sequence-config.json';
import { PrimaryButton } from '../components/PrimaryButton';
import React from 'react';
import { globalColors, globalStyles } from '../theme/theme';
import { AnswerModal } from '../components/AnswerModal';
import { ImageButtonSequence } from '../components/ImageButtonSequence';

type GameScreenSequenceRouteProp = RouteProp<RootStackParams, 'GameSequence'>;

interface Round {
    roundNumber: number;
    images: any[];
    correctImage: any;
}

const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
};

export const GameScreenSequence = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const route = useRoute<GameScreenSequenceRouteProp>();
    const { sequence } = route.params;

    const [currentImages, setCurrentImages] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [visibleTexts, setVisibleTexts] = useState<Record<string, boolean>>({});
    const [attempts, setAttempts] = useState(0);
    const [modalImage, setModalImage] = useState('');
    const [nextId, setNextId] = useState(1);

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
        }));

        const suffleImages = shuffleArray(roundImages);
        setCurrentImages(suffleImages);

        const initialVisibleTexts: Record<string, boolean> = {};

        roundImages.forEach((img: any) => {
            initialVisibleTexts[img.name] = false;
        });

        setVisibleTexts(initialVisibleTexts);
    }

    const toggleVisibility = (key) => {
        setVisibleTexts((prevState) => ({
            ...prevState,
            [key]: true,
        }));
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Manejar la selección de una imagen
    const handleImagePress = async (id: number, name: string) => {

        setAttempts((prevAttempts) => prevAttempts + 1);
        const isCorrect = id === nextId;

        setModalMessage(isCorrect ? `¡Correcto!` : `¡Incorrecto!`);
        setModalImage(isCorrect ? require('../assets/img/answer/bien.png') : require('../assets/img/answer/mal.png'));
        setIsModalVisible(true);

        setTimeout(() => {
            setIsModalVisible(false);
        }, 1500);

        if (isCorrect) {
            setNextId(nextId + 1);
            toggleVisibility(name);
        }

        //Compruebo final de secuencia
        if (nextId >= currentImages.length) {
            await wait(1000);

            navigation.navigate('GameOver', {
                attempts: attempts + 1,
                roundsPlayed: 1,
            });
        }

        return isCorrect;
    };

    return (
        <View style={[globalStyles.container]}>
            <View style={gameStyles.textContainer}>
                <Text>SELECCIONA LOS PICTOGRAMAS EN EL ORDEN APRENDIDO</Text>
            </View>

            <View style={gameStyles.imageContainer}>
                {currentImages.map((item, index) => (
                    <View key={index} style={{ alignItems: 'center', flexDirection: 'column', width: '15%', height: '100%' }}>
                        <ImageButtonSequence
                            onPress={() => handleImagePress(item.id, item.name)}
                            image={item.name}
                        />
                        {visibleTexts[item.name] && (
                            <Text style={{ textAlign: 'center'}}>{item.name}</Text>
                        )}
                    </View>
                ))}
            </View>

            <AnswerModal
                isVisible={isModalVisible}
                message={modalMessage}
                onClose={() => setIsModalVisible(false)}
                image={modalImage}
            />
        </View>
    );


};

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