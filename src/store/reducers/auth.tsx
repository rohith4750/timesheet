import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: null,
    isAuthenticated: false,
    name: null,
    userId: -1,
    token: null,
    loginProcessStatus: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { email, name, seq, token, isAuthenticated } = action.payload;
      state.email = email;
      state.name = name;
      state.userId = seq;
      state.isAuthenticated = isAuthenticated;
      state.token = token;
    },
    setLoginProcessStatus: (state, action) => {
      const { loginProcessStatus } = action.payload;
      state.loginProcessStatus = loginProcessStatus;
    },
  },
});

export const { setCredentials, setLoginProcessStatus } = authSlice.actions;
export default authSlice.reducer;

// selectors
export const selectEmail = (state: { auth: { email: any } }) =>
  state.auth.email;
export const selectIsAuthenticated = (state: {
  auth: { isAuthenticated: any };
}) => state.auth.isAuthenticated;
export const selectName = (state: { auth: { name: any } }) => state.auth.name;
export const selectUserId = (state: { auth: { userId: any } }) =>
  state.auth.userId;
export const selectToken = (state: { auth: { token: any } }) =>
  state.auth.token;
export const selectLoginProcessStatus = (state: {
  auth: { loginProcessStatus: any };
}) => state.auth.loginProcessStatus;
