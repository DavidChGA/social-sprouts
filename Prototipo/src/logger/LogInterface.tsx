import { Genders } from "../globalState/useGlobalStoreUser";
import { gameTypes, logTypes, objectTypes } from "./LogEnums";

interface Log {
    player: userData;
    action: logTypes;
    object: objectTypes;
    timestamp: string;
    otherInfo: string;
  }

interface LogInitializedGame extends Log {
    gameType: gameTypes;
    category: string;
    rounds: number;
    imagesPerRound: number;
}

interface LogInitializedRound extends Log {
  correctOption: string;
  allOptions: string[];
}

interface LogCompleted extends Log {

}

interface LogProgressed extends Log {

}

interface LogSelect extends Log {
  result: boolean;
  selectedOption: string;
  correctOption: string;
}

interface userData{
    userName: string;
    userAge: number;
    userGender: Genders;
}

export {Log, LogCompleted, LogInitializedGame, LogInitializedRound, LogProgressed, LogSelect};