import { createSlice } from "@reduxjs/toolkit";

export type tokenState = {
  tokens: any[];
  wallets: any[];
};

const initialState: tokenState = {
  tokens: [],
  wallets: [],
};

export const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    resetTokenState: (state) => initialState,
    saveTokens: (state, action) => {
      state.tokens = action.payload;
    },
    saveNativeWallets: (state, action) => {
      state.wallets = action.payload;
    },
  },
});

export const { saveTokens, resetTokenState, saveNativeWallets } =
  tokenSlice.actions;

export default tokenSlice.reducer;
