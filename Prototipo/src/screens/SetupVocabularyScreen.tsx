/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TextInput} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import gameConfig from '../assets/vocabulary-config.json';
import { globalStyles } from '../theme/theme';
import { SecondaryButton } from '../components/SecondaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';

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
  const [images, setImages] = useState(
    selectedVocabularyConfig?.images || defaultVocabularyConfig.images
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
    { images: 3, rounds: [1, 3, 5] },
    { images: 4, rounds: [1, 3, 5] },
    { images: 5, rounds: [1, 2, 4] },
    { images: 6, rounds: [1, 2, 3] },
  ];

  // Categorías: se generan a partir del JSON de configuración
  const categories = Object.keys(gameConfig.categorias).map((cat) => ({
    label: cat,
    value: cat,
  }));

  // Opciones de imágenes (convertimos a string)
  const imageOptions = options.map(option => ({
    label: `${option.images} imágenes`,
    value: option.images.toString(),
  }));

  // Opciones de rondas (convertimos a string)
  const roundOptions = images
    ? options
      .find(option => option.images.toString() === images)
      ?.rounds.map(round => ({
        label: `${round} ronda(s)`,
        value: round.toString(),
      })) || []
    : [];

  const saveConfig = () => {
    if (!alias || !category || !images || !rounds) {
      Alert.alert(
        'Error',
        'Por favor selecciona todos los campos antes de continuar.'
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
      images,
      rounds,
    };

    addVocabularyConfig(newConfig);
    selectVocabularyConfig(alias);
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
      <Text style={globalStyles.title}>Configurar el Juego</Text>

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
                setImages(item.config!.images);
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
          />

          {/* Aquí puedes agregar selectores para imágenes y rondas si los necesitas */}
          {/* Selección de número de imágenes */}
          <Text style={styles.label}>Número de imágenes por ronda:</Text>
          <Dropdown
            data={imageOptions}
            labelField="label"
            valueField="value"
            placeholder="Selecciona el número de imágenes"
            value={images}
            onChange={item => {
              setImages(item.value);
              setRounds('');
            }}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
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
            style={[styles.dropdown, !images && styles.disabledDropdown]}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            disable={!images}
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
  column: {
    margin: 50,
    justifyContent: 'center',
    width: '30%',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 18,
    backgroundColor: 'white',
  },
  dropdown: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  placeholder: {
    fontSize: 18,
    color: 'gray',
  },
  selectedText: {
    fontSize: 18,
    color: 'black',
  },
  disabledDropdown: {
    backgroundColor: 'gray',
  },
});








