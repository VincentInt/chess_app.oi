import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { userReducer } from "./userReducer/usersReducer";
import { matrixChessBoardReducer } from "./matrixChessBoardReducer/matrixChessBoardReducer";

const rootReducer = combineReducers({
  user: userReducer,
  chessBoard: matrixChessBoardReducer,
});
export const store = createStore(rootReducer, composeWithDevTools());
