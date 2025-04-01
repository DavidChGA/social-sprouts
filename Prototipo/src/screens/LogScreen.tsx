/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import RNFS from 'react-native-fs';
import logger from '../logger/Logger';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import { Dropdown } from 'react-native-element-dropdown';

const { height } = Dimensions.get('window');

export const LogScreen = () => {
  const [logs, setLogs] = useState<string>('');
  const [logFiles, setLogFiles] = useState<{ label: string; value: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  useEffect(() => {
    fetchLogFiles();
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const fetchLogFiles = async () => {
    try {

      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const logFiles = files.filter(file => file.name.endsWith('.log')).map(file => ({ label: file.name, value: file.name }));
      setLogFiles(logFiles);

      if (logFiles.length > 0) {
        setSelectedFile(logFiles[logFiles.length - 1].value);
        fetchLogs(logFiles[logFiles.length - 1].value);
      }

    } catch (error) {
      console.error('Error obteniendo archivos de log:', error);
    }
  };

  const fetchLogs = async (fileName: string) => {
    try {

      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const content = await RNFS.readFile(filePath, 'utf8');
      setLogs(content || 'No hay logs disponibles.');

    } catch (error) {
      console.error('Error leyendo log:', error);
      setLogs('No hay logs disponibles.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona .log:</Text>
      <Dropdown
        data={logFiles}
        labelField="label"
        valueField="value"
        placeholder="Selecciona un archivo"
        value={selectedFile}
        onChange={(item) => {
          setSelectedFile(item.value);
          fetchLogs(item.value);
        }}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        itemTextStyle={styles.selectedText}
      />
      <ScrollView style={styles.logContainer}>
        <Text style={styles.logText}>{logs}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '3%',
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dropdown: {
    marginBottom: 10,
  },
  placeholder: {
    color: '#888',
  },
  selectedText: {
    color: '#333',
  },
  logContainer: {
    marginVertical: '1%',
    padding: '3%',
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  logText: {
    fontSize: height * 0.02,
    color: '#333',
  },
});

export default LogScreen;