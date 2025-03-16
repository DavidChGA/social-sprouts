/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import logger from '../logger/Logger';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';

const { height } = Dimensions.get('window');

export const LogScreen = () => {
  const [logs, setLogs] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  // Cargar logs al abrir la pantalla
  useEffect(() => {
    fetchLogs();
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const fetchLogs = async () => {
    const content = await logger.readLog();  // Usar logger para leer logs
    setLogs(content || 'No hay logs disponibles.');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.logContainer}>
        <Text style={styles.logText}>{logs}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: height * 0.05,
    backgroundColor: 'white',
  },
  logContainer: {
    marginTop: height * 0.01,
    padding: height * 0.025,
    backgroundColor: '#eee',
    borderRadius: height * 0.01,
  },
  logText: {
    fontSize: height * 0.02,
    color: '#333',
  },
});

export default LogScreen;
