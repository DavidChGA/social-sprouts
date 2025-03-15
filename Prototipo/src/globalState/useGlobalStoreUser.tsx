import { create } from 'zustand';

enum Genders{
  Male = "M",
  Female = "F",
  NonBinary = "NB"
}

interface UserState {
  userName: string,
  userAge: number,
  userGender: Genders,
  userId: string,

  setUserName: (name: string) => void;
  getUserName: () => string;
  setUserAge: (age: number) => void;
  getUserAge: () => number;
  setUserGender: (gender: Genders) => void;
  getUserGender: () => Genders;
  setUserId: (id: string) => void;
  getUserId: () => string;
}

// Crea el store global con Zustand
const useGlobalStoreUser = create<UserState>((set) => ({
  userName: "UserTest",
  userAge: 8,
  userGender: Genders.NonBinary,
  userId: "esto no es un id",

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
}));

export {useGlobalStoreUser, Genders};