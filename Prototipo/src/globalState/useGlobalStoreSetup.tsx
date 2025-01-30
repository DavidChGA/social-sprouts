import { create } from 'zustand';

interface SetupState {
  selectedCategory: string;
  selectedImages: string;
  selectedRounds: string;
  setSelectedCategory: (category: string) => void;
  setSelectedImages: (images: string) => void;
  setSelectedRounds: (rounds: string) => void;
}

// Crea el store global con Zustand
const useGlobalStoreSetup = create<SetupState>((set) => ({
  selectedCategory: "Animales",
  selectedImages: "3",
  selectedRounds: "2",
  setSelectedCategory: (category) => set(() => ({ selectedCategory: category })),
  setSelectedImages: (images) => set(() => ({ selectedImages: images })),
  setSelectedRounds: (rounds) => set(() => ({ selectedRounds: rounds })),
}));

export default useGlobalStoreSetup;