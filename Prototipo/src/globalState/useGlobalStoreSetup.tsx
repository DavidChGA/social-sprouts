/* eslint-disable prettier/prettier */
import { create } from 'zustand';

interface SetupState {
  //VOCABULARIO
  selectedCategory: string;
  selectedImages: string;
  selectedRounds: string;
  setSelectedCategory: (category: string) => void;
  setSelectedImages: (images: string) => void;
  setSelectedRounds: (rounds: string) => void;

  //SECUENCIAS
  selectedSequence: string;
  setSelectedSequence: (sequence: string) => void;
}

// Crea el store global con Zustand
const useGlobalStoreSetup = create<SetupState>((set) => ({
  //VOCABULARIO
  selectedCategory: 'Animal',
  selectedImages: '3',
  selectedRounds: '2',
  setSelectedCategory: (category) => set(() => ({ selectedCategory: category })),
  setSelectedImages: (images) => set(() => ({ selectedImages: images })),
  setSelectedRounds: (rounds) => set(() => ({ selectedRounds: rounds })),

  //SECUENCIAS
  selectedSequence: 'Lavado de manos',
  setSelectedSequence: (sequence) => set(() => ({ selectedSequence: sequence })),
}));

export default useGlobalStoreSetup;
