/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import { globalStyles } from '../theme/theme';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useGlobalStoreUser } from '../globalState/useGlobalStoreUser';

const { height } = Dimensions.get('window');

export const SetupSessionScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { userName } = useGlobalStoreUser();

    const {
        session,
        removeModuleFromSession,
        updateSessionModules,
    } = useGlobalStoreSetup();

    const [modules, setModules] = useState(session.modules);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        setModules(session.modules);
    }, [session.modules]);

    //VocabularySetup
    const navigateToVocabularySetup = () => {
        navigation.navigate('SetupVocabulary', { addInSession: true });
    };

    // SequenceSetup
    const navigateToSequenceSetup = () => {
        navigation.navigate('SetupSequence', { addInSession: true });
    };

    // EmotionsSetup
    const navigateToEmotionsSetup = () => {
        navigation.navigate('SetupEmotions', { addInSession: true });
    };

    const handleDragEnd = ({ data }) => {
        setModules(data);
        updateSessionModules(data);
    };

    // Render del list item
    const renderSessionItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
        let displayName = '';
        let type = '';

        if ('category' in item) {
            displayName = `Vocabulario: ${item.category} + ${item.rounds} rondas + ${item.imagesPerRound} imágenes`;
            type = 'vocabulary';
        } else if ('emotion' in item) {
            displayName = `Emociones: ${item.emotion} + ${item.rounds} rondas + ${item.imagesPerRound} imágenes + ${item.correctsPerRound} imágenes correctas por ronda`;
            type = 'emotions';
        } else if ('sequence' in item) {
            displayName = `Secuencia: ${item.sequence}`;
            type = 'sequence';
        }

        return (
            <View style={[
                styles.sessionItemContainer,
                isActive && styles.selectedItem,
            ]}>
                <TouchableOpacity
                    style={styles.dragHandle}
                    onLongPress={drag}>
                    <Text style={styles.dragHandleText}>≡</Text>
                </TouchableOpacity>
                <Pressable
                    style={[
                        styles.sessionItem,
                        type === 'vocabulary' && styles.vocabularySession,
                        type === 'emotions' && styles.emotionsSession,
                        type === 'sequence' && styles.sequenceSession,
                        { display: 'flex', flex: 1 },
                    ]}
                >
                    <Text style={styles.sessionText}>{displayName}</Text>
                </Pressable>

                {/* Botón de eliminar */}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeModuleFromSession(item)}
                >
                    <Text style={styles.deleteButtonText}>✖</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={[globalStyles.container, styles.screenContainer]}>
            <Text style={globalStyles.title}>Configurar Sesión</Text>
            <Text style={styles.configTextUserName}>Estás jugando como: {userName}</Text>

            <View style={styles.contentContainer}>
                {/* Session List */}
                <View style={styles.listContainer}>
                    <Text style={globalStyles.subtitle}>Juegos Programados</Text>
                    <DraggableFlatList
                        data={modules}
                        renderItem={renderSessionItem}
                        keyExtractor={(item, index) => `session_${index}`}
                        onDragEnd={handleDragEnd}
                        ListEmptyComponent={
                            <Text style={styles.emptyListText}>
                                No hay sesiones programadas
                            </Text>
                        }
                        style={{ marginBottom: '10%' }}
                    />
                </View>

                {/* Setup Buttons */}
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={[styles.setupButton, styles.vocabularyButton]}
                        onPress={navigateToVocabularySetup}
                    >
                        <Text style={styles.setupButtonText}>Añadir Vocabulario</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.setupButton, styles.sequenceButton]}
                        onPress={navigateToSequenceSetup}
                    >
                        <Text style={styles.setupButtonText}>Añadir Secuencia</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.setupButton, styles.emotionsButton]}
                        onPress={navigateToEmotionsSetup}
                    >
                        <Text style={styles.setupButtonText}>Añadir Emociones</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    configTextUserName: {
        textAlign: 'center',
        fontSize: height * 0.03,
    },
    screenContainer: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        flex: 1,
        padding: '2%',
    },
    listContainer: {
        width: '50%',
        marginRight: '10%',
    },
    buttonContainer: {
        width: '30%',
        justifyContent: 'center',
    },
    sessionItem: {
        backgroundColor: 'white',
        padding: '2%',
        marginVertical: '1%',
        borderRadius: 8,
        elevation: 3,
        flex: 1,
    },
    vocabularySession: {
        borderLeftColor: 'blue',
        borderLeftWidth: height * 0.0075,
    },
    emotionsSession: {
        borderLeftColor: 'green',
        borderLeftWidth: height * 0.0075,
    },
    sequenceSession: {
        borderLeftColor: 'red',
        borderLeftWidth: height * 0.0075,
    },
    sessionText: {
        fontSize: height * 0.02,
    },
    emptyListText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: '5%',
        fontSize: height * 0.03,
    },
    setupButton: {
        padding: '5%',
        borderRadius: 10,
        marginVertical: '5%',
        alignItems: 'center',
    },
    vocabularyButton: {
        backgroundColor: 'blue',
    },
    emotionsButton: {
        backgroundColor: 'green',
    },
    sequenceButton: {
        backgroundColor: 'red',
    },
    setupButtonText: {
        color: 'white',
        fontSize: height * 0.03,
        fontWeight: 'bold',
    },
    sessionItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        padding: 5,
        borderRadius: 5,
        marginLeft: 10,
        width: '7%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: height * 0.025,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dragHandle: {
        padding: height * 0.0075,
        marginRight: 10,
    },
    dragHandleText: {
        fontSize: height * 0.05,
        color: 'black',
    },
    selectedItem: {
        backgroundColor: 'lightgrey',
        padding: '1%',
        elevation: 5,
    },
});
