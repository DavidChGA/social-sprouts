/* eslint-disable prettier/prettier */
import { Genders, Levels } from "../globalState/useGlobalStoreUser";
import { gameTypes, logTypes, objectTypes } from "./LogEnums";

interface Log {
  action: logTypes;
  object: objectTypes;
  timestamp: string;
  otherInfo: string;
}

interface LogGame extends Log {
  playerId: string;
  gameType: gameTypes;
}

interface LogInitializedGame extends LogGame {
  category: string;
}

interface LogInitializedVocabulary extends LogInitializedGame {
  rounds: number;
  imagesPerRound: number;
}

interface LogInitializedEmotions extends LogInitializedGame {
  rounds: number;
  imagesPerRound: number;
  imagesCorrectsPerRound: number;
}

interface LogInitializedSequence extends LogInitializedGame {
  allOptions: string[];
}

interface LogInitializedRound extends LogGame {
  correctOption: string;
  allOptions: string[];
}

interface LogCompleted extends LogGame {

}

interface LogProgressed extends LogGame {

}

interface LogSelect extends LogGame {
  result: boolean;
  selectedOption: string;
  correctOption: string;
}

interface LogChangePlayer extends Log {
  player: userData;
}

interface LogInitializedSession extends Log {
  session: {};
}

interface LogCompletedSession extends Log {
  
}

interface userData {
  userName: string;
  userAge: number;
  userGender: Genders;
  userLevel: Levels;
  userId: string;
  soundActive: boolean;
}

export { Log, LogCompleted, LogInitializedGame, LogInitializedRound, LogProgressed, LogSelect, LogInitializedVocabulary, LogInitializedSequence, LogChangePlayer, userData, LogInitializedEmotions, LogInitializedSession, LogCompletedSession };