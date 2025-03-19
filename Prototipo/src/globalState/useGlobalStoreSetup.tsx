/* eslint-disable prettier/prettier */
import { NavigationProp } from '@react-navigation/native';
import { create } from 'zustand';
import { RootStackParams } from '../routes/StackNavigator';

interface Session {
  modules: (VocabularyConfig | SequenceConfig | EmotionsConfig)[];
}

interface Config {
  alias: string;
}

interface VocabularyConfig extends Config {
  category: string;
  imagesPerRound: string;
  rounds: string;
}

interface SequenceConfig extends Config {
  sequence: string;
}

interface EmotionsConfig extends Config {
  emotion: string;
  images: string;
  rounds: string;
  correctsPerRound: string;
}

interface SetupState {
  session: Session;
  isInSession: Boolean, 
  currentModuleIndex: number;
  nextModule: (navigate: NavigationProp<RootStackParams>['navigate']) => void;
  setIsInSession: (value: boolean) => void;

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
  vocabularyConfigs: [],
  sequenceConfigs: [],
  emotionsConfigs: [],

  selectedVocabularyConfig: null,
  selectedSequenceConfig: null,
  selectedEmotionsConfig: null,

  defaultVocabularyConfig: { alias: 'Predeterminado', category: 'Animal', imagesPerRound: '3', rounds: '3' },
  defaultSequenceConfig: { alias: 'Predeterminado', sequence: 'Lavado de manos' },
  defaultEmotionsConfig: { alias: 'Predeterminado', emotion: 'Felicidad', images: '3', rounds: '3', correctsPerRound: '1' },

  isInSession: false,
  session: {
    modules: [
      { alias: 'Predeterminado', category: 'Animal', imagesPerRound: '3', rounds: '3' } as VocabularyConfig,
      { alias: 'Predeterminado', sequence: 'Lavado de manos' } as SequenceConfig,
      { alias: 'Predeterminado', emotion: 'Felicidad', images: '3', rounds: '3', correctsPerRound: '1' } as EmotionsConfig
    ]
  },
  currentModuleIndex: -1,
  

  nextModule: (navigate) => {
    set((state) => {
      const nextIndex = state.currentModuleIndex + 1;
      if (nextIndex < state.session.modules.length) {
        const nextModule = state.session.modules[nextIndex];

        if ('category' in nextModule) 
          navigate('GameVocabulary', nextModule as unknown as RootStackParams['GameVocabulary']);
        else if ('sequence' in nextModule) 
          navigate('GameSequencePreview', nextModule as unknown as RootStackParams['GameSequencePreview']); 
        /*else if ('emotion' in nextModule) 
          console.log('emociones')
          //navigate('GameVocabulary', nextModule as unknown as RootStackParams['GameVocabulary']);
        */

        return { currentModuleIndex: nextIndex };
      } else {
        //Falta
        navigate('GameOver', {
            attempts: state.session.modules.length,
            roundsPlayed: state.session.modules.length,
        });
        return { currentModuleIndex: -1 }; 
      }
    });
  },

  setIsInSession: (value: boolean) => set({ isInSession: value }),

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
