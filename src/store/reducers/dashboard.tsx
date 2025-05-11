import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    setupStatus: {},
    setupData: {},
    setupMenu: false,
    email: null,
  },
  reducers: {
    setSetupStatus: (state, action) => {
      const { setupStatus } = action.payload;
      return { ...state, setupStatus };
    },
    setSetupData: (state, action) => {
      const { setupData } = action.payload;
      return { ...state, setupData };
    },
    setSetupMenu: (state, action) => {
      const { setupMenu } = action.payload;
      return { ...state, setupMenu };
    },
    setEmail: (state, action) => {
      const { email } = action.payload;
      return { ...state, email };
    },
  },
});

export const { setSetupStatus, setSetupData, setSetupMenu, setEmail } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;

// selectors
export const selectSetupStatus = (state: any) => state.dashboard.setupStatus;
export const selectSetupData = (state: any) => state.dashboard.setupData;
export const selectSetupMenu = (state: any) => state.dashboard.setupMenu;
export const selectEmail = (state: any) => state.dashboard.email;
