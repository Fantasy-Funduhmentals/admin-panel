import { combineReducers, compose } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import {
  Action,
  configureStore,
  ThunkAction,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import ReduxThunk from "redux-thunk";
import userSlice from "./reducers/userSlice";
import coinSlice from "./reducers/coinSlice";
import tokenSlice from "./reducers/tokenSlice";
import requestSlice from "./reducers/requestSlice";

declare var window: any;

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user", "coin", "token", "request"],
  blacklist: [],
  transforms: [],
};

const reducers = combineReducers({
  user: userSlice,
  coin: coinSlice,
  token: tokenSlice,
  request: requestSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const middleware: any = getDefaultMiddleware({
  serializableCheck: false,
  immutableCheck: false,
}).concat(ReduxThunk);

let enhancedCompose = compose;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: enhancedCompose(middleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
