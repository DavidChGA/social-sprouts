/* eslint-disable prettier/prettier */
import { create } from 'zustand';

interface VocabularyConfig {
  alias: string;
  category: string;
  images: string;
  rounds: string;
}

interface SequenceConfig {
  alias: string;
  sequence: string;
}

interface SetupState {
  vocabularyConfigs: VocabularyConfig[];
  sequenceConfigs: SequenceConfig[];

  selectedVocabularyConfig: VocabularyConfig | null;
  selectedSequenceConfig: SequenceConfig | null;

  defaultVocabularyConfig: VocabularyConfig;
  defaultSequenceConfig: SequenceConfig;

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
}

const useGlobalStoreSetup = create<SetupState>((set, get) => ({
  vocabularyConfigs: [],
  sequenceConfigs: [],
  selectedVocabularyConfig: null,
  selectedSequenceConfig: null,

  defaultVocabularyConfig: { alias: 'Predeterminado', category: 'Animal', images: '3', rounds: '2' },
  defaultSequenceConfig: { alias: 'Predeterminado', sequence: 'Lavado de manos' },

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
}));

export default useGlobalStoreSetup;
