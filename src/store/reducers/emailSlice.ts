import { createSlice } from "@reduxjs/toolkit";

export type emailState = {
  email: any | string;
};

const initialState: emailState = {
  email: "",
};

export const EmailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    resetEmailState: (state) => initialState,
    saveEmailUser: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { resetEmailState, saveEmailUser } = EmailSlice.actions;

export default EmailSlice.reducer;
