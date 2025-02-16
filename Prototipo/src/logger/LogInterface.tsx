import logTypes from "./LogTypesEnum"

interface Log {
    player: string,
    action: logTypes,
    object: string,
    timestamp: string,
    correctOption: string,
    otherOptions: string[],
    result: string,
    selectedOption: string,
    otherInfo: string
  }

export default Log