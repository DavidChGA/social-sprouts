import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Pressable, Dimensions, Text } from 'react-native';
import { globalStyles } from '../theme/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PrimaryButton } from '../components/PrimaryButton';
import type { RootStackParams } from '../routes/StackNavigator';
import logger from '../logger/Logger';
import { gameTypes, logTypes, objectTypes } from '../logger/LogEnums';
import { LogInitializedSession } from '../logger/LogInterface';
import { useGlobalStoreUser } from '../globalState/useGlobalStoreUser';
import { StackNavigationProp } from '@react-navigation/stack';

const { height } = Dimensions.get('window');

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const { name: routeName } = useRoute();
  const { setIsInSession, nextModule, selectedUser } = useGlobalStoreUser();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const startSession = () => {

    let sessionModules = selectedUser.session.modules.map((mod) => {
      let minigame: string;

      if ('category' in mod) {
        minigame = gameTypes.Vocabulary;
      } else if ('sequence' in mod) {
        minigame = gameTypes.Sequence;
      } else if ('emotion' in mod) {
        minigame = gameTypes.Emotions;
      } else {
        minigame = 'unknown'; //NO VA A PASAR
      }

      return {
        minigame,
        ...mod,
      };
    });


    const logInicioSesion: LogInitializedSession = {
      session: sessionModules,
      action: logTypes.Initialized,
      object: objectTypes.Session,
      timestamp: new Date().toISOString(),
      otherInfo: '',
    };

    logger.log(logInicioSesion);

    setIsInSession(true);
    nextModule(navigation, routeName);
  };

  return (
    <View style={[globalStyles.container, homeStyles.container]}>
      <Image
        source={require('../assets/img/Logo_SP.png')}
        style={globalStyles.logo}
        resizeMode="contain"
      />
      <View style={homeStyles.buttonRow}>
        <View style={homeStyles.buttonColumn}>
          <PrimaryButton
            onPress={() => startSession()}
            label="Modo partida"
          />

          <View style={{ flexDirection: 'row', marginTop: '10%' }}>
            <Pressable style={{marginHorizontal: '6%'}}
              onPress={() => navigation.navigate('SetupSession')}>
              <Image
                source={require('../assets/img/configuraciones.png')}
                style={homeStyles.icon}
              />
            </Pressable>
          </View>
        </View>

        <View style={homeStyles.buttonColumn}>
          <PrimaryButton
            onPress={() => {
              setIsInSession(false);
              navigation.navigate('ModeSelection');
            }}
            label="Modo minijuegos"
          />

          <View style={{ flexDirection: 'row', marginTop: '10%', justifyContent: 'space-between'}}>
            <Pressable style={{marginHorizontal: '6%'}}
              onPress={() => navigation.navigate('UserConfig')}>
              <Image
                source={require('../assets/img/usuario.png')}
                style={homeStyles.icon}
              />
            </Pressable>

            <Pressable style={{marginHorizontal: '6%'}}
              onPress={() => navigation.navigate('Logs')}>
              <Image
                source={require('../assets/img/informacion.png')}
                style={homeStyles.icon}
              />
            </Pressable>
          </View>
        </View>
      </View>
      <Text style={homeStyles.configTextUserName}>[ATENCIÓN] Estás loggeado como: {selectedUser.userName} - Sonido {selectedUser.soundActive ? 'activado' : 'desactivado'}</Text>
    </View >
  );
};

const homeStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: '1%',
  },
  buttonColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    marginTop: '15%',
    width: height * 0.06,
    height: height * 0.06,
  },
  configTextUserName: {
    textAlign: 'center',
    fontSize: height * 0.03,
    color: 'black',
  },
});
