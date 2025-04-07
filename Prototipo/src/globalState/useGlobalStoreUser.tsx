/* eslint-disable prettier/prettier */
import { create } from 'zustand';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
import { EmotionsConfig, SequenceConfig, VocabularyConfig } from './useGlobalStoreSetup';

import { LogCompletedSession } from '../logger/LogInterface';
import logger from '../logger/Logger';
import { logTypes, objectTypes } from '../logger/LogEnums';

enum Genders {
  Masculino = "M",
  Femenino = "F",
  'No Binario' = "NB"
}

enum Levels {
  'Grado 1' = "G1",
  'Grado 2' = "G2",
  'Grado 3' = "G3"
}

interface Session {
  modules: (VocabularyConfig | SequenceConfig | EmotionsConfig)[];
}

export interface User {
  userId: string;
  userName: string;
  userAge: number;
  userGender: Genders;
  userLevel: Levels;
  soundActive: boolean;
  session: Session;
}

interface UserState {
  users: User[];
  selectedUser: User;
  setsoundActive: (active: boolean) => void;

  isInSession: boolean,
  currentModuleIndex: number;
  correctAnswersSession: number;
  wrongAnswersSession: number;
  roundsPlayedSession: number;
  nextModule: (navigate: NavigationProp<RootStackParams>['navigate']) => void;

  // Actions
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (user: User) => void;
  selectUser: (user: User) => void;

  // Actions
  setIsInSession: (value: boolean) => void;
  setCorrectAnswersSession: (value: number) => void;
  setWrongAnswersSession: (value: number) => void;
  setRoundsPlayedSession: (value: number) => void;
  setSessionModules: (modules: (VocabularyConfig | SequenceConfig | EmotionsConfig)[]) => void;
  addModuleToSession: (module: VocabularyConfig | SequenceConfig | EmotionsConfig) => void;
  removeModuleFromSession: (module: VocabularyConfig | SequenceConfig | EmotionsConfig) => void;
  updateSessionModules: (modules: (VocabularyConfig | SequenceConfig | EmotionsConfig)[]) => void;
  resetSession: () => void;
}

export const defaultSession: Session = {
  modules: [
    { alias: 'Predeterminado', category: 'Animal', imagesPerRound: '3', rounds: '3' } as VocabularyConfig,
    { alias: 'Predeterminado', sequence: 'Lavado de manos' } as SequenceConfig,
    { alias: 'Predeterminado', emotion: 'Felicidad', imagesPerRound: '3', correctsPerRound: '1', rounds: '3' } as EmotionsConfig,
  ],
}

const defaultUser: User = {
  userName: "UserTest",
  userAge: 8,
  userGender: Genders.Masculino,
  userId: "esto no es un id",
  userLevel: Levels['Grado 1'],
  soundActive: true,
  session: defaultSession
};

// Crea el store global con Zustand
const useGlobalStoreUser = create<UserState>((set, get) => ({
  users: [defaultUser],
  selectedUser: defaultUser,

  setsoundActive: (active) => set((state) => ({
    selectedUser: {
      ...state.selectedUser,
      soundActive: active,
    },
  })),

  //Session
  isInSession: false,

  correctAnswersSession: 0,
  wrongAnswersSession: 0,
  roundsPlayedSession: 0,
  currentModuleIndex: -1,

  nextModule: (navigate) => {
    set((state: UserState) => {
      const nextIndex = state.currentModuleIndex + 1;
      if (nextIndex < state.selectedUser.session.modules.length) {
        const nextModule = state.selectedUser.session.modules[nextIndex];

        if ('category' in nextModule) { navigate('GameVocabulary', nextModule as unknown as RootStackParams['GameVocabulary']); }
        else if ('sequence' in nextModule) { navigate('GameSequencePreview', nextModule as unknown as RootStackParams['GameSequencePreview']); }
        else if ('emotion' in nextModule) { navigate('GameEmotions', nextModule as unknown as RootStackParams['GameEmotions']); }

        return { currentModuleIndex: nextIndex };
      } else {
        state.setIsInSession(false);

        const { correctAnswersSession, wrongAnswersSession, roundsPlayedSession, setCorrectAnswersSession, setWrongAnswersSession, setRoundsPlayedSession } = get();

        //LOG Final de sesion
        const logFinSesion: LogCompletedSession = {
          action: logTypes.Completed,
          object: objectTypes.Session,
          timestamp: new Date().toISOString(),
          otherInfo: '',
        };

        logger.log(logFinSesion);

        navigate('GameOver', {
          correctAnswers: correctAnswersSession,
          wrongAnswers: wrongAnswersSession,
          roundsPlayed: roundsPlayedSession,
        });

        setCorrectAnswersSession(0);
        setWrongAnswersSession(0);
        setRoundsPlayedSession(0);

        return { currentModuleIndex: -1 };
      }
    });
  },

  //SESIÓN
  setIsInSession: (value: boolean) => set({ isInSession: value }),
  setCorrectAnswersSession: (value: number) => set({ correctAnswersSession: value }),
  setWrongAnswersSession: (value: number) => set({ wrongAnswersSession: value }),
  setRoundsPlayedSession: (value: number) => set({ roundsPlayedSession: value }),

  setSessionModules: (modules) =>
    set((state) => ({
      selectedUser: {
        ...state.selectedUser,
        session: { modules },
      },
    })),

  addModuleToSession: (module) =>
    set((state) => {
      const updatedModules = [...state.selectedUser.session.modules, module];

      const updatedSelectedUser = {
        ...state.selectedUser,
        session: { modules: updatedModules },
      };

      state.updateUser(updatedSelectedUser);

      return {
        selectedUser: updatedSelectedUser,
      };
    }),

  removeModuleFromSession: (module) =>
    set((state) => {
      const updatedModules = state.selectedUser.session.modules.filter(
        (mod) => mod !== module
      );

      const updatedSelectedUser = {
        ...state.selectedUser,
        session: { modules: updatedModules },
      };

      state.updateUser(updatedSelectedUser);

      return {
        selectedUser: updatedSelectedUser,
      };
    }),

  updateSessionModules: (modules) =>
    set((state) => {
      const updatedSelectedUser = {
        ...state.selectedUser,
        session: { modules },
      };

      state.updateUser(updatedSelectedUser);

      return {
        selectedUser: updatedSelectedUser,
      };
    }),


  //¿?
  resetSession: () =>
    set((state) => ({
      currentModuleIndex: -1,
    })),


  //USER
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  removeUser: (user) =>
    set((state) => {
      const newUsers = state.users.filter((u) => u.userId !== user.userId);
      const newSelectedUser = state.selectedUser.userId === user.userId
        ? newUsers[0] || defaultUser
        : state.selectedUser;

      return {
        users: newUsers.length > 0 ? newUsers : [defaultUser],
        selectedUser: newSelectedUser,
      };
    }),

  selectUser: (user) => {
    set({ selectedUser: user });
  },

  updateUser: (user) =>
    set((state) => {
      const updatedUsers = state.users.map((u) =>
        u.userId === user.userId ? { ...u, ...user } : u
      );

      const updatedSelectedUser =
        state.selectedUser.userId === user.userId
          ? { ...state.selectedUser, ...user }
          : state.selectedUser;

      return {
        users: updatedUsers,
        selectedUser: updatedSelectedUser,
      };
    }),

}));

export { useGlobalStoreUser, Genders, Levels };