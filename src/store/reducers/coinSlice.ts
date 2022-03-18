import { createSlice } from "@reduxjs/toolkit";

export type coinState = {
  coins: any[];
  wallets: any[];
};

const initialState: coinState = {
  coins: [],
  wallets: [],
};

export const coinSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    resetCoinState: (state) => initialState,
    saveCoins: (state, action) => {
      state.coins = action.payload;
    },
    saveCryptoWallets: (state, action) => {
      state.wallets = action.payload;
    },
  },
});

export const { saveCoins, resetCoinState, saveCryptoWallets } =
  coinSlice.actions;

export default coinSlice.reducer;
