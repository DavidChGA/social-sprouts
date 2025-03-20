/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TextInput, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import gameConfig from '../assets/vocabulary-config.json';
import { globalStyles } from '../theme/theme';
import { SecondaryButton } from '../components/SecondaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';

const { height } = Dimensions.get('window');

export const SetupVocabularyScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {
    vocabularyConfigs,
    selectedVocabularyConfig,
    defaultVocabularyConfig,
    addVocabularyConfig,
    selectVocabularyConfig,
  } = useGlobalStoreSetup();

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
  });

  // Opciones válidas de imágenes y rondas
  const options = [
    { imagesPerRound: 3, rounds: [1, 3, 5] },
    { imagesPerRound: 4, rounds: [1, 3, 5] },
    { imagesPerRound: 5, rounds: [1, 2, 4] },
    { imagesPerRound: 6, rounds: [1, 2, 3] },
  ];

  // Categorías
  const categories = Object.keys(gameConfig.categorias).map(category => ({
    label: category,
    value: category,
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
        'Por favor selecciona todos los campos antes de continuar.',
      );
      return;
    }

    // Verificar si ya existe una configuración con el mismo alias
    const aliasExists = vocabularyConfigs.some(config => config.alias === alias);
    if (aliasExists) {
      Alert.alert('Error', 'El alias ya está en uso. Usa un nombre diferente.');
      return;
    }

    const newConfig = {
      alias,
      category,
      imagesPerRound,
      rounds,
    };

    addVocabularyConfig(newConfig);
    selectVocabularyConfig(alias);
    navigation.goBack();
  };

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
            value={activeConfig.alias}
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
    height: '15%',
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
    paddingHorizontal: '2%',
    fontSize: height * 0.025,
    backgroundColor: 'white',
  },
  column: {
    marginVertical: '1%',
    marginHorizontal: '5%',
    justifyContent: 'center',
    width: '30%',
  },
  disabledDropdown: {
    backgroundColor: 'gray',
  },
});
