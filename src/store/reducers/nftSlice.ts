import { createSlice } from "@reduxjs/toolkit";

export type nftState = {
  nft: any[];
};

const initialState: nftState = {
  nft: [],
};

export const tokenSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    resetNFTState: (state) => initialState,
    saveNFT: (state, action) => {
      state.nft = action.payload;
    },
  },
});

export const { saveNFT, resetNFTState } = tokenSlice.actions;

export default tokenSlice.reducer;
