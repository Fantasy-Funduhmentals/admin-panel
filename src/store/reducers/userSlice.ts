import { createSlice } from "@reduxjs/toolkit";

export type userState = {
  accessToken: string | null;
  users: any[];
};

const initialState: userState = {
  accessToken: null,
  users: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => initialState,
    saveAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    saveUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { saveAccessToken, resetUserState, saveUsers } = userSlice.actions;

export default userSlice.reducer;
