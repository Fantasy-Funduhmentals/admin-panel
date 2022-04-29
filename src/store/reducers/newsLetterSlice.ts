import { createSlice } from "@reduxjs/toolkit";

export type nftState = {
  newsletterList: any[];
};

const initialState: nftState = {
  newsletterList: [],
};

export const tokenSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    resetnewsletterState: (state) => initialState,
    saveNewsletter: (state, action) => {
      state.newsletterList = action.payload;
    },
  },
});

export const { saveNewsletter, resetnewsletterState } = tokenSlice.actions;

export default tokenSlice.reducer;
