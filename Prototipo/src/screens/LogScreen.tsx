import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import logger from '../logger/Logger';

export const LogScreen = () => {
  const [logs, setLogs] = useState<string>('');

  // Cargar logs al abrir la pantalla
  useEffect(() => {
    fetchLogs();
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  logContainer: { marginTop: 20, padding: 10, backgroundColor: '#eee', borderRadius: 10 },
  logText: { fontSize: 14, color: '#333' },
});

export default LogScreen;
