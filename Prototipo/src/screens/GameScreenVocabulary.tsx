/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, Pressable, Dimensions } from 'react-native';
import { globalColors, globalStyles } from '../theme/theme';
import { type NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ImageButton } from '../components/ImageButton';
import type { RootStackParams } from '../routes/StackNavigator';
import { AnswerModal } from '../components/AnswerModal';
import gameConfig from '../assets/vocabulary-config.json';
import logger from '../logger/Logger';
import { LogCompleted, LogInitializedRound, LogInitializedVocabulary, LogProgressed, LogSelect } from '../logger/LogInterface';
import { gameTypes, logTypes, objectTypes } from '../logger/LogEnums';
import { useGlobalStoreUser } from '../globalState/useGlobalStoreUser';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import SoundPlayer from '../utils/soundPlayer';

const { height } = Dimensions.get('window');

type GameScreenVocabularyRouteProp = RouteProp<RootStackParams, 'GameVocabulary'>;

interface Round {
    roundNumber: number;
    images: any[];
    correctImage: any;
}

export const GameScreenVocabulary = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { isInSession } = useGlobalStoreSetup(state => state);
    const { nextModule } = useGlobalStoreSetup(state => state);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalImage, setModalImage] = useState('');
    const [currentRound, setCurrentRound] = useState(1);
    const [roundCompleted, setRoundCompleted] = useState(false);
    const [currentImages, setCurrentImages] = useState<any[]>([]); // Imágenes de la ronda actual
    const [correctImage, setCorrectImage] = useState<any | null>(null); // Imagen correcta de la ronda
    const [visibleTexts, setVisibleTexts] = useState<Record<string, boolean>>({});
    const [imageBorders, setImageBorders] = useState<Record<string, string>>({});
    const [roundsData, setRoundsData] = useState<any[]>([]);
    const [attempts, setAttempts] = useState(0);

    const route = useRoute<GameScreenVocabularyRouteProp>();
    const category:string = route.params.category;
    const rounds = parseInt(String(route.params.rounds));
    const imagesPerRound = parseInt(String(route.params.imagesPerRound));

    const { userId } = useGlobalStoreUser();

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
        setRoundCompleted(false);

        const logInicioRonda: LogInitializedRound = {
            playerId: userId,
            action: logTypes.Initialized,
            object: objectTypes.Round,
            timestamp: new Date().toISOString(),
            correctOption: round.correctImage?.name,
            allOptions: [],
            otherInfo: "",
            gameType: gameTypes.Vocabulary,
        };

        // Resetear visibilidad del texto para las imágenes actuales
        const initialVisibleTexts: Record<string, boolean> = {};

        //let imageMap: { [key: string]: any } = {};
        round.images.forEach((img: any) => {
            initialVisibleTexts[img.name] = false;
            logInicioRonda.allOptions.push(img.name);
        });

        logger.log(logInicioRonda);

        setVisibleTexts(initialVisibleTexts);
    };

    const initializeGame = () => {
        const shuffledImages = shuffleArray(gameConfig.categorias[category]);
        const roundsArray: Round[] = [];

        const logInicio: LogInitializedVocabulary = {
            playerId: userId,
            action: logTypes.Initialized,
            object: objectTypes.Game,
            timestamp: new Date().toISOString(),
            otherInfo: "",
            rounds: rounds,
            imagesPerRound: imagesPerRound,
            category: category,
            gameType: gameTypes.Vocabulary,
        };

        logger.log(logInicio);

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

        const logTry: LogSelect = {
            playerId: userId,
            action: logTypes.Selected,
            object: objectTypes.Round,
            timestamp: new Date().toISOString(),
            correctOption: correctImage.name,
            result: false,
            selectedOption: name,
            otherInfo: "",
            gameType: gameTypes.Vocabulary,
        };

        const logTryP: LogProgressed = {
            playerId: userId,
            action: logTypes.Progressed,
            object: objectTypes.Game,
            timestamp: new Date().toISOString(),
            otherInfo: "",
            gameType: gameTypes.Vocabulary,
        };

        if (isCorrect) {
            logTry.result = true;
            logTryP.otherInfo = "go next round";
            logger.log(logTry);
            logger.log(logTryP);
            setRoundCompleted(true);
        } else {
            logTry.result = false;
            logTryP.otherInfo = "retry round";
            logger.log(logTry);
            logger.log(logTryP);
        }

        SoundPlayer.correctIncorrect(isCorrect);

        setImageBorders((prevBorders) => ({
            ...prevBorders,
            [name]: isCorrect ? 'forestgreen' : 'red', // Verde si es correcta, rojo si es incorrecta
        }));

        setModalMessage(isCorrect ? `¡Correcto! Seleccionaste ${name}` : `¡Incorrecto! Seleccionaste ${name}`);
        setModalImage(isCorrect ? require('../assets/img/answer/bien.png') : require('../assets/img/answer/mal.png'));
        setIsModalVisible(true);
        toggleVisibility(name);

        setTimeout(() => {
            setIsModalVisible(false);
            if (isCorrect) {
                setTimeout(() => {
                    handleNextRound();
                }, 1500);

            }
        }, 1500);
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
                gameType: gameTypes.Vocabulary,
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

    if (correctImage?.name){
        SoundPlayer.setSound(correctImage.name);
    }

    const playAnswerSound = () => {
        SoundPlayer.playSound();
    };

    return (
        <View style={[globalStyles.container]}>
            <View style={gameStyles.textContainer}>
                <Text style={globalStyles.title}>MARCA LA FIGURA QUE CORRESPONDE A LA PALABRA</Text>
            </View>

            <View style={gameStyles.imageContainer}>
                {currentImages.map((item, index) => {
                    const borderColor = imageBorders[item.name] || 'black';
                    return (
                        <View key={index} style={{ alignItems: 'center', flexDirection: 'column', width: '17%', height: '100%' }}>
                            <ImageButton
                                onPress={() => (!visibleTexts[item.name] && !roundCompleted) ? handleImagePress(item.name) : undefined}
                                image={item.name}
                                style={{
                                    borderColor: borderColor, // Color según selección
                                    borderWidth: borderColor !== 'black' ? height * 0.015 : height * 0.005,
                                    borderRadius: 10,
                                }}
                            />
                            {visibleTexts[item.name] && (
                                <Text style={{ fontSize: height * 0.035, color: globalColors.dark }}>{item.name}</Text>
                            )}
                        </View>
                    );
                })}
            </View>

            <View style={gameStyles.textContainer}>
                <Text style={{ ...globalStyles.title, ...gameStyles.answer }}>{correctImage?.name}</Text>
                <Pressable onPress={playAnswerSound} style={gameStyles.soundButton}>
                    <Image
                        source={require('../assets/img/sound.png')}
                        style={gameStyles.icon}
                    />
                </Pressable>
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
