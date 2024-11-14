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
const MOVE_FIGURE = "MOVE_FIGURE";
const STATUS_WINNING = "STATUS_WINNING";

export const matrixChessBoardReducer = (state = defaultState, action) => {
  switch (action.type) {
    case STATUS_WINNING: {
      return {...state, statusWin: action.teamLose}
    }
    case MOVE_FIGURE: {
      const matrixBoard = state.matrixBoard;

      const destroyedFigures = [
        ...state.destroyedFigures,
        ...action?.damage?.map((item) => {
          const destroyedItem = { figure: matrixBoard[item], index: item };
          matrixBoard[item] = {};
          return destroyedItem;
        }),
      ];

      matrixBoard[action.endIndex] = matrixBoard[action.startIndex];
      matrixBoard[action.startIndex] = {};

      return { destroyedFigures, matrixBoard };
    }
    default:
      return state;
  }
};

export const moveFigureAction = (action) => ({ type: MOVE_FIGURE, ...action });
export const winningAction = (action) => ({type: STATUS_WINNING, ...action})