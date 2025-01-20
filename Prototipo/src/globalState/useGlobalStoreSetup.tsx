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
  selectedCategory: "",
  selectedImages: "",
  selectedRounds: "",
  setSelectedCategory: () => set((state) => ({selectedCategory: state.selectedCategory})),
  setSelectedImages: () => set((state) => ({selectedImages: state.selectedImages})),
  setSelectedRounds: () => set((state) => ({selectedRounds: state.selectedRounds}))
}));

export default useGlobalStoreSetup;