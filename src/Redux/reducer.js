export const initialState = {
  screenSize: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  currentPlayer: 0,
  players: 2,
  size: {
    rows: 3,
    cols: 3
  },
  shapes: [
    "circle.png",
    "cross.png"
  ]
};

export const Reducer = (state = initialState, action) => {
  switch(action.type) {
    case "SET_SCREEN_SIZE":
      return {
        ...state, screenSize: action.data
      };
    case "SET_CURRENT_PLAYER":
      return {
        ...state, currentPlayer: action.data
      };
    default:
      return state;
  }
};
