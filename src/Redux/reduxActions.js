export const setScreenSize = (width, height) => ({
  type: "SET_SCREEN_SIZE",
  data: {
    width: width,
    height: height
  }
});

export const setCurrentPlayer = (value) => ({
  type: "SET_CURRENT_PLAYER",
  data: value
});
