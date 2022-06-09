import { createSlice } from "@reduxjs/toolkit";

export type tokenState = {
  subadmin: any[];
};

const initialState: tokenState = {
  subadmin: [],
};

export const AdminSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    resetAdminState: (state) => initialState,
    saveAdminUser: (state, action) => {
      state.subadmin = action.payload;
    },
  },
});

export const { resetAdminState, saveAdminUser } = AdminSlice.actions;

export default AdminSlice.reducer;
