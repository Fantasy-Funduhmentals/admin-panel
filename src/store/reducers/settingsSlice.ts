import { createSlice } from "@reduxjs/toolkit";

export type settingsState = {
  settings: any;
};

const initialState: settingsState = {
  settings:"",
};

export const settingsSlice = createSlice({
  name: "maintenanceMode",
  initialState,
  reducers: {
    resetSettingsState: (state) => initialState,
    saveSettings: (state, action) => {
      state.settings = action.payload;
    },

  },
});

export const { saveSettings, resetSettingsState } =
  settingsSlice.actions;

export default settingsSlice.reducer;
