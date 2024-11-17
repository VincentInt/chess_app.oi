import { combineReducers, configureStore } from "@reduxjs/toolkit";
import matrixChessBoardSlice from "./matrixChessBoardReducer/matrixChessBoardReducer";

const rootReducer = combineReducers({
  chessBoard: matrixChessBoardSlice,
});

export const store = configureStore({ reducer: rootReducer });
