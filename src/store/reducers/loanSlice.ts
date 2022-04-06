import { createSlice } from "@reduxjs/toolkit";

export type requestState = {
  loanRequests: any[];
};

const initialState: requestState = {
  loanRequests: [],
};

export const loanRequestSlice = createSlice({
  name: "loanrequest",
  initialState,
  reducers: {
    resetLoanRequestState: (state) => initialState,
    saveLoanRequests: (state, action) => {
      state.loanRequests = action.payload;
    },
  },
});

export const { resetLoanRequestState, saveLoanRequests } =
  loanRequestSlice.actions;

export default loanRequestSlice.reducer;
