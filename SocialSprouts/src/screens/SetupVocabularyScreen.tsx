import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TextInput, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import gameConfig from '../assets/vocabulary-config.json';
import { globalStyles } from '../theme/theme';
import { SecondaryButton } from '../components/SecondaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';
import { useGlobalStoreUser } from '../globalState/useGlobalStoreUser';

const { height } = Dimensions.get('window');

export const SetupVocabularyScreen = ({ route }) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const addInSession = route.params;
  const {
    vocabularyConfigs,
    selectedVocabularyConfig,
    defaultVocabularyConfig,
    addVocabularyConfig,
    selectVocabularyConfig,
    updateVocabularyConfig,
  } = useGlobalStoreSetup();

  const {addModuleToSession} = useGlobalStoreUser();

  // Estados locales
  const [alias, setAlias] = useState(
    selectedVocabularyConfig?.alias || defaultVocabularyConfig.alias
  );
  const [category, setCategory] = useState(
    selectedVocabularyConfig?.category || defaultVocabularyConfig.category
  );
  const [imagesPerRound, setImages] = useState(
    selectedVocabularyConfig?.imagesPerRound || defaultVocabularyConfig.imagesPerRound
  );
  const [rounds, setRounds] = useState(
    selectedVocabularyConfig?.rounds || defaultVocabularyConfig.rounds
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Opciones válidas de imágenes y rondas
  const options = [
    { imagesPerRound: 3, rounds: [1, 2, 3, 4, 5] },
    { imagesPerRound: 4, rounds: [1, 2, 3, 4, 5] },
    { imagesPerRound: 5, rounds: [1, 2, 3, 4] },
    { imagesPerRound: 6, rounds: [1, 2, 3] },
  ];

  // Categorías: se generan a partir del JSON de configuración
  const categories = Object.keys(gameConfig.categorias).map((cat) => ({
    label: cat,
    value: cat,
  }));

  // Opciones de imágenes (convertimos a string)
  const imageOptions = options.map(option => ({
    label: `${option.imagesPerRound} imágenes`,
    value: option.imagesPerRound.toString(),
  }));

  // Opciones de rondas (convertimos a string)
  const roundOptions = imagesPerRound
    ? options
      .find(option => option.imagesPerRound.toString() === imagesPerRound)
      ?.rounds.map(round => ({
        label: `${round} ronda(s)`,
        value: round.toString(),
      })) || []
    : [];

  const saveConfig = () => {
    if (!alias || !category || !imagesPerRound || !rounds) {
      Alert.alert(
        'Error',
        'Por favor selecciona todos los campos antes de continuar.'
      );
      return;
    }

    // Verificar si estamos seleccionando una configuración que ya existe
    const isExistingConfig = vocabularyConfigs.some(config => config.alias === alias);

    const configData = {
      alias,
      category,
      imagesPerRound,
      rounds,
    };


    if (isExistingConfig) {
      updateVocabularyConfig(alias, configData);
    }
    else {
      addVocabularyConfig(configData);
    }

    selectVocabularyConfig(alias);
    if (addInSession) {
      addModuleToSession({
        alias,
        category,
        imagesPerRound,
        rounds,
      });
    }
    navigation.goBack();
  };

  const activeConfig = selectedVocabularyConfig ? selectedVocabularyConfig : defaultVocabularyConfig;
  const otherConfigs = vocabularyConfigs.filter(config => config.alias !== activeConfig.alias);
  const configListData = [
    { label: activeConfig.alias, value: activeConfig.alias, config: activeConfig },
    ...otherConfigs.map(c => ({ label: c.alias, value: c.alias, config: c })),
    { label: 'Nueva configuración', value: 'Nueva configuración' },
  ];

  return (
    <View style={[globalStyles.container]}>
      <Text style={globalStyles.title}>Configurar Vocabulario</Text>

      {/* Contenedor dividido en dos columnas */}
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
                setCategory('');
                setImages('');
                setRounds('');
              } else {
                setAlias(item.config!.alias);
                setCategory(item.config!.category);
                setImages(item.config!.imagesPerRound);
                setRounds(item.config!.rounds);
                selectVocabularyConfig(item.config!.alias);
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
            value={alias !== defaultVocabularyConfig.alias ? alias : ''}
            onChangeText={setAlias}
            placeholder="Nombre de la configuración"
            placeholderTextColor="gray"
          />

        </View>

        {/* Columna 2 - Categoría, imágenes y rondas */}
        <View style={styles.column}>
          <Text style={styles.label}>Selecciona una categoría:</Text>
          <Dropdown
            data={categories}
            labelField="label"
            valueField="value"
            placeholder="Selecciona una categoría"
            value={category}
            onChange={(item) => setCategory(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            itemTextStyle={styles.selectedText}
          />

          {/* Aquí puedes agregar selectores para imágenes y rondas si los necesitas */}
          {/* Selección de número de imágenes */}
          <Text style={styles.label}>Número de imágenes por ronda:</Text>
          <Dropdown
            data={imageOptions}
            labelField="label"
            valueField="value"
            placeholder="Selecciona el número de imágenes"
            value={imagesPerRound}
            onChange={item => {
              setImages(item.value);
              setRounds('');
            }}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            itemTextStyle={styles.selectedText}
          />

          {/* Selección de rondas */}
          <Text style={styles.label}>Número de rondas (selecciona primero el nº de imágenes):</Text>
          <Dropdown
            data={roundOptions}
            labelField="label"
            valueField="value"
            placeholder="Selecciona el número de rondas"
            value={rounds}
            onChange={item => setRounds(item.value)}
            style={[styles.dropdown, !imagesPerRound && styles.disabledDropdown]}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            itemTextStyle={styles.selectedText}
            disable={!imagesPerRound}
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
    justifyContent: 'space-between', // Espaciado entre columnas
  },
  label: {
    fontSize: height * 0.03,
    marginVertical: '2%',
  },
  dropdown: {
    height: '13%',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: '1%',
    paddingHorizontal: '6%',
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
    fontSize: height * 0.025,
    backgroundColor: 'white',
    color: 'black',
  },
  column: {
    marginTop: '3%',
    marginHorizontal: '5%',
    width: '30%',
  },
  disabledDropdown: {
    backgroundColor: 'gray',
  },
});
