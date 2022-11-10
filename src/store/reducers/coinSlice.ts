import { createSlice } from "@reduxjs/toolkit";

export type coinState = {
  coins: any[];
};

const initialState: coinState = {
  coins: [],
};

export const coinSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    resetCoinState: (state) => initialState,
    saveCoins: (state, action) => {
      state.coins = action.payload;
    },
  },
});

export const { saveCoins, resetCoinState } = coinSlice.actions;

export default coinSlice.reducer;
