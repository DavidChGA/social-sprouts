/* eslint-disable prettier/prettier */
import { create } from 'zustand';

enum Genders{
  Masculino = "M",
  Femenino = "F",
  'No Binario' = "NB"
}

enum Levels{
  'Grado 1' = "G1",
  'Grado 2' = "G2",
  'Grado 3' = "G3"
}

interface UserState {
  userName: string,
  userAge: number,
  userGender: Genders,
  userId: string,
  userLevel: Levels,
  soundActive: boolean,

  setUserName: (name: string) => void;
  getUserName: () => string;
  setUserAge: (age: number) => void;
  getUserAge: () => number;
  setUserGender: (gender: Genders) => void;
  getUserGender: () => Genders;
  setUserId: (id: string) => void;
  getUserId: () => string;
  setUserLevel: (level: Levels) => void;
  getUserLevel: () => Levels;
  setsoundActive: (active:  boolean) => void;
  getsoundActive: () => boolean;
}

// Crea el store global con Zustand
const useGlobalStoreUser = create<UserState>((set) => ({
  userName: "UserTest",
  userAge: 8,
  userGender: Genders.Masculino,
  userId: "esto no es un id",
  userLevel: Levels['Grado 1'],
  soundActive: true,

  setUserName: (name) => set(() => ({ userName: name })),
   getUserName: () => {
    return useGlobalStoreUser.getState().userName;
  },
  setUserAge: (age) => set(() => ({ userAge: age })),
   getUserAge: () => {
    return useGlobalStoreUser.getState().userAge;
  },
  setUserGender: (gender) => set(() => ({ userGender: gender })),
   getUserGender: () => {
    return useGlobalStoreUser.getState().getUserGender;
  },
  setUserId: (id) => set(() => ({ userId: id })),
   getUserId: () => {
    return useGlobalStoreUser.getState().userId;
  },
  setUserLevel: (level) => set(() => ({ userLevel: level })),
  getUserLevel: () => {
   return useGlobalStoreUser.getState().userLevel;
 },
  setsoundActive: (active) => set(() => ({ soundActive: active })),
   getsoundActive: () => {
    return useGlobalStoreUser.getState().soundActive;
  },
}));

export {useGlobalStoreUser, Genders, Levels};
