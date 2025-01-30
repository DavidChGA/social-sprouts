/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { globalColors, globalStyles } from '../theme/theme';
import { type NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ImageButton } from '../components/ImageButton';
import type { RootStackParams } from '../routes/StackNavigator';
import { AnswerModal } from '../components/AnswerModal';
import gameConfig from '../assets/game-config.json';

type GameScreenRouteProp = RouteProp<RootStackParams, 'Game'>;

interface Round {
    roundNumber: number;
    images: any[];
    correctImage: any;
}

export const GameScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalImage, setModalImage] = useState('');
    const [currentRound, setCurrentRound] = useState(1);
    const [currentImages, setCurrentImages] = useState<any[]>([]); // Imágenes de la ronda actual
    const [correctImage, setCorrectImage] = useState<any | null>(null); // Imagen correcta de la ronda
    const [visibleTexts, setVisibleTexts] = useState<Record<string, boolean>>({});
    const [roundsData, setRoundsData] = useState<any[]>([]);
    const [attempts, setAttempts] = useState(0);

    const route = useRoute<GameScreenRouteProp>();
    const { category, imagesPerRound, rounds } = route.params;

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        initializeGame();
    }, []);

    // Función para mezclar un array (barajar)
    const shuffleArray = (array: any[]) => {
        return array.sort(() => Math.random() - 0.5);
    };

    // Cargar las imágenes de la siguiente ronda
    const loadNextRound = (round: any) => {
        setCurrentImages(round.images);
        setCorrectImage(round.correctImage);

        // Resetear visibilidad del texto para las imágenes actuales
        const initialVisibleTexts: Record<string, boolean> = {};

        //let imageMap: { [key: string]: any } = {};
        round.images.forEach((img: any) => {
            initialVisibleTexts[img.name] = false;
        });
        setVisibleTexts(initialVisibleTexts);
    };

    const initializeGame = () => {
        const shuffledImages = shuffleArray(gameConfig.categorias[category]);
        const roundsArray: Round[] = [];

        // Crear las rondas con las imágenes correctas
        for (let i = 0; i < rounds; i++) {
            const roundImages = shuffledImages.slice(i * imagesPerRound, (i + 1) * imagesPerRound);
            const correctImageForRound = roundImages[Math.floor(Math.random() * roundImages.length)];
            roundsArray.push({
                roundNumber: i + 1,
                images: roundImages.map(image => ({
                    name: image.name,
                })),
                correctImage: correctImageForRound,
            });
        }

        setRoundsData(roundsArray);
        loadNextRound(roundsArray[0]);
    };


    const toggleVisibility = (key) => {
        setVisibleTexts((prevState) => ({
            ...prevState,
            [key]: true,
        }));
    };

    // Manejar la selección de una imagen
    const handleImagePress = (name: string) => {
        setAttempts((prevAttempts) => prevAttempts + 1);
        const isCorrect = name === correctImage.name;

        setModalMessage(isCorrect ? `¡Correcto! Seleccionaste ${name}` : `¡Incorrecto! Seleccionaste ${name}`);
        setModalImage(isCorrect ? require('../assets/img/answer/bien.png') : require('../assets/img/answer/mal.png'));
        setIsModalVisible(true);
        toggleVisibility(name);

        setTimeout(() => {
            setIsModalVisible(false);
            if (isCorrect) {
                handleNextRound();
            }
        }, 1500);
    };

    // Manejar el avance de ronda
    const handleNextRound = () => {
        if (currentRound < rounds) {
            setCurrentRound((prevRound) => prevRound + 1);
            loadNextRound(roundsData[currentRound]);
        } else {
            Alert.alert('¡Juego terminado!', 'Has completado todas las rondas.', [
                {
                    text: 'Finalizar',
                    onPress: () => {
                        navigation.navigate('GameOver', {
                            attempts: attempts + 1,
                            roundsPlayed: rounds,
                        });
                    },
                },
            ]);
        }
    };

    return (
        <View style={[globalStyles.container, gameStyles.container]}>
            <View style={gameStyles.textContainer}>
                <Text style={globalStyles.title}>MARCA LA FIGURA QUE CORRESPONDE A LA PALABRA</Text>
            </View>

            <View style={gameStyles.imageContainer}>
                {currentImages.map((item, index) => (
                    <View key={index} style={{ alignItems: 'center', flexDirection: 'column', width: '17%', height: '100%' }}>
                        <ImageButton
                            onPress={() => !visibleTexts[item.name] ? handleImagePress(item.name) : undefined}
                            image={item.name}
                        />
                        {visibleTexts[item.name] && (
                            <Text style={{ fontSize: 30, color: globalColors.dark }}>{item.name}</Text>
                        )}
                    </View>
                ))}
            </View>

            <View style={gameStyles.textContainer}>
                <Text style={{ ...globalStyles.title, ...gameStyles.answer }}>{correctImage?.name}</Text>
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
