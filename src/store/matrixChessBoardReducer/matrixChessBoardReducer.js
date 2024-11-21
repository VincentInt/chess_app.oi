import { createSlice, current } from "@reduxjs/toolkit";
const defaultState = {
  statusWin: false,
  destroyedFigures: [],
  matrixBoard: [
    { team: "white", type: "rook" },
    { team: "white", type: "knight" },
    { team: "white", type: "bishop" },
    { team: "white", type: "king" },
    { team: "white", type: "queen" },
    { team: "white", type: "bishop" },
    { team: "white", type: "knight" },
    { team: "white", type: "rook" },
    { team: "white", type: "pawn" },
    { team: "white", type: "pawn" },
    { team: "white", type: "pawn" },
    { team: "white", type: "pawn" },
    { team: "white", type: "pawn" },
    { team: "white", type: "pawn" },
    { team: "white", type: "pawn" },
    { team: "white", type: "pawn" },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { team: "black", type: "pawn" },
    { team: "black", type: "pawn" },
    { team: "black", type: "pawn" },
    { team: "black", type: "pawn" },
    { team: "black", type: "pawn" },
    { team: "black", type: "pawn" },
    { team: "black", type: "pawn" },
    { team: "black", type: "pawn" },
    { team: "black", type: "rook" },
    { team: "black", type: "knight" },
    { team: "black", type: "bishop" },
    { team: "black", type: "king" },
    { team: "black", type: "queen" },
    { team: "black", type: "bishop" },
    { team: "black", type: "knight" },
    { team: "black", type: "rook" },
  ],
};

const matrixChessBoardSlice = createSlice({
  name: "chessBoard",
  initialState: defaultState,
  reducers: {
    resetBoard() {
      return { ...defaultState };
    },
    loadBoard(state, action) {
      const cloneState = current(state);
      const payload = action.payload;

      return {
        ...cloneState,
        destroyedFigures: payload.destroyedFigures,
        matrixBoard: payload.matrixBoard,
      };
    },
    moveFigure(state, action) {
      const cloneState = current(state);
      const matrixBoard = [...cloneState.matrixBoard];
      const payload = action.payload;

      const destroyedFigures = [
        ...cloneState.destroyedFigures,
        ...payload?.damage?.map((item) => {
          const destroyedItem = { figure: matrixBoard[item], index: item };
          matrixBoard[item] = {};
          return destroyedItem;
        }),
      ];
      matrixBoard[payload.endIndex] = matrixBoard[payload.startIndex];
      matrixBoard[payload.startIndex] = {};

      return { destroyedFigures, matrixBoard };
    },
    winningCheck(state, action) {
      const cloneState = current(state);
      const payload = action.payload;
      return { ...cloneState, statusWin: payload.teamLose };
    },
  },
});
export const {resetBoard, loadBoard, moveFigure, winningCheck } =
  matrixChessBoardSlice.actions;
export default matrixChessBoardSlice.reducer;
