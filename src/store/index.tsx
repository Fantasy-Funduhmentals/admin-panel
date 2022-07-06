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
import chatSlice from "./reducers/chatSlice";
import nftSlice from "./reducers/nftSlice";
import nftRequest from "./reducers/nftRequestSlice";
import subscriptionSlice from "./reducers/subscriptionSlice";
import loanRequestSlice from "./reducers/loanSlice.ts";
import newsLetterSlice from "./reducers//newsLetterSlice";
import directWireSlice from "./reducers/directWire";
import completeDirectWireSlice from "./reducers/completeDirectWire";
import AdminSlice from "./reducers/adminSlice";
import settingsSlice from "./reducers/settingsSlice";
import EmailSlice from "./reducers/emailSlice";
declare var window: any;

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: [
    "user",
    "email",
    "coin",
    "token",
    "settings",
    "request",
    "chat",
    "nft",
    "nftRequest",
    "subscription",
    "loanrequest",
    "newsletter",
    "directWire",
    "completeDirectWire",
  ],
  blacklist: [],
  transforms: [],
};

const reducers = combineReducers({
  user: userSlice,
  email: EmailSlice,
  coin: coinSlice,
  token: tokenSlice,
  settings: settingsSlice,
  request: requestSlice,
  chat: chatSlice,
  nft: nftSlice,
  adminUser: AdminSlice,
  nftRequest: nftRequest,
  subscription: subscriptionSlice,
  loanRequest: loanRequestSlice,
  newsletter: newsLetterSlice,
  directWire: directWireSlice,
  completeDirectWire: completeDirectWireSlice,
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
