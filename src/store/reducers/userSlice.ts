import { createSlice } from "@reduxjs/toolkit";

export type userState = {
  accessToken: string | null;
  users: any[];
  userId: string;
  masterBalances: {
    bnb: string;
    btc: string;
    eth: string;
  };
};

const initialState: userState = {
  accessToken: null,
  users: [],
  masterBalances: {
    bnb: "0",
    btc: "0",
    eth: "0",
  },
  userId: "ADMIN",
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
    saveMasterBalances: (state, action) => {
      state.masterBalances = action.payload;
    },
  },
});

export const {
  saveAccessToken,
  resetUserState,
  saveUsers,
  saveMasterBalances,
} = userSlice.actions;

export default userSlice.reducer;
