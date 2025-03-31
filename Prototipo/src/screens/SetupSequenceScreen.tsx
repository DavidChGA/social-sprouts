/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TextInput, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import gameConfig from '../assets/sequence-config.json';
import { globalStyles } from '../theme/theme';
import { SecondaryButton } from '../components/SecondaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';

const { height } = Dimensions.get('window');

export const SetupSequenceScreen = ({ route }) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const addInSession = route.params;
  const {
    selectedSequenceConfig,
    defaultSequenceConfig,
    addSequenceConfig,
    selectSequenceConfig,
    addModuleToSession,
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
    if(addInSession){
      addModuleToSession(newConfig);
    }
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Configurar Secuencia</Text>

      <View style={styles.column}>
        <Text style={styles.label}>Alias para la configuración:</Text>
        <TextInput
          style={styles.input}
          value={alias}
          onChangeText={setAlias}
          placeholder="Nombre de la configuración"
          placeholderTextColor="gray"
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
      </View>
      <SecondaryButton onPress={saveConfig} label="Guardar configuración" />

    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: height * 0.03,
    marginVertical: '2%',
  },
  dropdown: {
    height: '15%',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: '1%',
    paddingHorizontal: '2%',
    fontSize: height * 0.025,
  },
  placeholder: {
    fontSize: height * 0.025,
    color: 'gray',
  },
  selectedText: {
    fontSize: height * 0.025,
    color: 'black',
  },
  input: {
    height: '15%',
    borderRadius: 5,
    marginBottom: '1%',
    paddingHorizontal: '6%',
    fontSize: height * 0.025,
    backgroundColor: 'white',
  },
  column: {
    margin: '1%',
    justifyContent: 'center',
  },
});
