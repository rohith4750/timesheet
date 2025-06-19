import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SetupData {
  clinicCount: number;
  labCount: number;
  userCount: number;
}

interface DashboardState {
  setupData: SetupData;
  setupStatus: {
    value: boolean;
  };
}

const initialState: DashboardState = {
  setupData: {
    clinicCount: 0,
    labCount: 0,
    userCount: 0
  },
  setupStatus: {
    value: false
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSetupData: (state, action: PayloadAction<SetupData>) => {
      state.setupData = action.payload;
    },
    setSetupStatus: (state, action: PayloadAction<boolean>) => {
      state.setupStatus.value = action.payload;
    }
  }
});

export const { setSetupData, setSetupStatus } = dashboardSlice.actions;

export const selectSetupData = (state: { dashboard: DashboardState }) => state.dashboard.setupData;
export const selectSetupStatus = (state: { dashboard: DashboardState }) => state.dashboard.setupStatus;

export default dashboardSlice.reducer; 