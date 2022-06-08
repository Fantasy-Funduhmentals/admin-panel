import { createSlice } from "@reduxjs/toolkit";

export type tokenState = {
  tokens: any[];
  users: any[];
};

const initialState: tokenState = {
  tokens: [],
  users: [],
};

export const AdminSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    resetTokenState: (state) => initialState,
    saveTokens: (state, action) => {
      state.tokens = action.payload;
    },
    saveAdminUser: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { saveTokens, resetTokenState, saveAdminUser } =
  AdminSlice.actions;

export default AdminSlice.reducer;
