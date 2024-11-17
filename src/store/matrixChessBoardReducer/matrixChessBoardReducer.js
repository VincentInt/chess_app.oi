import { createAction, createReducer, current } from "@reduxjs/toolkit";
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

export const moveFigure = createAction("MOVE_FIGURE");
export const winningCheck = createAction("STATUS_WINNING");

export default createReducer(defaultState, (builder) => {
  builder.addCase(moveFigure, function (state, action) {
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
  });
  builder.addCase(winningCheck, function (state, action) {
    const cloneState = current(state);
    const payload = action.payload;
    return { ...cloneState, statusWin: payload.teamLose };
  });
});
