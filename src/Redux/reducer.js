export const initialState = {
  screenSize: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  currentPlayer: 0,
  size: {
    rows: 3,
    cols: 3
  }
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
