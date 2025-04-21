/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import type { RootStackParams } from '../routes/StackNavigator';
import { SecondaryButton } from '../components/SecondaryButton';
import { Genders, Levels, useGlobalStoreUser, User } from '../globalState/useGlobalStoreUser';
import { Dropdown } from 'react-native-element-dropdown';
import { globalStyles } from '../theme/theme';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { LogChangePlayer, userData } from '../logger/LogInterface';
import logger from '../logger/Logger';
import { logTypes, objectTypes } from '../logger/LogEnums';
import {defaultSession} from '../globalState/useGlobalStoreUser'; 

const { height } = Dimensions.get('window');

export const UserConfigScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { users, selectedUser, addUser, updateUser, selectUser } = useGlobalStoreUser();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // Estados locales
  const [userName, setUserName] = useState<string>(selectedUser.userName);
  const [userAge, setUserAge] = useState<number>(selectedUser.userAge);
  const [userGender, setUserGender] = useState<Genders>(selectedUser.userGender);
  const [userLevel, setUserLevel] = useState<Levels>(selectedUser.userLevel);
  const [userId, setUserId] = useState<string>(selectedUser.userId);
  const [soundActive, setSoundActive] = useState<boolean>(selectedUser.soundActive);

  const genderOptions = Object.entries(Genders).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  const levelOptions = Object.entries(Levels).map(([key, value]) => ({
    label: key,
    value: value,
  }));


  const saveConfig = () => {
    const userDataV = {
      userName: userName,
      userAge: userAge,
      userGender: userGender,
      userLevel: userLevel,
      userId: userId,
      soundActive: soundActive,
      session: selectedUser.session
    };

    const isExistingUser= users.some(user => user.userId === userId);

    if (isExistingUser) {
      //Update
      const userFound = users.find(user => user.userId === userId);
      userDataV.session = userFound!.session;
      updateUser(userDataV)
    }
    else {
      //Add
      userDataV.session = defaultSession
      addUser(userDataV)
    }
    selectUser(userDataV);

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

  //----
  const configListData = [
    ...users.map((user: User) => ({ label: user.userName, value: user.userName, user: user })),
    { label: 'Nuevo Usuario', value: 'Nuevo Usuario', user: null },
  ];

  return (
    <View style={globalStyles.container}>

      <Text style={globalStyles.title}>Configurar Usuario</Text>

      {/* <Text style={styles.configText}> Loggeado actualmente como: {userName}, {userAge}, {userGender}, {soundActive}, {userId} </Text> */}
      <View style={styles.row}>
        <View style={styles.column}>
          {/* Lista de usuarios */}
          <Text style={[styles.label, {marginTop: '4%'}]}>
            Usuarios:
          </Text>
          <Dropdown
            data={configListData}
            labelField="label"
            valueField="value"
            placeholder="Selecciona una configuración"
            value={userName}
            onChange={(item) => {
              if (item.value === 'Nuevo Usuario') {
                setUserName('');
                setUserAge(8);
                setUserGender(Genders.Masculino);
                setUserLevel(Levels['Grado 1']);
                setUserId(uuidv4());
                setSoundActive(true);
              } else {
                setUserName(item.user!.userName);
                setUserAge(item.user!.userAge);
                setUserGender(item.user!.userGender);
                setUserLevel(item.user!.userLevel);
                setUserId(item.user!.userId);
                setSoundActive(item.user!.soundActive);
              }
            }}
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
          />

          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribir nombre"
            placeholderTextColor="gray"
            onChangeText={setUserName}
            value={userName}
          />

          <Text style={styles.label}>Edad:</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribir edad"
            placeholderTextColor="gray"
            onChangeText={(age) => {
              const parsedAge = parseInt(age, 10);
              if (!isNaN(parsedAge)) {
                setUserAge(parsedAge);
              }
              else{
                setUserAge(0);
              }
            }}
            keyboardType="numeric"
            maxLength={2}
            value={userAge === 0 ? "" : String(userAge)}
          />
        </View>
        <View style={styles.column}>
          <Text style={[styles.label, {marginTop: '4%'}]}>Género:</Text>
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
            <TouchableOpacity onPress={() => setSoundActive(!soundActive)} style={styles.radioButton}>
              <View style={soundActive ? styles.radioSelected : styles.radioUnselected} />
            </TouchableOpacity>
            <Text style={styles.radioText}>
              {soundActive ? 'Sonido al jugar Activado' : 'Sonido al jugar Desactivado'}
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espaciado entre columnas
  },
  dropdown: {
    height: '12%',
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
    marginHorizontal: '5%',
    width: '30%',
  },
  configText: {
    textAlign: 'center',
    marginVertical: '1%',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
  },
  radioButton: {
    width: height * 0.04, // 4% del alto de la pantalla
    height: height * 0.04,
    borderRadius: height * 0.02, // Hace que el botón sea circular
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '3%',
  },
  radioSelected: {
    width: height * 0.02, // 2% del alto de la pantalla
    height: height * 0.02,
    borderRadius: height * 0.01,
    backgroundColor: '#007AFF',
  },
  radioUnselected: {
    width: height * 0.02,
    height: height * 0.02,
    borderRadius: height * 0.01,
    backgroundColor: 'white',
  },
  radioText: {
    fontSize: height * 0.025,
    color: '#333',
  },
});
