/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../routes/StackNavigator';
import gameConfig from '../assets/game-config.json';
import {PrimaryButton} from '../components/PrimaryButton';

export const SetupScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  // Estados para configuración del juego (cambiamos a string | null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string | null>(null); // Cambio a string
  const [selectedRounds, setSelectedRounds] = useState<string | null>(null); // Cambio a string

  // Opciones válidas de imágenes y rondas
  const options = [
    {images: 3, rounds: [1, 2, 3]},
    {images: 4, rounds: [1, 2]},
    {images: 5, rounds: [1, 2]},
    {images: 6, rounds: [1]},
  ];

  // Categorías
  const categories = Object.keys(gameConfig.categorias).map(category => ({
    label: category,
    value: category,
  }));

  // Opciones de imágenes (convertimos a string)
  const imageOptions = options.map(option => ({
    label: `${option.images} imágenes`,
    value: option.images.toString(), // Convertimos a string
  }));

  // Opciones de rondas (convertimos a string)
  const roundOptions = selectedImages
    ? options
        .find(option => option.images.toString() === selectedImages)
        ?.rounds.map(round => ({
          label: `${round} ronda(s)`,
          value: round.toString(), // Convertimos a string
        })) || []
    : [];

  const startGame = () => {
    if (!selectedCategory || !selectedImages || !selectedRounds) {
      Alert.alert(
        'Error',
        'Por favor selecciona todos los campos antes de continuar.',
      );
      return;
    }

    // Navegar a la pantalla de juego con la configuración seleccionada
    navigation.navigate('Game', {
      category: selectedCategory,
      imagesPerRound: parseInt(selectedImages, 10),
      rounds: parseInt(selectedRounds, 10),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar el Juego</Text>

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
          setSelectedRounds(null); // Reiniciar selección de rondas
        }}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
      />

      {/* Selección de rondas */}
      <Text style={styles.label}>Número de rondas:</Text>
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

      {/* Botón para iniciar el juego */}
      <PrimaryButton onPress={startGame} label="Iniciar juego" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  dropdown: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  placeholder: {
    fontSize: 16,
    color: 'gray',
  },
  selectedText: {
    fontSize: 16,
    color: 'black',
  },
  disabledDropdown: {
    backgroundColor: '#e0e0e0',
  },
});
