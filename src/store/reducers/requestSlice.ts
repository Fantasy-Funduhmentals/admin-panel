import { createSlice } from "@reduxjs/toolkit";

export type requestState = {
  requests: any[];
};

const initialState: requestState = {
  requests: [],
};

export const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    resetRequestState: (state) => initialState,
    saveRequests: (state, action) => {
      state.requests = action.payload;
    },
  },
});

export const { resetRequestState, saveRequests } = requestSlice.actions;

export default requestSlice.reducer;
