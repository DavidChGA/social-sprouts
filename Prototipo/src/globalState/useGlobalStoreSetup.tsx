/* eslint-disable prettier/prettier */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Config {
  alias: string;
}

export interface VocabularyConfig extends Config {
  category: string;
  imagesPerRound: string;
  rounds: string;
}

export interface SequenceConfig extends Config {
  sequence: string;
}

export interface EmotionsConfig extends Config {
  emotion: string;
  imagesPerRound: string;
  rounds: string;
  correctsPerRound: string;
}

interface SetupState {
  vocabularyConfigs: VocabularyConfig[];
  sequenceConfigs: SequenceConfig[];
  emotionsConfigs: EmotionsConfig[];

  selectedVocabularyConfig: VocabularyConfig | null;
  selectedSequenceConfig: SequenceConfig | null;
  selectedEmotionsConfig: EmotionsConfig | null;

  defaultVocabularyConfig: VocabularyConfig;
  defaultSequenceConfig: SequenceConfig;
  defaultEmotionsConfig: EmotionsConfig;

  // Actions
  addVocabularyConfig: (config: VocabularyConfig) => void;
  updateVocabularyConfig: (alias: string, config: Partial<VocabularyConfig>) => void;
  removeVocabularyConfig: (alias: string) => void;
  selectVocabularyConfig: (alias: string) => void; //select

  // Actions
  addSequenceConfig: (config: SequenceConfig) => void;
  updateSequenceConfig: (alias: string, config: Partial<SequenceConfig>) => void;
  removeSequenceConfig: (alias: string) => void;
  selectSequenceConfig: (alias: string) => void; //select

  // Actions
  addEmotionsConfig: (config: EmotionsConfig) => void;
  updateEmotionsConfig: (alias: string, config: Partial<EmotionsConfig>) => void;
  removeEmotionsConfig: (alias: string) => void;
  selectEmotionsConfig: (alias: string) => void; //select
}

const useGlobalStoreSetup = create<SetupState>()(
  persist(
    (set, get) => ({
      vocabularyConfigs: [],
      sequenceConfigs: [],
      emotionsConfigs: [],

      selectedVocabularyConfig: null,
      selectedSequenceConfig: null,
      selectedEmotionsConfig: null,

      defaultVocabularyConfig: { alias: 'Predeterminado', category: 'Animal', imagesPerRound: '3', rounds: '3' },
      defaultSequenceConfig: { alias: 'Predeterminado', sequence: 'Lavado de manos' },
      defaultEmotionsConfig: { alias: 'Predeterminado', emotion: 'Felicidad', imagesPerRound: '3', correctsPerRound: '1', rounds: '3' },


      // VOCABULARIO
      addVocabularyConfig: (config) =>
        set((state) => ({
          vocabularyConfigs: [...state.vocabularyConfigs, config],
        })),
      updateVocabularyConfig: (alias, newConfig) =>
        set((state) => ({
          vocabularyConfigs: state.vocabularyConfigs.map((config) =>
            config.alias === alias ? { ...config, ...newConfig } : config
          ),
        })),
      removeVocabularyConfig: (alias) =>
        set((state) => ({
          vocabularyConfigs: state.vocabularyConfigs.filter(
            (config) => config.alias !== alias
          ),
          selectedVocabularyConfig:
            state.selectedVocabularyConfig?.alias === alias ? null : state.selectedVocabularyConfig,
        })),
      selectVocabularyConfig: (alias) =>
        set((state) => ({
          selectedVocabularyConfig: state.vocabularyConfigs.find(
            (config) => config.alias === alias
          ) || null,
        })),

      // SECUENCIAS
      addSequenceConfig: (config) =>
        set((state) => ({
          sequenceConfigs: [...state.sequenceConfigs, config],
        })),
      updateSequenceConfig: (alias, newConfig) =>
        set((state) => ({
          sequenceConfigs: state.sequenceConfigs.map((config) =>
            config.alias === alias ? { ...config, ...newConfig } : config
          ),
        })),
      removeSequenceConfig: (alias) =>
        set((state) => ({
          sequenceConfigs: state.sequenceConfigs.filter(
            (config) => config.alias !== alias
          ),
          selectedSequenceConfig:
            state.selectedSequenceConfig?.alias === alias ? null : state.selectedSequenceConfig,
        })),
      selectSequenceConfig: (alias) =>
        set((state) => ({
          selectedSequenceConfig: state.sequenceConfigs.find(
            (config) => config.alias === alias
          ) || null,
        })),

      //EMOCIONES
      addEmotionsConfig: (config) =>
        set((state) => ({
          emotionsConfigs: [...state.emotionsConfigs, config],
        })),
      updateEmotionsConfig: (alias, newConfig) =>
        set((state) => ({
          emotionsConfigs: state.emotionsConfigs.map((config) =>
            config.alias === alias ? { ...config, ...newConfig } : config
          ),
        })),
      removeEmotionsConfig: (alias) =>
        set((state) => ({
          emotionsConfigs: state.emotionsConfigs.filter(
            (config) => config.alias !== alias
          ),
          selectedEmotionsConfig:
            state.selectedEmotionsConfig?.alias === alias ? null : state.selectedEmotionsConfig,
        })),
      selectEmotionsConfig: (alias) =>
        set((state) => ({
          selectedEmotionsConfig: state.emotionsConfigs.find(
            (config) => config.alias === alias
          ) || null,
        })),
      }),
      {
        name: 'setup-storage', // nombre para tu storage
        storage: createJSONStorage(() => AsyncStorage), // usar AsyncStorage
      }
    )
  );

export default useGlobalStoreSetup;
