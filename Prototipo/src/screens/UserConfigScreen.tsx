/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import type { RootStackParams } from '../routes/StackNavigator';
import { SecondaryButton } from '../components/SecondaryButton';
import { Genders, Levels, useGlobalStoreUser } from '../globalState/useGlobalStoreUser';
import { Dropdown } from 'react-native-element-dropdown';
import { globalStyles } from '../theme/theme';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { LogChangePlayer, userData } from '../logger/LogInterface';
import logger from '../logger/Logger';
import { logTypes, objectTypes } from '../logger/LogEnums';

const { height } = Dimensions.get('window');

export const UserConfigScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { userName, userAge, userGender, userId, userLevel, soundActive, setUserName, setUserAge, setUserGender, setUserId, setUserLevel, setsoundActive, getUserAge, getUserGender, getUserId, getUserLevel, getUserName, getsoundActive } = useGlobalStoreUser();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const genderOptions = Object.entries(Genders).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  const levelOptions = Object.entries(Levels).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  const saveConfig = () => {
    const uniqueId = uuidv4();
    setUserId(uniqueId);

    const userDataV: userData = {
      userName: getUserName(),
      userAge: getUserAge(),
      userGender: userGender,
      userLevel: userLevel,
      userId: getUserId(),
      soundActive: getsoundActive(),
    };

    const logCreation: LogChangePlayer = {
      player: userDataV,
      action: logTypes.Creation,
      object: objectTypes.Player,
      timestamp: new Date().toISOString(),
      otherInfo: '',
    };

    logger.log(logCreation);

    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Configurar Usuario</Text>

      {/* <Text style={styles.configText}> Loggeado actualmente como: {userName}, {userAge}, {userGender}, {soundActive}, {userId} </Text> */}
      <View style={styles.row}>
        <View style={styles.column}>
          {/* Name */}
          <TextInput
            style={styles.input}
            placeholder="Escribir nombre"
            placeholderTextColor="gray"
            onChangeText={setUserName}
          />

          {/* Age */}
          <TextInput
            style={styles.input}
            placeholder="Escribir edad"
            placeholderTextColor="gray"
            onChangeText={(age) => setUserAge(parseInt(age, 10))}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Género:</Text>
          <Dropdown
            data={genderOptions}
            labelField="label"
            valueField="value"
            placeholder="Selecciona un género"
            value={userGender}
            onChange={(item) => setUserGender(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          <Text style={styles.label}>Grado de TEA:</Text>
          <Dropdown
            data={levelOptions}
            labelField="label"
            valueField="value"
            placeholder="Selecciona un grado de TEA"
            value={userLevel}
            onChange={(item) => setUserLevel(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          <View style={styles.radioContainer}>
            <TouchableOpacity onPress={() => setsoundActive(!soundActive)} style={styles.radioButton}>
              <View style={soundActive ? styles.radioSelected : styles.radioUnselected} />
            </TouchableOpacity>
            <Text style={styles.radioText}>
              {soundActive ? "Sonido al jugar Activado" : "Sonido al jugar Desactivado"}
            </Text>
          </View>
        </View>
      </View>

      <SecondaryButton onPress={saveConfig} label="Guardar configuración" />
    </View >
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: height * 0.03,
    marginVertical: '2%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espaciado entre columnas
  },
  dropdown: {
    height: '15%',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: '10%',
    paddingHorizontal: '5%',
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
    height: '17%',
    borderRadius: 5,
    marginBottom: '10%',
    paddingHorizontal: '6%',
    fontSize: height * 0.025,
    backgroundColor: 'white',
  },
  column: {
    marginVertical: '1%',
    marginHorizontal: '5%',
    justifyContent: 'center',
    width: '30%',
  },
  configText: {
    textAlign: 'center',
    marginVertical: '1%',
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "5%",
  },
  radioButton: {
    width: height * 0.04, // 4% del alto de la pantalla
    height: height * 0.04,
    borderRadius: height * 0.02, // Hace que el botón sea circular
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "3%",
  },
  radioSelected: {
    width: height * 0.02, // 2% del alto de la pantalla
    height: height * 0.02,
    borderRadius: height * 0.01,
    backgroundColor: "#007AFF",
  },
  radioUnselected: {
    width: height * 0.02,
    height: height * 0.02,
    borderRadius: height * 0.01,
    backgroundColor: "white",
  },
  radioText: {
    fontSize: height * 0.025,
    color: "#333",
  },
});
