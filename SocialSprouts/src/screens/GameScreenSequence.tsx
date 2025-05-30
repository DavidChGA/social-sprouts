import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParams } from '../routes/StackNavigator';
import gameConfig from '../assets/sequence-config.json';
import React from 'react';
import { globalColors, globalStyles } from '../theme/theme';
import { AnswerModal } from '../components/AnswerModal';
import { ImageButtonSequence } from '../components/ImageButtonSequence';
import { LogCompleted, LogInitializedSequence, LogSelect } from '../logger/LogInterface';
import { useGlobalStoreUser } from '../globalState/useGlobalStoreUser';
import { gameTypes, logTypes, objectTypes } from '../logger/LogEnums';
import logger from '../logger/Logger';
import SoundPlayer from '../utils/soundPlayer';
import { StackNavigationProp } from '@react-navigation/stack';

const { height } = Dimensions.get('window');

type GameScreenSequenceRouteProp = RouteProp<RootStackParams, 'GameSequence'>;

const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const GameScreenSequence = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
    const { name: routeName } = useRoute();

    const { isInSession, correctAnswersSession, roundsPlayedSession, wrongAnswersSession,
        setCorrectAnswersSession, setRoundsPlayedSession, setWrongAnswersSession, nextModule} = useGlobalStoreUser(state => state);

    const route = useRoute<GameScreenSequenceRouteProp>();
    const { sequence } = route.params;

    const [currentImages, setCurrentImages] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [modalImage, setModalImage] = useState('');
    const [imageBorders, setImageBorders] = useState<Record<string, string>>({});
    const [nextId, setNextId] = useState(1);

    const { selectedUser } = useGlobalStoreUser();

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        initializeGame();
    }, []);

    const initializeGame = () => {
        const imagesSequence = gameConfig.secuencias[sequence];

        const logInicio: LogInitializedSequence = {
            playerId: selectedUser.userId,
            action: logTypes.Initialized,
            object: objectTypes.Game,
            timestamp: new Date().toISOString(),
            otherInfo: "",
            category: sequence,
            gameType: gameTypes.Sequence,
            allOptions: [],
        };

        const roundImages = imagesSequence.map((image, index) => ({
            id: index + 1,
            name: image.name,
            imgName: image.imgName,
        }));

        const shuffleImages = shuffleArray(roundImages);
        setCurrentImages(shuffleImages);

        const initialVisibleTexts: Record<string, boolean> = {};

        roundImages.forEach((img: any) => {
            initialVisibleTexts[img.name] = false;
            logInicio.allOptions.push(img.name);
        });

        logger.log(logInicio);

    };

    // Manejar la selección de una imagen
    const handleImagePress = async (id: number, name: string) => {
        const isCorrect = id === nextId;

        const logTry: LogSelect = {
            playerId: selectedUser.userId,
            action: logTypes.Selected,
            object: objectTypes.Round,
            timestamp: new Date().toISOString(),
            correctOption: gameConfig.secuencias[sequence][nextId - 1].name,
            result: isCorrect,
            selectedOption: name,
            otherInfo: "",
            gameType: gameTypes.Sequence,
        };

        logger.log(logTry);

        setModalMessage(isCorrect ? `¡Correcto!` : `¡Incorrecto!`);
        setModalImage(isCorrect ? require('../assets/img/answer/bien.png') : require('../assets/img/answer/mal.png'));
        setIsModalVisible(true);

        SoundPlayer.correctIncorrect(isCorrect);

        setTimeout(() => {
            setIsModalVisible(false);
        }, 1500);

        if (isCorrect) {
            setNextId(nextId + 1);
            setImageBorders((prevBorders) => ({
                ...prevBorders,
                [name]: 'forestgreen', // Verde si es correcta
            }));
            setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
        }
        else {
            setWrongAnswers((prevWrongAnswers) => prevWrongAnswers + 1);
        }

        //Compruebo final de secuencia
        if (nextId >= currentImages.length) {
            await wait(1000);

            const logFin: LogCompleted = {
                playerId: selectedUser.userId,
                action: logTypes.Completed,
                object: objectTypes.Game,
                timestamp: new Date().toISOString(),
                otherInfo: "sequence completed",
                gameType: gameTypes.Sequence,
            };

            logger.log(logFin);

            if (isInSession) {
                setCorrectAnswersSession(correctAnswers + 1 + correctAnswersSession);
                setWrongAnswersSession(wrongAnswers + wrongAnswersSession);
                setRoundsPlayedSession(1 + roundsPlayedSession);
                nextModule(navigation, routeName);
            } else {
                navigation.navigate('GameOver', {
                    correctAnswers: correctAnswers + 1,
                    wrongAnswers: wrongAnswers,
                    roundsPlayed: 1,
                });
            }

        }

        return isCorrect;
    };

    return (
        <View style={[globalStyles.container]}>
            <View style={gameStyles.textContainer}>
                <Text style={globalStyles.title}>SELECCIONA LOS PICTOGRAMAS EN ORDEN</Text>
            </View>

            <View style={gameStyles.imageContainer}>
                {currentImages.map((item, index) => {
                    const borderColor = imageBorders[item.name] || 'black';
                    return (
                        <View key={index} style={{ alignItems: 'center', flexDirection: 'column', width: '15%', height: '100%' }}>
                            <ImageButtonSequence
                                onPress={() => handleImagePress(item.id, item.name)}
                                image={item.imgName}
                                style={{
                                    borderColor: borderColor, // Color según selección
                                    borderWidth: borderColor !== 'black' ? height * 0.015 : height * 0.005,
                                    borderRadius: 10,
                                }}
                            />
                            <Text style={{ fontSize: height * 0.025, color: globalColors.dark, textAlign: 'center' }}>{item.name}</Text>
                        </View>
                    );
                })}
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
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10%',
        marginTop: '5%',
    },
});
