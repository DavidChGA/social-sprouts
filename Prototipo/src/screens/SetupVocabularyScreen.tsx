/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../routes/StackNavigator';
import gameConfig from '../assets/vocabulary-config.json';
import { globalStyles } from '../theme/theme';
import { SecondaryButton } from '../components/SecondaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';

export const SetupVocabularyScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {selectedCategory, selectedImages, selectedRounds,
    setSelectedCategory, setSelectedImages, setSelectedRounds} = useGlobalStoreSetup();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // Opciones válidas de imágenes y rondas
  const options = [
    {images: 3, rounds: [1, 3, 5]},
    {images: 4, rounds: [1, 3, 5]},
    {images: 5, rounds: [1, 2, 4]},
    {images: 6, rounds: [1, 2, 3]},
  ];

  // Categorías
  const categories = Object.keys(gameConfig.categorias).map(category => ({
    label: category,
    value: category,
  }));

  // Opciones de imágenes (convertimos a string)
  const imageOptions = options.map(option => ({
    label: `${option.images} imágenes`,
    value: option.images.toString(),
  }));

  // Opciones de rondas (convertimos a string)
  const roundOptions = selectedImages
    ? options
        .find(option => option.images.toString() === selectedImages)
        ?.rounds.map(round => ({
          label: `${round} ronda(s)`,
          value: round.toString(),
        })) || []
    : [];

  const saveConfig = () => {
    if (!selectedCategory || !selectedImages || !selectedRounds) {
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
      <Text style={styles.label}>Selecciona una categoría:</Text>
      <Dropdown
        data={categories}
        labelField="label"
        valueField="value"
        placeholder="Selecciona una categoría"
        value={selectedCategory}
        onChange={item => setSelectedCategory(item.value)}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
      />

      {/* Selección de número de imágenes */}
      <Text style={styles.label}>Número de imágenes por ronda:</Text>
      <Dropdown
        data={imageOptions}
        labelField="label"
        valueField="value"
        placeholder="Selecciona el número de imágenes"
        value={selectedImages}
        onChange={item => {
          setSelectedImages(item.value);
          setSelectedRounds('');
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
        value={selectedRounds}
        onChange={item => setSelectedRounds(item.value)}
        style={[styles.dropdown, !selectedImages && styles.disabledDropdown]}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        disable={!selectedImages}
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
