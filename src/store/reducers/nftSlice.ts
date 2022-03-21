import { createSlice } from "@reduxjs/toolkit";

export type nftState = {
  nft: any[];
  userNft: any[];
};

const initialState: nftState = {
  nft: [],
  userNft: [],
};

export const tokenSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    resetNFTState: (state) => initialState,
    saveNFT: (state, action) => {
      state.nft = action.payload;
    },
    saveUserNft: (state, action) => {
      state.userNft = action.payload;
    },
  },
});

export const { saveNFT, resetNFTState, saveUserNft } = tokenSlice.actions;

export default tokenSlice.reducer;
