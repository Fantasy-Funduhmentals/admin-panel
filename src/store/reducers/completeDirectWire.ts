import { createSlice } from "@reduxjs/toolkit";

export type nftState = {
  completeDirectWire: any[];
  // userNft: any[];
};

const initialState: nftState = {
  completeDirectWire: [],
  // userNft: [],
};

export const completeDirectWireSlice = createSlice({
  name: "completeDirectWire",
  initialState,
  reducers: {
    resetCompleteDirectWireState: (state) => initialState,
    saveCompleteDirectWire: (state, action) => {
      state.completeDirectWire = action.payload;
    },
    // saveUserNft: (state, action) => {
    //   state.userNft = action.payload;
    // },
  },
});

export const { saveCompleteDirectWire, resetCompleteDirectWireState } = completeDirectWireSlice.actions;

export default completeDirectWireSlice.reducer;
