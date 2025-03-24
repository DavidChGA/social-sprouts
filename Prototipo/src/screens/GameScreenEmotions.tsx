/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { globalColors, globalStyles } from '../theme/theme';
import { type NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ImageButtonEmotion } from '../components/ImageButtonEmotion';
import type { RootStackParams } from '../routes/StackNavigator';
import { AnswerModal } from '../components/AnswerModal';
import gameConfig from '../assets/emotions-config.json';
import logger from '../logger/Logger';
import { useGlobalStoreUser } from '../globalState/useGlobalStoreUser';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import { LogCompleted, LogInitializedEmotions, LogInitializedRound, LogProgressed, LogSelect } from '../logger/LogInterface';
import { gameTypes, logTypes, objectTypes } from '../logger/LogEnums';
import SoundPlayer from '../utils/soundPlayer';

const { height } = Dimensions.get('window');

type GameScreenEmotionsRouteProp = RouteProp<RootStackParams, 'GameEmotions'>;

interface Round {
    roundNumber: number;
    images: any[];
    correctImages: any[];
}

export const GameScreenEmotions = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const route = useRoute<GameScreenEmotionsRouteProp>();
    const emotion = route.params.emotion;
    const imagesPerRound = parseInt(String(route.params.imagesPerRound), 10);
    const correctsPerRound = parseInt(String(route.params.correctsPerRound), 10);
    const rounds = parseInt(String(route.params.rounds), 10);

    const { isInSession } = useGlobalStoreSetup(state => state);
    const { nextModule } = useGlobalStoreSetup(state => state);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalImage, setModalImage] = useState('');
    const [currentRound, setCurrentRound] = useState(1);
    const [roundCompleted, setRoundCompleted] = useState(false);
    const [currentImages, setCurrentImages] = useState<any[]>([]); // Imágenes de la ronda actual

    const [correctImages, setCorrectImages] = useState<any[]>([]); // Array de imágenes correctas
    const [selectedCorrectImages, setSelectedCorrectImages] = useState<string[]>([]);

    const [visibleTexts, setVisibleTexts] = useState<Record<string, boolean>>({});
    const [imageBorders, setImageBorders] = useState<Record<string, string>>({});
    const [roundsData, setRoundsData] = useState<any[]>([]);
    const [attempts, setAttempts] = useState(0);


    const { userId } = useGlobalStoreUser();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        initializeGame();
    }, []);

    // Función para mezclar un array (barajar)
    const shuffleArray = (array: any[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Cargar las imágenes de la siguiente ronda
    const loadNextRound = (round: any) => {
        setCurrentImages(round.images);
        setCorrectImages(round.correctImages);
        setSelectedCorrectImages([]);
        setRoundCompleted(false);

        const logInicioRonda: LogInitializedRound = {
            playerId: userId,
            action: logTypes.Initialized,
            object: objectTypes.Round,
            timestamp: new Date().toISOString(),
            correctOption: round.correctImage?.name,
            allOptions: [],
            otherInfo: "",
            gameType: gameTypes.Emotions,
        };

        // Resetear visibilidad del texto para las imágenes actuales
        const initialVisibleTexts: Record<string, boolean> = {};
        const initialImageBorders: Record<string, string> = {};

        round.images.forEach((img: any) => {
            initialVisibleTexts[img.imgName] = false;
            initialImageBorders[img.imgName] = 'black';
            logInicioRonda.allOptions.push(img.name);
        });

        logger.log(logInicioRonda);

        setVisibleTexts(initialVisibleTexts);
        setImageBorders(initialImageBorders);
    };

    const initializeGame = () => {
        const roundsArray: Round[] = [];

        const logInicio: LogInitializedEmotions = {
            playerId: userId,
            action: logTypes.Initialized,
            object: objectTypes.Game,
            timestamp: new Date().toISOString(),
            otherInfo: "",
            rounds: rounds,
            imagesPerRound: imagesPerRound,
            category: emotion,
            gameType: gameTypes.Emotions,
            imagesCorrectsPerRound: correctsPerRound,
        };

        logger.log(logInicio);

        const emotionImages = [...gameConfig.emociones[emotion]]; // Todas las imágenes de la emoción correcta
        const shuffledEmotionImages = shuffleArray([...emotionImages]);


        const otherEmotions = Object.keys(gameConfig.emociones).filter(e => e !== emotion);
        let allOtherEmotionImages: any[] = [];
        for (const otherEmotion of otherEmotions) {
            allOtherEmotionImages = [...allOtherEmotionImages, ...gameConfig.emociones[otherEmotion]];
        }
        const shuffledOtherImages = shuffleArray([...allOtherEmotionImages]);

        // Índices para seguir qué imágenes hemos usado
        let emotionImageIndex:number = 0;
        let otherImageIndex = 0;

        // Para cada ronda
        for (let i = 0; i < rounds; i++) {

            const correctImagesForRound = shuffledEmotionImages.slice(
                emotionImageIndex,
                emotionImageIndex + correctsPerRound
            );
            emotionImageIndex += correctsPerRound;

            // Seleccionar imágenes incorrectas para esta ronda
            const incorrectImagesForRound = shuffledOtherImages.slice(
                otherImageIndex,
                otherImageIndex + (imagesPerRound - correctsPerRound)
            );
            otherImageIndex += (imagesPerRound - correctsPerRound);

            // 6. Combinar y mezclar todas las imágenes para esta ronda
            const allRoundImages = shuffleArray([...correctImagesForRound, ...incorrectImagesForRound]);

            roundsArray.push({
                roundNumber: i + 1,
                images: allRoundImages,
                correctImages: correctImagesForRound,
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
    const handleImagePress = (item: any) => {
        setAttempts((prevAttempts) => prevAttempts + 1);

        // Verificar si es una de las imágenes correctas y si no ha sido seleccionada ya
        const isCorrectImage = correctImages.some(img => img.name === item.name);
        const alreadySelected = selectedCorrectImages.includes(item.imgName);
        const isCorrect = isCorrectImage && !alreadySelected;

        SoundPlayer.correctIncorrect(isCorrect);

        const logTry: LogSelect = {
            playerId: userId,
            action: logTypes.Selected,
            object: objectTypes.Round,
            timestamp: new Date().toISOString(),
            correctOption: emotion,
            result: false,
            selectedOption: item.name,
            otherInfo: "",
            gameType: gameTypes.Emotions,
        };

        const logTryPInRound: LogProgressed = {
            playerId: userId,
            action: logTypes.Progressed,
            object: objectTypes.Round,
            timestamp: new Date().toISOString(),
            otherInfo: "",
            gameType: gameTypes.Emotions,
        };

        if (isCorrect) {
            logTry.result = true;
            logTryPInRound.otherInfo = "try to find the next img";
            logger.log(logTry);
            logger.log(logTryPInRound);
        } else {
            logTry.result = false;
            logTryPInRound.otherInfo = "retry round";
            logger.log(logTry);
            logger.log(logTryPInRound);
        }

        setImageBorders((prevBorders) => ({
            ...prevBorders,
            [item.imgName]: isCorrect ? 'forestgreen' : 'red',
        }));

        setModalMessage(isCorrect ? `¡Correcto! Seleccionaste ${item.name}` : `¡Incorrecto! Seleccionaste ${item.name}`);
        setModalImage(isCorrect ? require('../assets/img/answer/bien.png') : require('../assets/img/answer/mal.png'));
        setIsModalVisible(true);
        toggleVisibility(item.imgName);

        if (isCorrect) {
            // Agregar a la lista de imágenes correctas seleccionadas
            setSelectedCorrectImages(prev => [...prev, item.imgName]);

            // Reducir el contador de correctas restantes
            const updatedSelectedCount = selectedCorrectImages.length + 1;
            if (updatedSelectedCount >= correctsPerRound) {

                const logTryPGame: LogProgressed = {
                    playerId: userId,
                    action: logTypes.Progressed,
                    object: objectTypes.Game,
                    timestamp: new Date().toISOString(),
                    otherInfo: "go next round",
                    gameType: gameTypes.Emotions,
                };

                logger.log(logTryPGame);

                setRoundCompleted(true);

            }
        }

        setTimeout(() => {
            setIsModalVisible(false);

            // Si la ronda está completa, avanzar a la siguiente
            if (isCorrect && selectedCorrectImages.length + 1 >= correctsPerRound) {
                setTimeout(() => {
                    handleNextRound();
                }, 1500);
            }
        }, 1500);

        return isCorrect;
    };

    // Manejar el avance de ronda
    const handleNextRound = () => {
        if (currentRound < rounds) {
            setCurrentRound((prevRound) => prevRound + 1);
            loadNextRound(roundsData[currentRound]);
        } else {

            const logFin: LogCompleted = {
                playerId: userId,
                action: logTypes.Completed,
                object: objectTypes.Game,
                timestamp: new Date().toISOString(),
                otherInfo: "all the rounds completed",
                gameType: gameTypes.Emotions,
            };

            logger.log(logFin);

            if (isInSession) {
                nextModule(navigation.navigate);
            } else {
                navigation.navigate('GameOver', {
                    attempts: attempts + 1,
                    roundsPlayed: rounds,
                });
            }
        }
    };

    return (
        <View style={[globalStyles.container]}>
            <View style={gameStyles.textContainer}>
                <Text style={globalStyles.title}>
                    MARCA LAS IMÁGENES QUE MUESTRAN {emotion.toUpperCase()}
                </Text>
                <Text style={{ ...globalStyles.subtitle }}>
                    {correctsPerRound - selectedCorrectImages.length} por encontrar
                </Text>
            </View>

            <View style={gameStyles.imageContainer}>
                {currentImages.map((item, index) => {
                    const borderColor = imageBorders[item.imgName] || 'black';
                    return (
                        <View key={index} style={{ alignItems: 'center', flexDirection: 'column', width: '17%', height: '100%' }}>
                            <ImageButtonEmotion
                                onPress={() => (!visibleTexts[item.name] && !roundCompleted) ? handleImagePress(item) : undefined}
                                image={item.imgName}
                                style={{
                                    borderColor: borderColor, // Color según selección
                                    borderWidth: borderColor !== 'black' ? height * 0.015 : height * 0.005,
                                    borderRadius: 10,
                                }}
                            />
                            {visibleTexts[item.imgName] && (
                                <Text style={{ fontSize: height * 0.035, color: globalColors.dark }}>{item.name}</Text>
                            )}
                        </View>
                    );
                })}
            </View>

            <View style={gameStyles.textContainer}>
                <Text style={{ ...globalStyles.title, ...gameStyles.answer }}>{emotion}</Text>
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
        fontSize: height * 0.1,
    },

    imageContainer: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
    },
    soundButton: {
        padding: '1%',

    },
    icon: {
        width: height * 0.08,
        height: height * 0.08,
    },
});
