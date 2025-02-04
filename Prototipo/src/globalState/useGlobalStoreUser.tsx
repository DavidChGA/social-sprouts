import { create } from 'zustand';

interface UserState {
  userName: string
  setUserName: (name: string) => void;
  getUserName: () => string;
}

// Crea el store global con Zustand
const useGlobalStoreUser = create<UserState>((set) => ({
  userName: "UserTest",
  setUserName: (name) => set(() => ({ userName: name })),
   getUserName: () => {
    return useGlobalStoreUser.getState().userName;
  },
}));

export default useGlobalStoreUser;