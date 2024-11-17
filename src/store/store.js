import { combineReducers, configureStore } from "@reduxjs/toolkit";
import matrixChessBoardReducer from "./matrixChessBoardReducer/matrixChessBoardReducer";

const rootReducer = combineReducers({
  chessBoard: matrixChessBoardReducer,
});

export const store = configureStore({ reducer: rootReducer });
