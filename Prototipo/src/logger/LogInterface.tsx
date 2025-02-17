import logTypes from "./LogTypesEnum"

interface Log {
    player: string;
    action: logTypes;
    object: string;
    timestamp: string;
    otherInfo: string;
  }

interface LogInitializedGame extends Log {
    rounds: number;
    imagesPerRound: number;
}

interface LogInitializedRound extends Log {
  correctOption: string;
  otherOptions: string[];
}

interface LogCompleted extends Log {

}

interface LogProgressed extends Log {

}

interface LogSelect extends Log {
  result: string;
  selectedOption: string;
  correctOption: string;
}

export {Log, LogCompleted, LogInitializedGame, LogInitializedRound, LogProgressed, LogSelect};