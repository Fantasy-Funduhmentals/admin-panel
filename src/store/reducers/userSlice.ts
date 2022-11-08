import { createSlice } from "@reduxjs/toolkit";

export type userState = {
  accessToken: string | null;
  users: any[];
  role: string | any;
  userId: string;
  masterBalances: {
    graph: any;
    futureProjects: any;
    residentialProjects: any;
    completedProjects: any;
    totalBuyers: any;
    totalSellers: any;
    reservedProjects: any;
    commercialProjects: any;
    totalProjects: any;
    profit: any;
    investment: any;
    users: any;
  };
};

const initialState: userState = {
  accessToken: null,
  users: [],
  role: "",
  masterBalances: {
    graph: null,
    futureProjects: "0",
    residentialProjects: "0",
    completedProjects: "0",
    totalBuyers: "0",
    totalSellers: "0",
    reservedProjects: "0",
    commercialProjects: "0",
    totalProjects: "0",
    profit: "0",
    investment: "0",
    users: "0",
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
    saveUserRole: (state, action) => {
      state.role = action.payload;
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
  saveUserRole,
  resetUserState,
  saveUsers,
  saveMasterBalances,
} = userSlice.actions;

export default userSlice.reducer;
