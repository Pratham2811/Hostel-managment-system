// client/src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure } = authSlice.actions;
export default authSlice.reducer;