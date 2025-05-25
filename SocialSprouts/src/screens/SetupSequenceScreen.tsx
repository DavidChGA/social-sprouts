import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TextInput, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import gameConfig from '../assets/sequence-config.json';
import { globalStyles } from '../theme/theme';
import { SecondaryButton } from '../components/SecondaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import { useGlobalStoreUser } from '../globalState/useGlobalStoreUser';

const { height } = Dimensions.get('window');

export const SetupSequenceScreen = ({ route }) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const addInSession = route.params;
  const {
    sequenceConfigs,
    selectedSequenceConfig,
    defaultSequenceConfig,
    addSequenceConfig,
    selectSequenceConfig,
    updateSequenceConfig,
  } = useGlobalStoreSetup();

  const {addModuleToSession} = useGlobalStoreUser();

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

    const isExistingConfig = sequenceConfigs.some(config => config.alias === alias);

    const configData = {
      alias,
      sequence,
    };

    if (isExistingConfig) {
      updateSequenceConfig(alias, configData);
    }
    else {
      addSequenceConfig(configData);
    }

    selectSequenceConfig(alias);
    if (addInSession) {
      addModuleToSession({
        alias,
        sequence,
      });
    }
    navigation.goBack();
  };

  const activeConfig = selectedSequenceConfig ? selectedSequenceConfig : defaultSequenceConfig;
  const otherConfigs = sequenceConfigs.filter(config => config.alias !== activeConfig.alias);
  const configListData = [
    { label: activeConfig.alias, value: activeConfig.alias, config: activeConfig },
    ...otherConfigs.map(c => ({ label: c.alias, value: c.alias, config: c })),
    { label: 'Nueva configuración', value: 'Nueva configuración' },
  ];

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Configurar Secuencia</Text>

      <View style={styles.row}>
        {/* Columna 1 - Configuraciones y botón */}
        <View style={styles.column}>
          {/* Lista de configuraciones */}
          <Text style={styles.label}>
            Tus configuraciones:
          </Text>
          <Dropdown
            data={configListData}
            labelField="label"
            valueField="value"
            placeholder="Selecciona una configuración"
            value={alias}
            onChange={(item) => {
              if (item.value === 'Nueva configuración') {
                setAlias('');
                setSequence('');
              } else {
                setAlias(item.config!.alias);
                setSequence(item.config!.sequence);
                selectSequenceConfig(item.config!.alias);
              }
            }}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            itemTextStyle={styles.selectedText}
          />
          <Text style={styles.label}>Alias para la configuración:</Text>
          <TextInput
            style={styles.input}
            value={alias !== defaultSequenceConfig.alias ? alias : ''}
            onChangeText={setAlias}
            placeholder="Nombre de la configuración"
            placeholderTextColor="gray"
          />

        </View>

        {/* Columna 2 - Categoría, imágenes y rondas */}
        <View style={styles.column}>

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
            itemTextStyle={styles.selectedText}
          />
        </View>


      </View>
      <SecondaryButton onPress={saveConfig} label="Guardar configuración" />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
    height: '22%',
    borderRadius: 5,
    marginBottom: '1%',
    fontSize: height * 0.025,
    backgroundColor: 'white',
    color: 'black',
  },
  column: {
    marginTop: '10%',
    marginHorizontal: '5%',
    width: '30%',
  },
});
