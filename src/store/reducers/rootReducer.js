import { combineReducers } from "redux";
import authReducer from "./authReducer";
import walletReducer from "./walletReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  wallet: walletReducer,
});

export default rootReducer;
