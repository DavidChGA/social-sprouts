/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import type { RootStackParams } from '../routes/StackNavigator';
import { SecondaryButton } from '../components/SecondaryButton';
import { Genders, useGlobalStoreUser } from '../globalState/useGlobalStoreUser';
import { Dropdown } from 'react-native-element-dropdown';
import { globalStyles } from '../theme/theme';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { LogChangePlayer, userData } from '../logger/LogInterface';
import logger from '../logger/Logger';
import { logTypes, objectTypes } from '../logger/LogEnums';

export const UserConfigScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { userName, userAge, userGender, userId, setUserName, setUserAge, setUserGender, setUserId, getUserAge, getUserGender, getUserId, getUserName } = useGlobalStoreUser();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const genderOptions = Object.entries(Genders).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  const saveConfig = () => {
    const uniqueId = uuidv4();
    setUserId(uniqueId);

    const userDataV: userData = {
      userName: getUserName(),
      userAge: getUserAge(),
      userGender: getUserGender(),
      userId: getUserId(),
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

      <Text style={{ margin: 30, fontSize: 20 }}> Loggeado actualmente como: {userName}, {userAge}, {userGender}, {userId} </Text>

      {/* Name */}
      <TextInput
        style={styles.dropdown}
        placeholder="Escribir nombre"
        onChangeText={setUserName}
      />

      {/* Age */}
      <TextInput
        style={styles.dropdown}
        placeholder="Escribir edad"
        placeholderTextColor="gray"
        onChangeText={(age) => setUserAge(parseInt(age, 10))}
        keyboardType="numeric"
        maxLength={2}
      />

      {/* Gender */}
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
    fontSize:20,
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
