import { createSlice } from "@reduxjs/toolkit";

export type nftState = {
  directWire: any[];
  // userNft: any[];
};

const initialState: nftState = {
  directWire: [],
  // userNft: [],
};

export const directWireSlice = createSlice({
  name: "directWire",
  initialState,
  reducers: {
    resetDirectWireState: (state) => initialState,
    saveDirectWire: (state, action) => {
      state.directWire = action.payload;
    },
    // saveUserNft: (state, action) => {
    //   state.userNft = action.payload;
    // },
  },
});

export const { saveDirectWire, resetDirectWireState } = directWireSlice.actions;

export default directWireSlice.reducer;
