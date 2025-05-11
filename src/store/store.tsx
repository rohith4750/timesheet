import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import dashboardReducer from "./reducers/dashboard";

const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
