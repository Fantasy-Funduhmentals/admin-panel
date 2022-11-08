import { createSlice } from "@reduxjs/toolkit";

export type requestState = {
  subscriptionList: any[];
};

const initialState: requestState = {
  subscriptionList: [],
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    resetSubscriptionState: (state) => initialState,
    saveSubscriptionData: (state, action) => {
      state.subscriptionList = action.payload;
    },
  },
});

export const { resetSubscriptionState, saveSubscriptionData } =
  subscriptionSlice.actions;

export default subscriptionSlice.reducer;
