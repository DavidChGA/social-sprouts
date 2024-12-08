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
    const txt1 = 'OSO';
    const txt2 = 'LEÓN';
    const txt3 = 'MAPACHE';
    const [visibleTexts, setVisibleTexts] = useState({ [txt1]: false, [txt2]: false, [txt3]: false });

    const handleImagePress = (name: string, image: any, navigateAfterModal = false) => {
        setModalMessage(`¡SELECCIONASTE ${name}!`);
        setModalImage(image);
        setIsModalVisible(true);
        toggleVisibility(name);

        setTimeout(() => {
            setIsModalVisible(false);
            if (navigateAfterModal) {
                navigation.navigate('GameOver');
            }
        }, 3000);
    };

    const toggleVisibility = (key) => {
        setVisibleTexts((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
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

                <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <ImageButton
                            onPress={() => handleImagePress(txt1, require('../img/answer/bien.png'), true)}
                            image={require('../img/animales/oso.png')}
                        />
                    </View>

                    {visibleTexts[txt1] && <Text style={{font: 20, color: globalColors.dark}}>{txt1}</Text>}
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <ImageButton
                            onPress={() => handleImagePress(txt2, require('../img/answer/mal.png'))}
                            image={require('../img/animales/león.png')}
                        />
                    </View>

                    {visibleTexts[txt2] && <Text style={{font: 20, color: globalColors.dark}}>{txt2}</Text>}
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <ImageButton
                            onPress={() => handleImagePress(txt3, require('../img/answer/mal.png'))}
                            image={require('../img/animales/mapache.png')}
                        />
                    </View>

                    {visibleTexts[txt3] && <Text style={{font: 20, color: globalColors.dark}}>{txt3}</Text>}
                </View>

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
