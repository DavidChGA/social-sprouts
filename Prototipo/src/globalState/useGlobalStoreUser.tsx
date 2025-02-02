import { create } from 'zustand';

interface UserState {
  userName: string
  setUserName: (name: string) => void;
}

// Crea el store global con Zustand
const useGlobalStoreUser = create<UserState>((set) => ({
  userName: "Prueba",
  setUserName: (name) => set(() => ({ userName: name })),
}));

export default useGlobalStoreUser;