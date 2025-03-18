/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TextInput, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import { globalStyles } from '../theme/theme';
import gameConfig from '../assets/emotions-config.json';
import { SecondaryButton } from '../components/SecondaryButton';
import useGlobalStoreSetup from '../globalState/useGlobalStoreSetup';

const { height } = Dimensions.get('window');

export const SetupEmotionsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {
    emotionsConfigs,
    selectedEmotionsConfig,
    defaultEmotionsConfig,
    addEmotionsConfig,
    selectEmotionsConfig,
  } = useGlobalStoreSetup();

  // Estados locales
  const [alias, setAlias] = useState(
    selectedEmotionsConfig?.alias || defaultEmotionsConfig.alias
  );
  const [emotion, setEmotion] = useState(
    selectedEmotionsConfig?.emotion || defaultEmotionsConfig.emotion
  );
  const [images, setImages] = useState(
    selectedEmotionsConfig?.images || defaultEmotionsConfig.images
  );
  const [rounds, setRounds] = useState(
    selectedEmotionsConfig?.rounds || defaultEmotionsConfig.rounds
  );
  const [correctsPerRound, setCorrectsPerRound] = useState(
    selectedEmotionsConfig?.correctsPerRound || defaultEmotionsConfig.correctsPerRound
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Opciones válidas de imágenes y rondas
  //TODO
  const options = [
    { images: 3, rounds: [1], correctsPerRound: [1, 2] },
    { images: 4, rounds: [1], correctsPerRound: [1, 2, 3] },
    { images: 5, rounds: [1], correctsPerRound: [1, 2, 3, 4] },
    { images: 6, rounds: [1], correctsPerRound: [1, 2, 3, 4, 5] },
  ];

  // Emocións: se generan a partir del JSON de configuración
  const emociones = Object.keys(gameConfig.emociones).map((emo) => ({
    label: emo,
    value: emo,
  }));

  // Opciones de imágenes (convertimos a string)
  const imageOptions = options.map(option => ({
    label: `${option.images} imágenes`,
    value: option.images.toString(),
  }));

  // Opciones de imágenes correctas (convertimos a string)
  const imageCorrectOptions = images
  ? options
    .find(option => option.images.toString() === images)
    ?.correctsPerRound.map(corrects => ({
      label: `${corrects} imágenes correctas`,
      value: corrects.toString(),
    })) || []
  : [];

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
    if (!alias || !emotion || !images || !rounds) {
      Alert.alert(
        'Error',
        'Por favor selecciona todos los campos antes de continuar.'
      );
      return;
    }

    // Verificar si ya existe una configuración con el mismo alias
    const aliasExists = emotionsConfigs.some(config => config.alias === alias);
    if (aliasExists) {
      Alert.alert('Error', 'El alias ya está en uso. Usa un nombre diferente.');
      return;
    }

    const newConfig = {
      alias,
      emotion,
      images,
      rounds,
      correctsPerRound
    };

    console.log(newConfig);
    

    addEmotionsConfig(newConfig);
    selectEmotionsConfig(alias);
    navigation.goBack();
  };

  const activeConfig = selectedEmotionsConfig ? selectedEmotionsConfig : defaultEmotionsConfig;
  const otherConfigs = emotionsConfigs.filter(config => config.alias !== activeConfig.alias);
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
            value={activeConfig.alias}
            onChange={(item) => {
              if (item.value === 'Nueva configuración') {
                setAlias('');
                setEmotion('');
                setImages('');
                setRounds('');
              } else {
                setAlias(item.config!.alias);
                setEmotion(item.config!.emotion);
                setImages(item.config!.images);
                setRounds(item.config!.rounds);
                selectEmotionsConfig(item.config!.alias);
              }
            }}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />
          <Text style={styles.label}>Alias para la configuración:</Text>
          <TextInput
            style={styles.input}
            value={alias !== defaultEmotionsConfig.alias ? alias : ''}
            onChangeText={setAlias}
            placeholder="Nombre de la configuración"
            placeholderTextColor="gray"
          />

        </View>

        {/* Columna 2 - Emoción, imágenes y rondas */}
        <View style={styles.column}>
          <Text style={styles.label}>Selecciona una emoción:</Text>
          <Dropdown
            data={emociones}
            labelField="label"
            valueField="value"
            placeholder="Selecciona una emocion"
            value={emotion}
            onChange={(item) => setEmotion(item.value)}
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
            value={images}
            onChange={item => {
              setImages(item.value);
              setRounds('');
            }}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            itemTextStyle={styles.selectedText}
          />

          {/* Selección de imágenes correctas por ronda */}
          <Text style={styles.label}>Número de imágenes correctas por ronda:</Text>
          <Dropdown
            data={imageCorrectOptions}
            labelField="label"
            valueField="value"
            placeholder="Selecciona el número de correctas"
            value={correctsPerRound}
            onChange={item => setCorrectsPerRound(item.value)}
            style={[styles.dropdown, !images && styles.disabledDropdown]}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            itemTextStyle={styles.selectedText}
            disable={!images}
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
            itemTextStyle={styles.selectedText}
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
