/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import gameConfig from '../assets/sequence-config.json';
import { globalStyles } from '../theme/theme';
import { SecondaryButton } from '../components/SecondaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';

export const SetupSequenceScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {
    selectedSequenceConfig,
    defaultSequenceConfig,
    addSequenceConfig,
    selectSequenceConfig,
  } = useGlobalStoreSetup();

  // Estados locales
  const [alias, setAlias] = useState(
    selectedSequenceConfig?.alias || defaultSequenceConfig.alias
  );
  const [sequence, setSequence] = useState(
    selectedSequenceConfig?.sequence || defaultSequenceConfig.sequence
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const sequences = Object.keys(gameConfig.secuencias).map((secuencia) => ({
    label: secuencia,
    value: secuencia,
  }));

  const saveConfig = () => {
    if (!alias || !sequence) {
      Alert.alert(
        'Error',
        'Por favor selecciona todos los campos antes de continuar.'
      );
      return;
    }

    const newConfig = {
      alias,
      sequence,
    };

    // Guarda la nueva configuración y la selecciona automáticamente
    addSequenceConfig(newConfig);
    selectSequenceConfig(alias);
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Configurar Secuencia</Text>

      <Text style={styles.label}>Alias para la configuración:</Text>
      <TextInput
        style={styles.dropdown}
        value={alias}
        onChangeText={setAlias}
        placeholder="Nombre de la configuración"
      />

      <Text style={styles.label}>Selecciona una secuencia:</Text>
      <Dropdown
        data={sequences}
        labelField="label"
        valueField="value"
        placeholder="Selecciona una secuencia"
        value={sequence}
        onChange={(item) => setSequence(item.value)}
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
    fontSize: 20,
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
  input: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 20,
  },
});
