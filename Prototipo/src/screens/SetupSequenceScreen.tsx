/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../routes/StackNavigator';
import gameConfig from '../assets/sequence-config.json';
import { globalStyles } from '../theme/theme';
import { SecondaryButton } from '../components/SecondaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';

export const SetupSequenceScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {selectedSequence, setSelectedSequence} = useGlobalStoreSetup();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // Secuencias
  const sequences = Object.keys(gameConfig.secuencias).map(secuencia => ({
    label: secuencia,
    value: secuencia,
  }));

  const saveConfig = () => {
    if (!selectedSequence) {
      Alert.alert(
        'Error',
        'Por favor selecciona todos los campos antes de continuar.',
      );
      return;
    }

    // Navegar a la pantalla de juego con la configuración seleccionada
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Configurar el Juego</Text>

      {/* Selección de categoría */}
      <Text style={styles.label}>Selecciona una secuencia:</Text>
      <Dropdown
        data={sequences}
        labelField="label"
        valueField="value"
        placeholder="Selecciona una secuencia"
        value={selectedSequence}
        onChange={item => setSelectedSequence(item.value)}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
      />

      <SecondaryButton onPress={saveConfig} label="Guardar configuración" />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 25,
    marginVertical: 10,
  },
  dropdown: {
    height: '10%',
    width: '40%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  placeholder: {
    fontSize: 20,
    color: 'gray',
  },
  selectedText: {
    fontSize: 20,
    color: 'black',
  },
  disabledDropdown: {
    backgroundColor: 'gray',
  },
});
