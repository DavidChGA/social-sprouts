/* eslint-disable prettier/prettier */
import { create } from 'zustand';

interface Session {
  modules: Config[];
}

interface Config {
  alias: string;
}

interface VocabularyConfig extends Config {
  category: string;
  images: string;
  rounds: string;
}

interface SequenceConfig extends Config {
  sequence: string;
}

interface EmotionsConfig extends Config {
  emotion: string;
  images: string;
  rounds: string;
}

interface SetupState {
  session: Session;
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

const useGlobalStoreSetup = create<SetupState>((set, get) => ({
  session: { modules: [] },

  vocabularyConfigs: [],
  sequenceConfigs: [],
  emotionsConfigs: [],

  selectedVocabularyConfig: null,
  selectedSequenceConfig: null,
  selectedEmotionsConfig: null,

  defaultVocabularyConfig: { alias: 'Predeterminado', category: 'Animal', images: '3', rounds: '3' },
  defaultSequenceConfig: { alias: 'Predeterminado', sequence: 'Lavado de manos' },
  defaultEmotionsConfig: { alias: 'Predeterminado', emotion: 'Alegria', images: '', rounds: '' },

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

}));

export default useGlobalStoreSetup;
