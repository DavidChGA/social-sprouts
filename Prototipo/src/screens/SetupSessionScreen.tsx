/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import { globalStyles } from '../theme/theme';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';

const { height } = Dimensions.get('window');

export const SetupSessionScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const {
        session,
        removeModuleFromSession
    } = useGlobalStoreSetup();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

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

    // Render del list item
    const renderSessionItem = ({ item }) => {
        let displayName = '';
        let type = '';

        if ('category' in item) {
            displayName = `Vocabulario: ${item.alias}`;
            type = 'vocabulary';
        } else if ('emotion' in item) {
            displayName = `Emociones: ${item.alias}`;
            type = 'emotions';
        } else if ('sequence' in item) {
            displayName = `Secuencia: ${item.alias}`;
            type = 'sequence';
        }

        return (
            <View style={styles.sessionItemContainer}>
                <Pressable
                    style={[
                        styles.sessionItem,
                        type === 'vocabulary' && styles.vocabularySession,
                        type === 'emotions' && styles.emotionsSession,
                        type === 'sequence' && styles.sequenceSession,
                        {display: 'flex', flex: 1}
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

            <View style={styles.contentContainer}>
                {/* Session List */}
                <View style={styles.listContainer}>
                    <Text style={globalStyles.subtitle}>Juegos Programados</Text>
                    <FlatList
                        data={session.modules}
                        renderItem={renderSessionItem}
                        keyExtractor={(item, index) => `session_${index}`}
                        ListEmptyComponent={
                            <Text style={styles.emptyListText}>
                                No hay sesiones programadas
                            </Text>
                        }
                        style={styles.sessionList}
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
    sessionList: {
        flex: 1,
        margin: '1%',
    },
    sessionItem: {
        backgroundColor: 'white',
        padding: '2%',
        marginVertical: '1%',
        borderRadius: 8,
        elevation: 3,
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
        alignItems: 'flex-start',
        marginBottom: 5
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        padding: 5,
        borderRadius: 5,
        marginLeft: 10,
        width: '7%',
        alignSelf: 'center'
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
