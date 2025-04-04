/* eslint-disable prettier/prettier */
import { NavigationProp } from '@react-navigation/native';
import { create } from 'zustand';
import { RootStackParams } from '../routes/StackNavigator';
import { LogCompletedSession } from '../logger/LogInterface';
import logger from '../logger/Logger';
import { logTypes, objectTypes } from '../logger/LogEnums';

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
  imagesPerRound: string;
  rounds: string;
  correctsPerRound: string;
}

interface SetupState {
  session: Session;
  isInSession: boolean,
  currentModuleIndex: number;
  correctAnswersSession: number;
  wrongAnswersSession: number;
  roundsPlayedSession: number;
  nextModule: (navigate: NavigationProp<RootStackParams>['navigate']) => void;

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

  // Actions
  setIsInSession: (value: boolean) => void;
  setCorrectAnswersSession: (value: number) => void;
  setWrongAnswersSession: (value: number) => void;
  setRoundsPlayedSession: (value: number) => void;
  setSessionModules: (modules: (VocabularyConfig | SequenceConfig | EmotionsConfig)[]) => void;
  addModuleToSession: (module: VocabularyConfig | SequenceConfig | EmotionsConfig) => void;
  removeModuleFromSession: (module: VocabularyConfig | SequenceConfig | EmotionsConfig) => void;
  resetSession: () => void;

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
  defaultEmotionsConfig: { alias: 'Predeterminado', emotion: 'Felicidad', imagesPerRound: '3', correctsPerRound: '1', rounds: '3' },

  isInSession: false,

  correctAnswersSession: 0,
  wrongAnswersSession: 0,
  roundsPlayedSession: 0,

  session: {
    modules: [
      { alias: 'Predeterminado', category: 'Animal', imagesPerRound: '3', rounds: '3' } as VocabularyConfig,
      { alias: 'Predeterminado', sequence: 'Lavado de manos' } as SequenceConfig,
      { alias: 'Predeterminado', emotion: 'Felicidad', imagesPerRound: '3', correctsPerRound: '1', rounds: '3' } as EmotionsConfig,
    ],
  },
  currentModuleIndex: -1,

  nextModule: (navigate) => {
    set((state) => {
      const nextIndex = state.currentModuleIndex + 1;
      if (nextIndex < state.session.modules.length) {
        const nextModule = state.session.modules[nextIndex];

        if ('category' in nextModule) { navigate('GameVocabulary', nextModule as unknown as RootStackParams['GameVocabulary']); }
        else if ('sequence' in nextModule) { navigate('GameSequencePreview', nextModule as unknown as RootStackParams['GameSequencePreview']); }
        else if ('emotion' in nextModule) { navigate('GameEmotions', nextModule as unknown as RootStackParams['GameEmotions']); }

        return { currentModuleIndex: nextIndex };
      } else {
        state.setIsInSession(false);

        const { correctAnswersSession, wrongAnswersSession, roundsPlayedSession, setCorrectAnswersSession, setWrongAnswersSession, setRoundsPlayedSession } = get();

        //LOG Final de sesion
        const logFinSesion: LogCompletedSession = {
          action: logTypes.Completed,
          object: objectTypes.Session,
          timestamp: new Date().toISOString(),
          otherInfo: '',
        };

        logger.log(logFinSesion);

        navigate('GameOver', {
          correctAnswers: correctAnswersSession,
          wrongAnswers: wrongAnswersSession,
          roundsPlayed: roundsPlayedSession
        });

        setCorrectAnswersSession(0);
        setWrongAnswersSession(0);
        setRoundsPlayedSession(0);

        return { currentModuleIndex: -1 };
      }
    });
  },

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

  //SESIÓN
  setIsInSession: (value: boolean) => set({ isInSession: value }),
  setCorrectAnswersSession: (value: number) => set({ correctAnswersSession: value }),
  setWrongAnswersSession: (value: number) => set({ wrongAnswersSession: value }),
  setRoundsPlayedSession: (value: number) => set({ roundsPlayedSession: value }),

  setSessionModules: (modules) => set({ session: { modules } }),

  addModuleToSession: (module) =>
    set((state) => ({ session: { modules: [...state.session.modules, module] } })),

  removeModuleFromSession: (module) =>
    set((state) => ({
      session: {
        modules: state.session.modules.filter((mod) => mod !== module),
      },
    })),

  resetSession: () =>
    set({
      session: {
        modules: [
          get().defaultVocabularyConfig,
          get().defaultSequenceConfig,
          get().defaultEmotionsConfig,
        ],
      },
      currentModuleIndex: -1,
    }),

}));

export default useGlobalStoreSetup;
