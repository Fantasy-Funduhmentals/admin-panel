import { createSlice } from "@reduxjs/toolkit";

export type requestState = {
  nftRequests: any[];
};

const initialState: requestState = {
  nftRequests: [],
};

export const nftRequestSlice = createSlice({
  name: "nftRequest",
  initialState,
  reducers: {
    resetNftRequestState: (state) => initialState,
    saveNftRequests: (state, action) => {
      state.nftRequests = action.payload;
    },
  },
});

export const { resetNftRequestState, saveNftRequests } =
  nftRequestSlice.actions;

export default nftRequestSlice.reducer;
