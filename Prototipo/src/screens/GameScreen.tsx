/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { globalColors, globalStyles } from '../theme/theme';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { ImageButton } from '../components/ImageButton';
import type { RootStackParams } from '../routes/StackNavigator';
import { AnswerModal } from '../components/AnswerModal';

export const GameScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalImage, setModalImage] = useState('');

    const handleImagePress = (name: string, image: any, navigateAfterModal = false) => {
        setModalMessage(`¡SELECCIONASTE ${name}!`);
        setModalImage(image);
        setIsModalVisible(true);

        setTimeout(() => {
            setIsModalVisible(false);
            if (navigateAfterModal) {
                navigation.navigate('GameOver');
            }
        }, 3000);
    };

    return (
        <View style={[globalStyles.container, gameStyles.container]}>
            {/* Sección del texto */}
            <View style={gameStyles.textContainer}>
                <Text style={gameStyles.title}>
                    MARCA LA FIGURA QUE CORRESPONDE A LA PALABRA
                </Text>
            </View>

            <View style={gameStyles.imageContainer}>
                <ImageButton
                    onPress={() => handleImagePress('OSO', require('../img/bien.png'), true)}
                    image={require('../img/oso.png')}
                />
                <ImageButton
                    onPress={() => handleImagePress('LEÓN', require('../img/mal.png'))}
                    image={require('../img/león.png')}
                />
                <ImageButton
                    onPress={() => handleImagePress('MAPACHE', require('../img/mal.png'))}
                    image={require('../img/mapache.png')}
                />
            </View>

            <View style={gameStyles.textContainer}>
                <Text style={gameStyles.answer}>
                    OSO
                </Text>
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
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    textContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        color: globalColors.light,
    },

    answer: {
        textAlign: 'center',
        fontSize: 80,
        fontWeight: 'bold',
        color: globalColors.light,
    },

    imageContainer: {
        flex: 0.4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
