enum logTypes {
    Initialized = "INITIALIZED",
    Completed = "COMPLETED",
    Progressed = "PROGRESSED",
    Selected = "SELECTED",
    Creation = "CREATION",
  }

  enum objectTypes {
    Game = "GAME",
    Round = "ROUND",
    Player = "PLAYER",
    Session = "SESSION",
  }

  enum gameTypes {
    Vocabulary = "VOCABULARY",
    Sequence = "SEQUENCE",
    Emotions = "EMOTIONS",
  }

export {logTypes, objectTypes, gameTypes};